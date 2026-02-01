"use client";

import { useEffect, useState } from 'react';
import { apiClient, ApiEvent } from '@/app/lib/api';

export interface Event {
    id: number;
    title: string;
    category: 'development' | 'road' | 'council' | 'service';
    time: string;
    location?: string;
    lat?: number;
    lng?: number;
    summary?: string;
    status?: 'pending' | 'approved';
    source?: string;
    end_date?: string;
    published_date?: string;
    published_at_raw?: string;
}

/**
 * Maps backend event types to frontend categories
 */
function mapEventTypeToCategory(type?: string): Event['category'] {
    switch (type) {
        case 'ROAD_CLOSURE':
            return 'road';
        case 'CITY_PROJECT':
            return 'development';
        case 'COUNCIL_VOTE':
            return 'council';
        case 'SERVICE_REQUEST':
            return 'service';
        default:
            return 'development';
    }
}

/**
 * Extracts coordinates from GeoJSON location
 */
function extractCoordinates(location: any): { lat?: number; lng?: number } {
    if (!location) return {};

    // Handle GeoJSON Point
    if (typeof location === 'object' && location.type === 'Point' && location.coordinates) {
        return {
            lng: location.coordinates[0],
            lat: location.coordinates[1]
        };
    }

    return {};
}

/**
 * Converts API event to frontend event format
 */
function convertApiEventToEvent(apiEvent: ApiEvent, index: number): Event {
    const coords = extractCoordinates(apiEvent.location);

    // Extract location name from location object if it's a string
    let locationName = '';
    if (typeof apiEvent.location === 'string') {
        locationName = apiEvent.location;
    }

    // Format time from published_at
    const publishedDate = new Date(apiEvent.published_at);
    const timeString = publishedDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    // Format dates for display
    const publishedDateString = publishedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    let endDateString = undefined;
    if (apiEvent.end_date) {
        endDateString = new Date(apiEvent.end_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    return {
        id: index + 1, // Use index as id since UUID is too long
        title: apiEvent.title || 'Untitled Event',
        category: mapEventTypeToCategory(apiEvent.type),
        time: timeString,
        location: locationName || undefined,
        lat: coords.lat,
        lng: coords.lng,
        summary: apiEvent.summary || undefined,
        status: undefined, // Default to undefined to satisfy type
        source: apiEvent.source,
        end_date: endDateString,
        published_date: publishedDateString,
        published_at_raw: apiEvent.published_at
    };
}

/**
 * Hook to fetch events for a specific neighborhood
 */
export function useNeighborhoodEvents(neighborhoodId?: string) {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchEvents() {
            if (!neighborhoodId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // Get events for the last 30 days
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - 30);

                const apiEvents = await apiClient.getNeighborhoodEvents(neighborhoodId, {
                    start_date: startDate.toISOString().split('T')[0],
                    end_date: endDate.toISOString().split('T')[0]
                });

                const convertedEvents = apiEvents
                    .map((event, index) => convertApiEventToEvent(event, index))
                    .sort((a, b) => {
                        // Sort by published_at_raw descending
                        const dateA = new Date(a.published_at_raw || 0).getTime();
                        const dateB = new Date(b.published_at_raw || 0).getTime();
                        return dateB - dateA;
                    });

                setEvents(convertedEvents);
            } catch (err) {
                console.error('Error fetching neighborhood events:', err);
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }

        fetchEvents();
    }, [neighborhoodId]);

    return { events, loading, error };
}

/**
 * Hook to fetch all events
 */
export function useEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchEvents() {
            setLoading(true);
            setError(null);

            try {
                // Get events for the last 30 days
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - 30);

                const apiEvents = await apiClient.getEvents({
                    start_date: startDate.toISOString().split('T')[0],
                    end_date: endDate.toISOString().split('T')[0]
                });

                const convertedEvents = apiEvents
                    .map((event, index) => convertApiEventToEvent(event, index))
                    .sort((a, b) => {
                        // Sort by published_at_raw descending
                        const dateA = new Date(a.published_at_raw || 0).getTime();
                        const dateB = new Date(b.published_at_raw || 0).getTime();
                        return dateB - dateA;
                    });

                setEvents(convertedEvents);
            } catch (err) {
                console.error('Error fetching events:', err);
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }

        fetchEvents();
    }, []);

    return { events, loading, error };
}
