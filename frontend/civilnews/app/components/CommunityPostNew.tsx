import { Building2, Construction, Users, Megaphone, MapPin } from 'lucide-react';

const categoryConfig = {
  development: {
    icon: Building2,
    color: '#1E3A8A',
    bgColor: '#EEF2FF',
    borderColor: '#C7D2FE',
    label: 'City Projects',
  },
  road: {
    icon: Construction,
    color: '#B45309',
    bgColor: '#FEF3C7',
    borderColor: '#FDE68A',
    label: 'Road Project',
  },
  council: {
    icon: Users,
    color: '#047857',
    bgColor: '#D1FAE5',
    borderColor: '#A7F3D0',
    label: 'Council',
  },
  service: {
    icon: Megaphone,
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    borderColor: '#DDD6FE',
    label: 'Service Request',
  },
};

interface CommunityPostNewProps {
  post: {
    category: 'development' | 'road' | 'council' | 'service';
    title: string;
    author: string;
    timestamp: string;
    upvotes: number;
    comments: number;
    status: 'approved' | 'pending';
    data: string[];
    location?: string;
    lat?: number;
    lng?: number;
    end_date?: string;
    published_date?: string;
  };
  onSelect?: () => void;
  isSelected?: boolean;
}

export function CommunityPostNew({ post, onSelect, isSelected }: CommunityPostNewProps) {
  const config = categoryConfig[post.category];
  const Icon = config.icon;

  // Extract summary (the line starting with "Summary:")
  const summaryLine = post.data.find(line => line.startsWith('Summary:'));
  const summary = summaryLine ? summaryLine.replace('Summary: ', '') : '';

  // Get data points without the summary
  const dataPoints = post.data.filter(line => !line.startsWith('Summary:'));

  return (
    <article
      onClick={onSelect}
      className={`bg-white border-2 rounded-lg hover:border-[#CBD5E1] transition-all hover:shadow-md group overflow-hidden cursor-pointer min-w-[280px] ${isSelected ? 'border-[#3B82F6] shadow-lg' : 'border-[#E2E8F0]'
        }`}
    >
      <div className="p-4 lg:p-6">
        {/* Category Tag */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ backgroundColor: config.bgColor }}
          >
            <Icon size={14} style={{ color: config.color }} strokeWidth={2.5} />
          </div>
          <span className="font-['Work_Sans',sans-serif] text-[10px] tracking-[1.5px] uppercase font-bold" style={{ color: config.color }}>
            {config.label}
          </span>
        </div>

        {/* Title */}
        <h2 className="font-['Work_Sans',sans-serif] font-bold text-lg lg:text-xl text-[#0F172A] mb-3 lg:mb-4 leading-tight">
          {post.title} {/* <span className="font-normal text-sm lg:text-base text-[#64748B]">- {post.status.toUpperCase()}</span> */}
        </h2>

        {/* Data Points */}
        <div className="space-y-1.5 mb-3 lg:mb-4">
          {dataPoints.map((line, index) => (
            <p key={index} className="font-['Inter',sans-serif] text-xs lg:text-[13px] text-[#475569] leading-relaxed">
              {line}
            </p>
          ))}
        </div>

        {/* Dates */}
        <div className="flex flex-col gap-1 mt-3 pt-2 mb-3 border-t border-[#F1F5F9] text-xs font-['Inter',sans-serif] text-[#64748B]">
          {post.published_date && (
            <div className="flex items-center gap-1">
              <span className="font-medium text-[#475569]">Published Date:</span>
              <span>{post.published_date}</span>
            </div>
          )}
          {post.end_date && (
            <div className="flex items-center gap-1">
              <span className="font-medium text-[#475569]">End Date:</span>
              <span>{post.end_date}</span>
            </div>
          )}
        </div>

        {/* Summary */}
        {summary && (
          <p className="font-['Inter',sans-serif] text-sm lg:text-[15px] text-[#64748B] leading-relaxed pt-3 border-t border-[#F1F5F9] bg-[#F8FAFC] p-3 rounded-lg mt-2">
            {summary}
          </p>
        )}
      </div>
    </article>
  );
}