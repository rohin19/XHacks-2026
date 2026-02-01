import { Home } from 'lucide-react';
import Link from 'next/link';
import { NEIGHBORHOODS } from '@/app/lib/neighborhoods';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isDarkMode?: boolean;
}

export function Sidebar({ isDarkMode = false }: SidebarProps) {
  const pathname = usePathname();

  // Get all neighborhoods sorted alphabetically
  const neighborhoods = NEIGHBORHOODS.features
    .map(feature => ({
      name: feature.properties.name,
      slug: feature.properties.slug
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <aside className={`w-64 h-screen border-r flex flex-col ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E1E8ED]'}`}>
      <div className="p-6 shrink-0">
        {/* Logo - Clickable */}
        <Link href="/" className="flex flex-col items-center gap-3 mb-12 cursor-pointer group">
          <div className="h-[40px] overflow-clip relative shrink-0 w-[40px] bg-[#1E3A8A] rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
            <p className="font-['Inter',sans-serif] font-semibold text-[15.2px] text-white">nn</p>
          </div>
          <p className="font-['Inter',sans-serif] font-light text-[11px] text-[#64748B] tracking-[0.55px] uppercase group-hover:text-[#1E3A8A] transition-colors">
            neighborhood news
          </p>
        </Link>

        {/* Navigation */}
        <nav className="space-y-2">
          <Link
            href="/"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${pathname === '/'
                ? 'text-[#1E293B] bg-[#F1F5F9]'
                : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]'
              }`}
          >
            <Home size={18} className={pathname === '/' ? 'text-[#1E3A8A]' : 'text-[#94A3B8]'} />
            <span className="text-sm font-['Inter',sans-serif] font-medium tracking-wide">
              Home
            </span>
          </Link>
        </nav>
      </div>

      {/* Communities Section - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="pt-4 border-t border-[#E1E8ED]">
          <p className="font-['Courier_New:Regular',sans-serif] text-[10px] text-[#64748B] tracking-[1px] uppercase mb-3 px-4">
            Communities
          </p>
          <div className="space-y-1">
            {neighborhoods.map((neighborhood) => {
              const isActive = pathname === `/neighborhood/${neighborhood.slug}`;
              return (
                <Link
                  key={neighborhood.slug}
                  href={`/neighborhood/${neighborhood.slug}`}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive
                      ? 'bg-[#EEF2FF] text-[#1E3A8A] border border-[#C7D2FE]'
                      : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B]'
                    }`}
                >
                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#1E3A8A]' : 'bg-[#94A3B8]'}`} />
                  <span className="text-sm font-['Inter',sans-serif] font-medium">
                    {neighborhood.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
