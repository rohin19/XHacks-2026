import { CommunityPost } from './CommunityPost';
import { CommunityPostOld } from './CommunityPostOld';

const samplePost = {
  id: 1,
  category: 'development' as const,
  title: 'Mixed-Use Development Proposed at 234 Main Street',
  author: 'CityPlanningVan',
  timestamp: '2 hours ago',
  upvotes: 127,
  comments: 34,
  status: 'pending' as const,
  data: [
    'Application No: DA-2026-0142',
    'Height: 12 storeys | Units: 89 residential + 4 commercial',
    'Public comment period ends: February 28, 2026',
  ],
  summary: 'This mixed-use development aims to add much-needed residential density to the Main Street corridor while preserving street-level commercial character. Community feedback will be critical during the public comment period.',
};

export function CardComparison() {
  return (
    <div className="grid grid-cols-2 gap-8 p-8">
      <div>
        <h3 className="font-['Work_Sans',sans-serif] font-bold text-2xl text-[#0F172A] mb-4">
          Previous Design
        </h3>
        <p className="font-['Inter',sans-serif] text-sm text-[#64748B] mb-6">
          Bold typography, gradient backgrounds, stronger shadows, rounded-full badges
        </p>
        <CommunityPostOld post={samplePost} />
      </div>
      
      <div>
        <h3 className="font-['Work_Sans',sans-serif] font-bold text-2xl text-[#0F172A] mb-4">
          Current Design (Minimalist)
        </h3>
        <p className="font-['Inter',sans-serif] text-sm text-[#64748B] mb-6">
          Cleaner lines, more whitespace, subtle shadows, minimal decorative elements
        </p>
        <CommunityPost post={samplePost} />
      </div>
    </div>
  );
}
