/**
 * API Client for connecting to the backend events API
 */

export interface ApiEvent {
    id: string;
    neighborhood_id?: string;
    title?: string;
    type?: string;
    summary?: string;
    source?: string;
    location?: any; // GeoJSON Point or string
    start_date?: string;
    end_date?: string;
    published_at: string;
    updated_at?: string;
    created_at?: string;
}

export interface EventsQueryParams {
    start_date: string; // ISO date string YYYY-MM-DD
    end_date: string;   // ISO date string YYYY-MM-DD
    event_type?: 'ROAD_CLOSURE' | 'SERVICE_REQUEST' | 'CITY_PROJECT' | 'COUNCIL_VOTE';
    neighborhood_id?: string;
}

class ApiClient {
    private baseUrl: string;

    constructor() {
        // Use Next.js API route as proxy to avoid CORS issues
        // Once backend adds CORS support, you can switch to direct calls:
        // this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        this.baseUrl = '/api';
    }

    /**
     * Fetch events from the backend API
     */
    async getEvents(params: EventsQueryParams): Promise<ApiEvent[]> {
        const searchParams = new URLSearchParams({
            start_date: params.start_date,
            end_date: params.end_date,
        });

        if (params.event_type) {
            searchParams.append('event_type', params.event_type);
        }

        const url = `${this.baseUrl}/events?${searchParams.toString()}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            // Enhanced error messaging
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                console.error('CORS or Network Error:', error);
                throw new Error(
                    'Unable to connect to the backend API. This may be a CORS issue. ' +
                    'Please ensure the backend allows requests from this origin.'
                );
            }
            console.error('Error fetching events:', error);
            throw error;
        }
    }

    /**
     * Fetch events for a specific neighborhood
     */
    async getNeighborhoodEvents(
        neighborhoodId: string,
        params: Omit<EventsQueryParams, 'neighborhood_id'>
    ): Promise<ApiEvent[]> {
        // First get all events, then filter by neighborhood on the client
        // TODO: Update backend to support neighborhood_id filter
        const events = await this.getEvents(params);
        return events.filter(event =>
            event.neighborhood_id === neighborhoodId ||
            event.type === 'COUNCIL_VOTE'
        );
    }

    /**
     * Fetch all neighborhoods from Supabase
     */
    async getNeighborhoods(): Promise<any[]> {
        const url = `${this.baseUrl}/neighborhoods`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('📍 Neighborhoods from Supabase:', data);
            return data;
        } catch (error) {
            console.error('Error fetching neighborhoods:', error);
            throw error;
        }
    }
}

// Export a singleton instance
export const apiClient = new ApiClient();
