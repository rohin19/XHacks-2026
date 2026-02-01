import { MapPin, X } from 'lucide-react';

interface MapPanelProps {
  selectedPosts: Array<{
    id: number;
    title: string;
    location?: string;
    lat?: number;
    lng?: number;
    category: string;
  }>;
  onRemove: (id: number) => void;
  onClose: () => void;
}

const categoryColors = {
  development: '#1E3A8A',
  road: '#B45309',
  council: '#047857',
  service: '#7C3AED',
};

export function MapPanel({ selectedPosts, onRemove, onClose }: MapPanelProps) {
  // Calculate bounds to fit all pins
  const bounds = selectedPosts.length > 0 ? {
    minLat: Math.min(...selectedPosts.map(p => p.lat || 49.2327)),
    maxLat: Math.max(...selectedPosts.map(p => p.lat || 49.2327)),
    minLng: Math.min(...selectedPosts.map(p => p.lng || -123.1207)),
    maxLng: Math.max(...selectedPosts.map(p => p.lng || -123.1207)),
  } : null;

  return (
    <div className="fixed top-0 right-0 h-screen w-full lg:w-[400px] bg-white border-l-2 border-[#E2E8F0] shadow-2xl flex flex-col z-40">
      {/* Header */}
      <div className="flex items-center justify-between p-4 lg:p-6 border-b border-[#E2E8F0]">
        <div>
          <h3 className="font-['Work_Sans',sans-serif] font-bold text-lg lg:text-xl text-[#0F172A]">
            Map View
          </h3>
          <p className="font-['Inter',sans-serif] text-xs lg:text-sm text-[#64748B] mt-1">
            {selectedPosts.length} {selectedPosts.length === 1 ? 'location' : 'locations'} selected
          </p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors"
        >
          <X size={20} className="text-[#64748B]" />
        </button>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-gradient-to-br from-[#E2E8F0] to-[#CBD5E1] overflow-hidden">
        {/* Map grid */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mapGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#0F172A" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapGrid)" />
        </svg>

        {/* Location Pins */}
        {selectedPosts.length > 0 ? (
          selectedPosts.map((post, index) => {
            // Simple positioning based on lat/lng (simplified for demo)
            const normalizedLat = bounds ? ((post.lat || 49.2327) - bounds.minLat) / (bounds.maxLat - bounds.minLat || 1) : 0.5;
            const normalizedLng = bounds ? ((post.lng || -123.1207) - bounds.minLng) / (bounds.maxLng - bounds.minLng || 1) : 0.5;
            
            const top = `${20 + normalizedLat * 60}%`;
            const left = `${20 + normalizedLng * 60}%`;
            
            return (
              <div 
                key={post.id}
                className="absolute -translate-x-1/2 -translate-y-full"
                style={{ top, left }}
              >
                <MapPin 
                  size={32} 
                  className="drop-shadow-lg"
                  style={{ color: categoryColors[post.category as keyof typeof categoryColors] || '#0F172A' }}
                  fill={categoryColors[post.category as keyof typeof categoryColors] || '#0F172A'}
                  strokeWidth={2} 
                />
              </div>
            );
          })
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6 lg:p-8">
              <MapPin size={48} className="text-[#94A3B8] mx-auto mb-4" />
              <p className="font-['Inter',sans-serif] text-xs lg:text-sm text-[#64748B]">
                Click on cards to add them to the map
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Selected Items List */}
      <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] max-h-[250px] lg:max-h-[300px] overflow-y-auto">
        {selectedPosts.map((post) => (
          <div 
            key={post.id}
            className="p-3 lg:p-4 border-b border-[#E2E8F0] hover:bg-white transition-colors group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-['Work_Sans',sans-serif] font-semibold text-xs lg:text-sm text-[#0F172A] mb-1 truncate">
                  {post.title}
                </h4>
                {post.location && (
                  <p className="font-['Inter',sans-serif] text-xs text-[#64748B] flex items-center gap-1">
                    <MapPin size={12} />
                    {post.location}
                  </p>
                )}
              </div>
              <button
                onClick={() => onRemove(post.id)}
                className="p-1 hover:bg-[#FEE2E2] rounded transition-colors opacity-0 group-hover:opacity-100"
              >
                <X size={14} className="text-[#EF4444]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}