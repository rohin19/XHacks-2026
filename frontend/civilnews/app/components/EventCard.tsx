import { Building2, Construction, Users, Megaphone } from 'lucide-react';

const categoryConfig = {
  development: {
    icon: Building2,
    color: '#8B7355',
  },
  road: {
    icon: Construction,
    color: '#A67C52',
  },
  council: {
    icon: Users,
    color: '#6B5D4F',
  },
  service: {
    icon: Megaphone,
    color: '#9B8B7E',
  },
};

interface EventCardProps {
  event: {
    category: 'development' | 'road' | 'council' | 'service';
    title: string;
    status: 'approved' | 'pending';
    data: string[];
  };
}

export function EventCard({ event }: EventCardProps) {
  const config = categoryConfig[event.category];
  const Icon = config.icon;

  return (
    <article className="bg-white/60 backdrop-blur-sm border border-[#E5DED0] rounded-xl p-8 hover:border-[#D4C4B0] transition-all">
      <div className="flex gap-6">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${config.color}20` }}
        >
          <Icon size={20} style={{ color: config.color }} strokeWidth={1.5} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-['Playfair_Display'] text-xl text-[#2C2416] leading-tight pr-4">
              {event.title} <span className="font-normal font-['Inter'] text-sm lg:text-base text-[#64748B]">- {event.status.toUpperCase()}</span>
            </h3>
          </div>

          {/* Data Points */}
          <div className="space-y-2">
            {event.data.map((line, index) => (
              <p key={index} className="text-sm text-[#6B5D4F] leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
