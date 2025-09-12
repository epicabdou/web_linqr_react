// src/components/analytics/AnalyticsInsights.tsx (Debug Version)
import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Brain, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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

interface AnalyticsInsightsProps {
    analytics: AnalyticsData | null;
    loading?: boolean;
}

interface AIInsight {
    text: string;
    type: 'success' | 'warning' | 'info' | 'tip';
}

const AnalyticsInsights: React.FC<AnalyticsInsightsProps> = ({ analytics, loading = false }) => {
    const [aiInsights, setAiInsights] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [lastGenerated, setLastGenerated] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showFallback, setShowFallback] = useState(false);
    const [debugInfo, setDebugInfo] = useState<string>('');

    // Fallback insights when AI is not available
    const fallbackInsights = [
        '• Your cards are most active during weekdays between 9 AM - 5 PM',
        '• Mobile devices account for the majority of your scans - ensure mobile optimization',
        '• Focus on converting scans to meaningful business contacts for better ROI',
        '• Consider sharing your card during networking events for increased visibility'
    ];

    // Load cached insights on component mount
    useEffect(() => {
        loadCachedInsights();
    }, []);

    // Auto-generate insights when analytics data changes (with debounce)
    useEffect(() => {
        if (analytics && !isGenerating && !lastGenerated) {
            const timer = setTimeout(() => {
                generateAIInsights();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [analytics]);

    const testDatabaseConnection = async () => {
        try {
            setDebugInfo('Testing database connection...');

            // First, check if we can connect at all
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                setDebugInfo(`Auth error: ${userError?.message || 'No user'}`);
                return false;
            }

            setDebugInfo(`User authenticated: ${user.id}`);

            // Test if table exists by trying a simple count
            const { count, error: countError } = await supabase
                .from('ai_insights')
                .select('*', { count: 'exact', head: true });

            if (countError) {
                setDebugInfo(`Table access error: ${countError.message} (Code: ${countError.code})`);

                // Try alternative table check
                const { data: tables, error: tableError } = await supabase
                    .rpc('check_table_exists', { table_name: 'ai_insights' })
                    .single();

                if (tableError) {
                    setDebugInfo(`Table existence check failed: ${tableError.message}`);
                }

                return false;
            }

            setDebugInfo(`Table accessible, count: ${count}`);
            return true;

        } catch (err) {
            setDebugInfo(`Connection test failed: ${err}`);
            return false;
        }
    };

    const loadCachedInsights = async () => {
        try {
            setDebugInfo('Loading cached insights...');

            // Test connection first
            const canConnect = await testDatabaseConnection();
            if (!canConnect) {
                setShowFallback(true);
                setAiInsights(fallbackInsights);
                setError('Database connection failed - using fallback insights');
                return;
            }

            // Try the actual query
            const { data, error } = await supabase
                .from('ai_insights')
                .select('insights, generated_at')
                .maybeSingle(); // Use maybeSingle instead of single to avoid error on no data

            if (error) {
                setDebugInfo(`Query error: ${error.message} (Code: ${error.code})`);

                if (error.code === 'PGRST106' || error.message?.includes('406')) {
                    setError('AI insights table not found. Please run: npx supabase db push');
                } else {
                    setError(`Database error: ${error.message}`);
                }
                setShowFallback(true);
                setAiInsights(fallbackInsights);
                return;
            }

            if (data?.insights && Array.isArray(data.insights)) {
                setDebugInfo(`Loaded ${data.insights.length} insights from cache`);
                setAiInsights(data.insights);
                setLastGenerated(new Date(data.generated_at));
                setShowFallback(false);
                setError(null);
            } else {
                setDebugInfo('No cached insights found - using fallback');
                setShowFallback(true);
                setAiInsights(fallbackInsights);
            }
        } catch (err) {
            console.error('Error loading cached insights:', err);
            setDebugInfo(`Exception: ${err}`);
            setShowFallback(true);
            setAiInsights(fallbackInsights);
            setError('Failed to load insights');
        }
    };

    const generateAIInsights = async () => {
        if (!analytics) {
            setError('No analytics data available');
            return;
        }

        setIsGenerating(true);
        setError(null);
        setDebugInfo('Generating AI insights...');

        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                throw new Error('Not authenticated');
            }

            setDebugInfo('Calling AI analytics function...');

            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-analytics`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    analyticsData: analytics
                }),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Failed to generate insights');
            }

            if (result.insights && result.insights.length > 0) {
                setDebugInfo(`Generated ${result.insights.length} AI insights`);
                setAiInsights(result.insights);
                setLastGenerated(new Date(result.generated_at));
                setShowFallback(false);
            } else if (result.fallback_insights) {
                setDebugInfo('Using fallback insights from AI service');
                setAiInsights(result.fallback_insights);
                setShowFallback(true);
            }

        } catch (err) {
            console.error('Error generating AI insights:', err);
            setDebugInfo(`AI generation failed: ${err}`);
            setError(err instanceof Error ? err.message : 'Failed to generate insights');

            // Show fallback insights on error
            setAiInsights(fallbackInsights);
            setShowFallback(true);
        } finally {
            setIsGenerating(false);
        }
    };

    const parseInsightType = (insight: string): AIInsight => {
        const text = insight.replace(/^•\s*/, '').trim();

        if (text.toLowerCase().includes('increase') || text.toLowerCase().includes('improve') || text.toLowerCase().includes('optimize')) {
            return { text, type: 'tip' };
        } else if (text.toLowerCase().includes('decline') || text.toLowerCase().includes('drop') || text.toLowerCase().includes('concern')) {
            return { text, type: 'warning' };
        } else if (text.toLowerCase().includes('good') || text.toLowerCase().includes('strong') || text.toLowerCase().includes('performing well')) {
            return { text, type: 'success' };
        } else {
            return { text, type: 'info' };
        }
    };

    const getInsightIcon = (type: AIInsight['type']) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'warning':
                return <AlertCircle className="h-4 w-4 text-amber-600" />;
            case 'tip':
                return <TrendingUp className="h-4 w-4 text-blue-600" />;
            default:
                return <Brain className="h-4 w-4 text-gray-600" />;
        }
    };

    const getInsightStyles = (type: AIInsight['type']) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'warning':
                return 'bg-amber-50 border-amber-200 text-amber-800';
            case 'tip':
                return 'bg-blue-50 border-blue-200 text-blue-800';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    const isInsightsStale = () => {
        if (!lastGenerated) return true;
        const hoursSinceGenerated = (Date.now() - lastGenerated.getTime()) / (1000 * 60 * 60);
        return hoursSinceGenerated > 24; // Consider stale after 24 hours
    };

    const formatTimeAgo = (date: Date) => {
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    if (loading) {
        return (
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-900">
                        {showFallback ? 'Analytics Insights' : 'AI-Powered Insights'}
                    </h3>
                    {showFallback && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              Fallback Mode
            </span>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    {lastGenerated && !showFallback && (
                        <span className="text-xs text-blue-600">
              Updated {formatTimeAgo(lastGenerated)}
            </span>
                    )}

                    {isInsightsStale() && (
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
              Stale
            </span>
                    )}

                    <button
                        onClick={generateAIInsights}
                        disabled={isGenerating || !analytics}
                        className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <RefreshCw className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} />
                        <span>{isGenerating ? 'Generating...' : 'Refresh'}</span>
                    </button>

                    <button
                        onClick={testDatabaseConnection}
                        className="px-2 py-1 text-xs bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                        title="Test database connection"
                    >
                        Test DB
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-800">{error}</span>
                    </div>
                </div>
            )}

            {debugInfo && (
                <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <div className="flex items-center space-x-2">
                        <Brain className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-700">Debug: {debugInfo}</span>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {aiInsights.map((insight, index) => {
                    const parsedInsight = parseInsightType(insight);
                    return (
                        <div
                            key={index}
                            className={`flex items-start space-x-3 p-3 rounded-md border ${getInsightStyles(parsedInsight.type)}`}
                        >
                            {getInsightIcon(parsedInsight.type)}
                            <span className="text-sm font-medium flex-1">
                {parsedInsight.text}
              </span>
                        </div>
                    );
                })}
            </div>

            {!showFallback && aiInsights.length > 0 && (
                <div className="mt-4 pt-3 border-t border-blue-200">
                    <p className="text-xs text-blue-600 flex items-center space-x-1">
                        <Brain className="h-3 w-3" />
                        <span>Powered by AI • Insights refresh automatically every 24 hours</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default AnalyticsInsights;