export interface EventLocation {
    type: "Point";
    crs: {
        type: "name";
        properties: { name: string };
    };
    coordinates: [number, number]; // [lng, lat]
}

export type EventType = "CITY_PROJECT" | "PERMIT" | "311_COMPLAINT" | "COUNCIL_MEETING";

export interface CommunityEvent {
    id: string;
    neighborhood_id: string;
    title: string;
    type: EventType;
    summary: string;
    source: string;
    location: EventLocation;
    created_at?: string;
    occurs_at?: string;
}

export const EVENT_COLORS: Record<EventType, string> = {
    CITY_PROJECT: "#F59E0B",     // Amber
    PERMIT: "#10B981",            // Green
    "311_COMPLAINT": "#EF4444",   // Red
    COUNCIL_MEETING: "#3B82F6"    // Blue
};

export const EVENT_LABELS: Record<EventType, string> = {
    CITY_PROJECT: "City Project",
    PERMIT: "Permit",
    "311_COMPLAINT": "311 Complaint",
    COUNCIL_MEETING: "Council Meeting"
};
