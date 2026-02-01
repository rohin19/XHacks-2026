interface MetricsPanelProps {
  selectedCategory: string;
  selectedTimeframe: string;
  isDarkMode: boolean;
}

// Color mapping for specific metrics in "All Posts" view
const metricLabelColors: { [key: string]: string } = {
  'Road Closures': '#EAB308',  // nice yellow
  'Pending Reviews': '#22C55E', // light green
  'Active Issues': '#EF4444',   // light red
  'Total Updates': '#0F172A',   // default
};

const metricsData = {
  all: {
    week: [
      { label: 'Total Updates', value: '24' },
      { label: 'Road Closures', value: '3' },
      { label: 'Pending Reviews', value: '8' },
      { label: 'Active Issues', value: '12' },
    ],
    month: [
      { label: 'Total Updates', value: '87' },
      { label: 'Road Closures', value: '11' },
      { label: 'Pending Reviews', value: '23' },
      { label: 'Active Issues', value: '31' },
    ],
    year: [
      { label: 'Total Updates', value: '1,243' },
      { label: 'Road Closures', value: '89' },
      { label: 'Pending Reviews', value: '156' },
      { label: 'Active Issues', value: '298' },
    ],
  },
  development: {
    week: [
      { label: 'New Applications', value: '5' },
      { label: 'Under Review', value: '12' },
      { label: 'Approved', value: '8' },
      { label: 'Total Units', value: '347' },
    ],
    month: [
      { label: 'New Applications', value: '18' },
      { label: 'Under Review', value: '34' },
      { label: 'Approved', value: '27' },
      { label: 'Total Units', value: '1,204' },
    ],
    year: [
      { label: 'New Applications', value: '234' },
      { label: 'Under Review', value: '87' },
      { label: 'Approved', value: '312' },
      { label: 'Total Units', value: '14,567' },
    ],
  },
  road: {
    week: [
      { label: 'Road Closures', value: '3' },
      { label: 'Active Projects', value: '7' },
      { label: 'Completed', value: '4' },
      { label: 'Total Budget', value: '$2.4M' },
    ],
    month: [
      { label: 'Road Closures', value: '11' },
      { label: 'Active Projects', value: '23' },
      { label: 'Completed', value: '15' },
      { label: 'Total Budget', value: '$8.7M' },
    ],
    year: [
      { label: 'Road Closures', value: '89' },
      { label: 'Active Projects', value: '156' },
      { label: 'Completed', value: '203' },
      { label: 'Total Budget', value: '$47.2M' },
    ],
  },
  council: {
    week: [
      { label: 'New Resolutions', value: '4' },
      { label: 'Public Meetings', value: '2' },
      { label: 'Votes Passed', value: '12' },
      { label: 'Budget Allocated', value: '$5.2M' },
    ],
    month: [
      { label: 'New Resolutions', value: '16' },
      { label: 'Public Meetings', value: '8' },
      { label: 'Votes Passed', value: '43' },
      { label: 'Budget Allocated', value: '$18.9M' },
    ],
    year: [
      { label: 'New Resolutions', value: '187' },
      { label: 'Public Meetings', value: '96' },
      { label: 'Votes Passed', value: '512' },
      { label: 'Budget Allocated', value: '$234M' },
    ],
  },
  service: {
    week: [
      { label: 'New Requests', value: '23' },
      { label: 'In Progress', value: '15' },
      { label: 'Resolved', value: '31' },
      { label: 'Avg Response', value: '4.2hrs' },
    ],
    month: [
      { label: 'New Requests', value: '87' },
      { label: 'In Progress', value: '42' },
      { label: 'Resolved', value: '124' },
      { label: 'Avg Response', value: '5.1hrs' },
    ],
    year: [
      { label: 'New Requests', value: '1,043' },
      { label: 'In Progress', value: '156' },
      { label: 'Resolved', value: '1,487' },
      { label: 'Avg Response', value: '6.3hrs' },
    ],
  },
};

export function MetricsPanel({ selectedCategory, selectedTimeframe, isDarkMode }: MetricsPanelProps) {
  const metrics = metricsData[selectedCategory as keyof typeof metricsData]?.[selectedTimeframe as keyof typeof metricsData.all] || metricsData.all[selectedTimeframe as keyof typeof metricsData.all];

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