import { Building2, Construction, Users, Megaphone, ChevronDown, X } from 'lucide-react';
import { MetricsPanel } from './MetricsPanel';
import { useState } from 'react';

interface FilterBarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedTimeframe: string;
  setSelectedTimeframe: (timeframe: string) => void;
  isDarkMode: boolean;
}

const categories = [
  { id: 'all', label: 'All Posts', icon: null },
  { id: 'development', label: 'Development', icon: Building2 },
  { id: 'road', label: 'Road Projects', icon: Construction },
  { id: 'council', label: 'Council', icon: Users },
  { id: 'service', label: 'Service Requests', icon: Megaphone },
];

const timeframes = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'all', label: 'All Time' },
];

export function FilterBar({
  selectedCategory,
  setSelectedCategory,
  selectedTimeframe,
  setSelectedTimeframe,
  isDarkMode,
}: FilterBarProps) {
  const [showMetrics, setShowMetrics] = useState(false);
  const selectedCategoryObj = categories.find(c => c.id === selectedCategory);
  const selectedTimeframeObj = timeframes.find(t => t.id === selectedTimeframe);

  return (
    <div className="mb-6">
      {/* Filter Buttons */}
      <div className="flex items-center justify-between gap-4 mb-6">
        {/* Desktop: Buttons */}
        <div className="hidden lg:flex gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-['Inter',sans-serif] text-sm font-medium transition-all ${isSelected
                  ? isDarkMode
                    ? 'bg-white text-[#0F172A]'
                    : 'bg-[#1E3A8A] text-white'
                  : isDarkMode
                    ? 'bg-[#1E293B] text-[#94A3B8] hover:bg-[#334155]'
                    : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1]'
                  }`}
              >
                {Icon && <Icon size={16} strokeWidth={2} />}
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Mobile: Dropdown */}
        <div className="lg:hidden relative flex-1">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-lg font-['Inter',sans-serif] text-sm font-medium appearance-none pr-10 ${isDarkMode
              ? 'bg-[#1E293B] text-white border border-[#334155]'
              : 'bg-white border border-[#E2E8F0] text-[#0F172A]'
              }`}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]"
          />
        </div>

        {/* Metrics Button - Shows popout */}
        <button
          onClick={() => setShowMetrics(!showMetrics)}
          className={`hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-lg font-['Inter',sans-serif] text-sm font-bold transition-all bg-white text-[#1E3A8A] hover:bg-[#EEF2FF] focus:outline-none`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
          </svg>
          {showMetrics ? 'Hide Metrics' : 'View Metrics'}
        </button>
      </div>

      {/* Metrics Slide-out Panel */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showMetrics ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
        <div className={`rounded-xl p-6 relative ${isDarkMode ? 'bg-[#1E293B]' : 'bg-white border border-[#E2E8F0]'}`}>
          <button
            onClick={() => setShowMetrics(false)}
            className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
          >
            <X size={18} className={isDarkMode ? 'text-white' : 'text-[#0F172A]'} />
          </button>
          <MetricsPanel
            selectedCategory={selectedCategory}
            selectedTimeframe={selectedTimeframe}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* Timeframe Buttons */}
      <div className="flex gap-2">
        {/* Desktop: Buttons */}
        <div className="hidden lg:flex gap-2">
          {timeframes.map((timeframe) => {
            const isSelected = selectedTimeframe === timeframe.id;
            return (
              <button
                key={timeframe.id}
                onClick={() => setSelectedTimeframe(timeframe.id)}
                className={`px-3 py-1.5 rounded-md font-['Inter',sans-serif] text-xs font-medium transition-all ${isSelected
                  ? isDarkMode
                    ? 'bg-[#334155] text-white'
                    : 'bg-[#F1F5F9] text-[#0F172A]'
                  : isDarkMode
                    ? 'text-[#64748B] hover:text-[#94A3B8]'
                    : 'text-[#94A3B8] hover:text-[#64748B]'
                  }`}
              >
                {timeframe.label}
              </button>
            );
          })}
        </div>

        {/* Mobile: Dropdown */}
        <div className="lg:hidden relative flex-1">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg font-['Inter',sans-serif] text-sm font-medium appearance-none pr-10 ${isDarkMode
              ? 'bg-[#1E293B] text-white border border-[#334155]'
              : 'bg-white border border-[#E2E8F0] text-[#0F172A]'
              }`}
          >
            {timeframes.map((timeframe) => (
              <option key={timeframe.id} value={timeframe.id}>
                {timeframe.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]"
          />
        </div>
      </div>
    </div>
  );
}