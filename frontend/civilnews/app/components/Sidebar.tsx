import { Home } from 'lucide-react';

interface SidebarProps {
  isDarkMode?: boolean;
}

export function Sidebar({ isDarkMode = false }: SidebarProps) {
  return (
    <aside className={`w-64 h-screen border-r flex flex-col ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E1E8ED]'}`}>
      <div className="p-6 shrink-0">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-12">
          <div className="h-[40px] overflow-clip relative shrink-0 w-[40px] bg-[#1E3A8A] rounded-full flex items-center justify-center">
            <p className="font-['Inter',sans-serif] font-semibold text-[15.2px] text-white">nn</p>
          </div>
          <p className="font-['Inter',sans-serif] font-light text-[11px] text-[#64748B] tracking-[0.55px] uppercase">
            neighborhood news
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#1E293B] bg-[#F1F5F9] transition-all duration-200">
            <Home size={18} className="text-[#1E3A8A]" />
            <span className="text-sm font-['Inter',sans-serif] font-medium tracking-wide">
              Home
            </span>
          </button>
        </nav>
      </div>

      {/* Communities Section - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="pt-4 border-t border-[#E1E8ED]">
          <p className="font-['Courier_New:Regular',sans-serif] text-[10px] text-[#64748B] tracking-[1px] uppercase mb-3 px-4">
            Communities
          </p>
          <div className="space-y-1">
            {['Kerrisdale', 'Kitsilano', 'Mount Pleasant', 'Fairview', 'West End'].map((community, idx) => (
              <button
                key={idx}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  idx === 0 
                    ? 'bg-[#EEF2FF] text-[#1E3A8A] border border-[#C7D2FE]' 
                    : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B]'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#1E3A8A]' : 'bg-[#94A3B8]'}`} />
                <span className="text-sm font-['Inter',sans-serif] font-medium">
                  {community}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}