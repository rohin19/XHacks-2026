import { MapPin } from 'lucide-react';

interface CommunityHeaderProps {
  isDarkMode?: boolean;
  neighborhoodName?: string;
}

export function CommunityHeader({ isDarkMode = false, neighborhoodName = 'Kerrisdale' }: CommunityHeaderProps) {
  return (
    <div className="mb-4 lg:mb-6 pt-4 lg:pt-6">
      <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-[#1E3A8A] flex items-center justify-center shrink-0">
          <MapPin size={28} className="lg:hidden text-white" strokeWidth={1.5} />
          <MapPin size={36} className="hidden lg:block text-white" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className={`font-['Work_Sans',sans-serif] font-bold text-4xl lg:text-6xl tracking-[-1.5px] lg:tracking-[-2px] ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
            {neighborhoodName}
          </h1>
          <p className={`font-['Inter',sans-serif] text-base lg:text-lg mt-0.5 lg:mt-1 ${isDarkMode ? 'text-gray-300' : 'text-[#475569]'}`}>
            Vancouver, BC
          </p>
        </div>
      </div>

      <p className={`font-['Inter',sans-serif] text-sm lg:text-base leading-relaxed max-w-3xl py-3 lg:py-4 ${isDarkMode ? 'text-gray-300' : 'text-[#64748B]'}`}>
        Stay informed about local developments, road projects, council decisions, and service requests in your neighborhood.
      </p>
    </div>
  );
}