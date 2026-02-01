const metrics = [
  { value: '12', label: 'Active Road Projects', change: '+3 this month' },
  { value: '47', label: 'Development Applications', change: '8 approved' },
  { value: '156', label: 'Service Requests', change: '89% resolved' },
  { value: '4', label: 'Council Meetings', change: 'Next: Feb 15' },
];

export function MetricsRow() {
  return (
    <div className="grid grid-cols-4 gap-6 mb-16">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white/60 backdrop-blur-sm border border-[#E5DED0] rounded-xl p-6 hover:shadow-sm transition-shadow"
        >
          <div className="font-['Playfair_Display'] text-5xl text-[#2C2416] mb-2">
            {metric.value}
          </div>
          <div className="text-sm text-[#2C2416] mb-1 tracking-wide">
            {metric.label}
          </div>
          <div className="text-xs text-[#8B7355]">
            {metric.change}
          </div>
        </div>
      ))}
    </div>
  );
}
