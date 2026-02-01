import { Share2 } from 'lucide-react';
import { Building2, Construction, Users, Megaphone } from 'lucide-react';

const categoryConfig = {
  development: {
    icon: Building2,
    color: '#1E3A8A',
    bgColor: '#EEF2FF',
    borderColor: '#C7D2FE',
    label: 'Development',
  },
  road: {
    icon: Construction,
    color: '#B45309',
    bgColor: '#FEF3C7',
    borderColor: '#FDE68A',
    label: 'Road Projects',
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
    label: 'Service Requests',
  },
};

interface CommunityPostProps {
  post: {
    category: 'development' | 'road' | 'council' | 'service';
    title: string;
    author: string;
    timestamp: string;
    upvotes: number;
    comments: number;
    status: 'approved' | 'pending';
    data: string[];
  };
}

export function CommunityPost({ post }: CommunityPostProps) {
  const config = categoryConfig[post.category];
  const Icon = config.icon;

  return (
    <article className="bg-white border border-[#E2E8F0] rounded-xl hover:border-[#CBD5E1] transition-all hover:shadow-lg group overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: config.bgColor }}
          >
            <Icon size={18} style={{ color: config.color }} strokeWidth={2.5} />
          </div>
          <div className="flex items-center gap-2.5 text-sm flex-1">
            <span className="font-['Work_Sans',sans-serif] text-[11px] tracking-[1.5px] uppercase font-bold" style={{ color: config.color }}>
              {config.label}
            </span>
            <span className="text-[#CBD5E1]">•</span>
            <span className="font-['Inter',sans-serif] text-[#94A3B8] text-sm">
              {post.timestamp}
            </span>
          </div>

          {/* Title */}
          <h2 className="font-['Work_Sans',sans-serif] font-bold text-2xl text-[#0F172A] mb-4 leading-tight tracking-tight">
            {post.title} <span className="font-normal text-sm lg:text-base text-[#64748B]">- {post.status.toUpperCase()}</span>
          </h2>

          {/* Data Points */}
          <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] rounded-xl p-5 space-y-2.5 border border-[#E2E8F0] shadow-inner">
            {post.data.map((line, index) => (
              <p key={index} className="font-['Inter',sans-serif] text-[16px] text-[#1E293B] leading-relaxed font-medium">
                {line}
              </p>
            ))}
          </div>
        </div>
    </article>
  );
}