import { CommunityPost } from './CommunityPost';

interface Event {
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
}

interface CommunityFeedProps {
  events: Event[];
  loading?: boolean;
  error?: Error | null;
  selectedCategory: string;
  selectedTimeframe: string;
  onSelectPost?: (post: any) => void;
  selectedPostIds?: number[];
}

export function CommunityFeed({
  events,
  loading = false,
  error = null,
  selectedCategory,
  selectedTimeframe,
  onSelectPost,
  selectedPostIds = [],
}: CommunityFeedProps) {
  // Filter events by category
  const filteredEvents = events.filter((event) => {
    if (selectedCategory === 'all') return true;
    return event.category === selectedCategory;
  });

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1E3A8A] border-r-transparent"></div>
          <p className="mt-4 font-['Inter',sans-serif] text-sm text-[#64748B]">
            Loading events...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <div className="mb-4 text-red-500">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="font-['Work_Sans',sans-serif] font-bold text-lg text-[#0F172A] mb-2">
            Failed to load events
          </h3>
          <p className="font-['Inter',sans-serif] text-sm text-[#64748B]">
            {error.message || 'An error occurred while fetching events. Please try again later.'}
          </p>
        </div>
      </div>
    );
  }

  // Show empty state
  if (filteredEvents.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <div className="mb-4 text-[#94A3B8]">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="font-['Work_Sans',sans-serif] font-bold text-lg text-[#0F172A] mb-2">
            No events found
          </h3>
          <p className="font-['Inter',sans-serif] text-sm text-[#64748B]">
            There are no events matching your current filters. Try adjusting your selection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {filteredEvents.map((event) => (
        <CommunityPost
          key={event.id}
          post={{
            category: event.category,
            title: event.title,
            author: event.source || 'Unknown Source',
            timestamp: event.time,
            upvotes: 0,
            comments: 0,
            status: event.status || 'approved',
            data: event.summary ? [event.summary] : [],
            location: event.location,
            lat: event.lat,
            lng: event.lng,
            end_date: event.end_date,
            published_date: event.published_date
          }}
          onSelect={() => onSelectPost?.(event)}
          isSelected={selectedPostIds.includes(event.id)}
        />
      ))}
    </div>
  );
}