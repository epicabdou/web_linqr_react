// src/services/aiAnalytics.ts
import { supabase } from '../lib/supabase';

export interface AnalyticsData {
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

export interface AIInsightResponse {
    success: boolean;
    insights?: string[];
    generated_at?: string;
    error?: string;
    fallback_insights?: string[];
}

export interface CachedInsights {
    insights: string[];
    generated_at: string;
    analytics_snapshot: AnalyticsData;
}

class AIAnalyticsService {
    private static instance: AIAnalyticsService;
    private cache: Map<string, CachedInsights> = new Map();
    private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    static getInstance(): AIAnalyticsService {
        if (!AIAnalyticsService.instance) {
            AIAnalyticsService.instance = new AIAnalyticsService();
        }
        return AIAnalyticsService.instance;
    }

    /**
     * Generate AI insights for the provided analytics data
     */
    async generateInsights(analyticsData: AnalyticsData): Promise<AIInsightResponse> {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                throw new Error('User not authenticated');
            }

            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-analytics`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    analyticsData
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: AIInsightResponse = await response.json();

            // Update local cache on successful generation
            if (result.success && result.insights && session.user?.id) {
                this.updateCache(session.user.id, {
                    insights: result.insights,
                    generated_at: result.generated_at || new Date().toISOString(),
                    analytics_snapshot: analyticsData
                });
            }

            return result;

        } catch (error) {
            console.error('Error generating AI insights:', error);

            // Return fallback insights on error
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                fallback_insights: this.getFallbackInsights(analyticsData)
            };
        }
    }

    /**
     * Load cached insights from database
     */
    async loadCachedInsights(): Promise<CachedInsights | null> {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                return null;
            }

            // Check local cache first
            const localCache = this.cache.get(user.id);
            if (localCache && this.isCacheValid(localCache.generated_at)) {
                return localCache;
            }

            // Load from database
            const { data, error } = await supabase
                .from('ai_insights')
                .select('insights, generated_at, analytics_snapshot')
                .eq('user_id', user.id)
                .single();

            if (error || !data) {
                return null;
            }

            const cachedInsights: CachedInsights = {
                insights: data.insights,
                generated_at: data.generated_at,
                analytics_snapshot: data.analytics_snapshot
            };

            // Update local cache
            this.updateCache(user.id, cachedInsights);

            return cachedInsights;

        } catch (error) {
            console.error('Error loading cached insights:', error);
            return null;
        }
    }

    /**
     * Check if insights are stale and need refreshing
     */
    async areInsightsStale(): Promise<boolean> {
        const cached = await this.loadCachedInsights();

        if (!cached) {
            return true;
        }

        return !this.isCacheValid(cached.generated_at);
    }

    /**
     * Generate fallback insights when AI is not available
     */
    private getFallbackInsights(analyticsData: AnalyticsData): string[] {
        const insights: string[] = [];

        // Basic insights based on data patterns
        const totalScans = analyticsData.totalScans;
        const conversionRate = analyticsData.contactsCount > 0 && totalScans > 0
            ? (analyticsData.contactsCount / totalScans) * 100
            : 0;

        // Scan volume insights
        if (totalScans < 50) {
            insights.push('• Consider sharing your digital card more frequently to increase visibility');
        } else if (totalScans > 500) {
            insights.push('• Excellent networking activity! You\'re building strong digital presence');
        } else {
            insights.push('• Your networking activity shows steady growth - keep building connections');
        }

        // Conversion rate insights
        if (conversionRate < 10) {
            insights.push('• Focus on meaningful follow-ups to convert more scans into business contacts');
        } else if (conversionRate > 25) {
            insights.push('• Outstanding conversion rate! Your networking approach is highly effective');
        } else {
            insights.push('• Good conversion rate - continue nurturing relationships for better results');
        }

        // Device insights
        const mobilePercentage = analyticsData.deviceTypes.find(d => d.type === 'Mobile')?.percentage || 0;
        if (mobilePercentage > 70) {
            insights.push('• Mobile devices dominate your scans - ensure your card is mobile-optimized');
        } else if (mobilePercentage < 50) {
            insights.push('• Consider promoting mobile scanning for better accessibility');
        }

        // Time-based insights
        const peakHour = analyticsData.hourlyDistribution.reduce((peak, hour) =>
            hour.count > peak.count ? hour : peak, analyticsData.hourlyDistribution[0]);

        if (peakHour.hour >= 9 && peakHour.hour <= 17) {
            insights.push('• Your peak networking hours align with business hours - great for professional connections');
        } else {
            insights.push('• Consider networking during business hours for more professional opportunities');
        }

        // Location insights
        if (analyticsData.topLocations.length > 3) {
            insights.push('• You\'re building a diverse geographic network - excellent for business expansion');
        }

        return insights.slice(0, 4); // Return max 4 fallback insights
    }

    /**
     * Check if cached data is still valid
     */
    private isCacheValid(generatedAt: string): boolean {
        const generated = new Date(generatedAt).getTime();
        const now = Date.now();
        return (now - generated) < this.CACHE_DURATION;
    }

    /**
     * Update local cache
     */
    private updateCache(userId: string, insights: CachedInsights): void {
        this.cache.set(userId, insights);
    }

    /**
     * Clear cache for user
     */
    async clearCache(): Promise<void> {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                this.cache.delete(user.id);
            }
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    }

    /**
     * Get insight statistics for debugging
     */
    getInsightStats(): { cacheSize: number; cacheKeys: string[] } {
        return {
            cacheSize: this.cache.size,
            cacheKeys: Array.from(this.cache.keys())
        };
    }

    /**
     * Validate analytics data before sending to AI
     */
    validateAnalyticsData(data: AnalyticsData): boolean {
        return !!(
            data &&
            typeof data.totalScans === 'number' &&
            typeof data.monthlyScans === 'number' &&
            Array.isArray(data.deviceTypes) &&
            Array.isArray(data.topLocations) &&
            Array.isArray(data.cards)
        );
    }

    /**
     * Get personalized prompt suggestions based on user data
     */
    getPromptSuggestions(analyticsData: AnalyticsData): string[] {
        const suggestions: string[] = [];

        if (analyticsData.totalScans > 1000) {
            suggestions.push('Request advanced networking optimization strategies');
        }

        if (analyticsData.cards.length > 3) {
            suggestions.push('Ask for card-specific performance recommendations');
        }

        if (analyticsData.topLocations.length > 5) {
            suggestions.push('Get insights on geographic expansion opportunities');
        }

        return suggestions;
    }
}

// Export singleton instance
export const aiAnalyticsService = AIAnalyticsService.getInstance();

// Export types
export type { CachedInsights };

// Utility functions
export const formatInsightText = (insight: string): string => {
    return insight.replace(/^•\s*/, '').trim();
};

export const categorizeInsight = (insight: string): 'success' | 'warning' | 'info' | 'tip' => {
    const text = insight.toLowerCase();

    if (text.includes('excellent') || text.includes('outstanding') || text.includes('great')) {
        return 'success';
    } else if (text.includes('consider') || text.includes('improve') || text.includes('optimize')) {
        return 'tip';
    } else if (text.includes('decline') || text.includes('low') || text.includes('concern')) {
        return 'warning';
    } else {
        return 'info';
    }
};