// supabase/functions/ai-analytics/index.ts
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyticsData {
    totalScans: number;
    monthlyScans: number;
    weeklyScans: number;
    deviceTypes: Array<{ type: string; count: number; percentage: number }>;
    topLocations: Array<{ country: string; city?: string; count: number }>;
    hourlyDistribution: Array<{ hour: number; count: number }>;
    scanTrends: Array<{ date: string; scans: number }>;
    cards: Array<{
        id: number;
        firstName: string;
        lastName: string;
        title: string;
        scanCount: number;
        conversionRate: number;
    }>;
    contactsCount: number;
}

interface OpenAIMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

const generateSystemPrompt = () => `
You are an AI analytics expert specializing in digital business card performance and networking insights. 
Your role is to analyze user data and provide actionable, personalized insights that help users improve their networking effectiveness.

Guidelines:
- Be specific and data-driven in your insights
- Provide actionable recommendations
- Focus on optimization opportunities
- Use a professional but friendly tone
- Keep insights concise but valuable
- Always include at least 3-5 insights
- Format insights as bullet points starting with •
- Include specific numbers and percentages when relevant
- Focus on trends, patterns, and optimization opportunities
`;

const generateAnalyticsPrompt = (data: AnalyticsData): string => {
    const bestPerformingCard = data.cards.reduce((best, card) =>
        card.scanCount > best.scanCount ? card : best, data.cards[0]);

    const totalConversionRate = data.contactsCount > 0 && data.totalScans > 0
        ? ((data.contactsCount / data.totalScans) * 100).toFixed(1)
        : '0';

    const peakHour = data.hourlyDistribution.reduce((peak, hour) =>
        hour.count > peak.count ? hour : peak, data.hourlyDistribution[0]);

    const topDevice = data.deviceTypes[0];
    const topLocation = data.topLocations[0];

    return `
Analyze this digital business card performance data and provide insights:

PERFORMANCE METRICS:
- Total scans: ${data.totalScans}
- Monthly scans: ${data.monthlyScans}
- Weekly scans: ${data.weeklyScans}
- Contacts generated: ${data.contactsCount}
- Overall conversion rate: ${totalConversionRate}%

CARDS PERFORMANCE:
${data.cards.map(card =>
        `- ${card.firstName} ${card.lastName} (${card.title}): ${card.scanCount} scans, ${card.conversionRate}% conversion`
    ).join('\n')}

TOP METRICS:
- Best performing card: ${bestPerformingCard?.firstName} ${bestPerformingCard?.lastName} with ${bestPerformingCard?.scanCount} scans
- Peak activity hour: ${peakHour?.hour}:00 with ${peakHour?.count} scans
- Primary device type: ${topDevice?.type} (${topDevice?.percentage}%)
- Top location: ${topLocation?.city ? `${topLocation.city}, ` : ''}${topLocation?.country} (${topLocation?.count} scans)

TRENDS:
Recent scan trend: ${data.scanTrends.slice(-7).map(day => `${day.date}: ${day.scans}`).join(', ')}

Please provide 4-6 actionable insights to help optimize networking performance.
`;
};

async function generateAIInsights(analyticsData: AnalyticsData): Promise<string[]> {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiApiKey) {
        throw new Error('OpenAI API key not configured');
    }

    const messages: OpenAIMessage[] = [
        {
            role: 'system',
            content: generateSystemPrompt()
        },
        {
            role: 'user',
            content: generateAnalyticsPrompt(analyticsData)
        }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-5-nano',
            messages,
            max_tokens: 800,
            temperature: 0.7,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API error: ${error}`);
    }

    const result = await response.json();
    const aiResponse = result.choices[0]?.message?.content || '';

    // Parse the response into individual insights
    const insights = aiResponse
        .split('\n')
        .filter(line => line.trim().startsWith('•'))
        .map(line => line.trim());

    return insights.length > 0 ? insights : [
        '• Continue building your network by sharing your digital card consistently',
        '• Monitor your scan patterns to identify peak networking times',
        '• Focus on converting scans to meaningful business contacts'
    ];
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // Verify authorization
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            throw new Error('Missing authorization header');
        }

        // Initialize Supabase client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                global: {
                    headers: { Authorization: authHeader },
                },
            }
        );

        // Get user from auth token
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

        if (authError || !user) {
            throw new Error('Unauthorized');
        }

        // Parse request body
        const { analyticsData } = await req.json() as { analyticsData: AnalyticsData };

        if (!analyticsData) {
            throw new Error('Analytics data is required');
        }

        // Generate AI insights
        const insights = await generateAIInsights(analyticsData);

        // Store insights in database for caching (optional)
        const { error: insertError } = await supabaseClient
            .from('ai_insights')
            .upsert({
                user_id: user.id,
                insights: insights,
                analytics_snapshot: analyticsData,
                generated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id'
            });

        if (insertError) {
            console.error('Error storing insights:', insertError);
            // Don't throw - insights generation succeeded
        }

        return new Response(
            JSON.stringify({
                success: true,
                insights,
                generated_at: new Date().toISOString()
            }),
            {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            }
        );

    } catch (error) {
        console.error('Error in ai-analytics function:', error);

        return new Response(
            JSON.stringify({
                success: false,
                error: error.message || 'Internal server error',
                fallback_insights: [
                    '• Your networking activity shows consistent growth patterns',
                    '• Consider optimizing your card design for better engagement',
                    '• Focus on converting scans during peak activity hours',
                    '• Mobile optimization appears to be working well for your audience'
                ]
            }),
            {
                status: 500,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            }
        );
    }
});