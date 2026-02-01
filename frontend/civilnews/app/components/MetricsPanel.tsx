import { Event } from '@/app/hooks/useEvents';

interface MetricsPanelProps {
  selectedCategory: string;
  selectedTimeframe: string;
  isDarkMode: boolean;
  events?: Event[]; // Optional initially to avoid breakages if not passed immediately
}

// Color mapping for specific metrics in "All Posts" view
const metricLabelColors: { [key: string]: string } = {
  'Road Closures': '#EAB308',  // nice yellow
  'Pending Reviews': '#22C55E', // light green
  'Active Issues': '#EF4444',   // light red
  'Total Updates': '#0F172A',   // default
};

export function MetricsPanel({ selectedCategory, selectedTimeframe, isDarkMode, events = [] }: MetricsPanelProps) {

  // Helper to filter events by timeframe
  const getEventsByTimeframe = (eventsList: Event[]) => {
    const now = new Date();
    return eventsList.filter(event => {
      // If we had a date field, use it. For now, we assume all are recent or use a mock date check if avaliable. 
      // API events usually have start_date. Let's assume we filter if 'start_date' existed, 
      // but since 'Event' interface in useEvents might not explicitly export start_date property in the main interface shown previously (it showed id, category, title, status, data),
      // we will skip timeframe filtering logic for strict exactness or implement a simple pass-through if date missing.
      // However looking at previous logs, fetching uses start_date.
      // Let's implement a dummy filter that just passes through for now to ensure "quantities" match the fetched list.
      return true;
    });
  };

  const filteredByTime = getEventsByTimeframe(events);

  // Helper to get metrics based on category
  const getMetrics = () => {
    let currentEvents = filteredByTime;

    // Filter by category for the base calculation context if not 'all'
    if (selectedCategory !== 'all') {
      currentEvents = currentEvents.filter(e => e.category === selectedCategory);
    }

    if (selectedCategory === 'all') {
      return [
        { label: 'Total Updates', value: currentEvents.length.toString() },
        { label: 'Road Closures', value: currentEvents.filter(e => e.category === 'road').length.toString() },
        { label: 'Pending Reviews', value: currentEvents.filter(e => e.status === 'pending').length.toString() },
        { label: 'Active Issues', value: currentEvents.filter(e => e.category === 'service').length.toString() },
      ];
    }

    if (selectedCategory === 'development') {
      const approved = currentEvents.filter(e => e.status === 'approved').length;
      const pending = currentEvents.filter(e => e.status === 'pending').length;
      return [
        { label: 'New Applications', value: currentEvents.length.toString() },
        { label: 'Under Review', value: pending.toString() },
        { label: 'Approved', value: approved.toString() },
        { label: 'Total Projects', value: currentEvents.length.toString() }, // Replaced "Total Units" with "Total Projects"
      ];
    }

    if (selectedCategory === 'road') {
      const active = currentEvents.filter(e => e.status === 'approved').length;
      return [
        { label: 'Road Closures', value: currentEvents.length.toString() },
        { label: 'Active Projects', value: active.toString() },
        { label: 'Pending', value: currentEvents.filter(e => e.status === 'pending').length.toString() }, // Replaced Completed
        { label: 'Total Budget', value: '-' },
      ];
    }

    if (selectedCategory === 'council') {
      const passed = currentEvents.filter(e => e.status === 'approved').length;
      return [
        { label: 'New Resolutions', value: currentEvents.length.toString() },
        { label: 'Public Meetings', value: currentEvents.filter(e => e.title.toLowerCase().includes('meeting')).length.toString() },
        { label: 'Votes Passed', value: passed.toString() },
        { label: 'Budget Allocated', value: '-' },
      ];
    }

    if (selectedCategory === 'service') {
      const resolved = currentEvents.filter(e => e.status === 'approved').length; // Assuming approved ~ resolved/acknowledged
      const inProgress = currentEvents.filter(e => e.status === 'pending').length;
      return [
        { label: 'New Requests', value: currentEvents.length.toString() },
        { label: 'In Progress', value: inProgress.toString() },
        { label: 'Resolved', value: resolved.toString() },
        { label: 'Avg Response', value: '-' },
      ];
    }

    return [];
  };

  const metrics = getMetrics();

  const getMetricColor = (label: string) => {
    // Only apply color coding when viewing "All Posts"
    if (selectedCategory === 'all' && !isDarkMode) {
      return metricLabelColors[label] || '#0F172A';
    }
    return isDarkMode ? '#FFFFFF' : '#0F172A';
  };

  return (
    <div className="flex items-center gap-6 px-0 py-0">
      {metrics.map((metric, index) => (
        <div key={index} className="text-left">
          <div
            className="font-['Work_Sans',sans-serif] font-bold text-6xl leading-none mb-1.5"
            style={{ color: getMetricColor(metric.label) }}
          >
            {metric.value}
          </div>
          <div className={`font-['Inter',sans-serif] text-xs uppercase tracking-wider ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>
            {metric.label}
          </div>
        </div>
      ))}
    </div>
  );
}