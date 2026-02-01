import { CommunityPost } from './CommunityPost';
import { CommunityPostNew } from './CommunityPostNew';

const samplePost = {
  id: 1,
  category: 'road' as const,
  title: 'Victoria Avenue Resurfacing Project Underway',
  author: 'VancouverPublicWorks',
  timestamp: '5 hours ago',
  upvotes: 89,
  comments: 12,
  status: 'approved' as const,
  location: 'Victoria Ave',
  data: [
    'Project No: RD-2026-008',
    'Duration: 6 weeks | Budget: $1.2M',
    'Expected completion: March 15, 2026',
    'Summary: The resurfacing project will improve road safety and reduce traffic noise. Temporary lane closures are expected during off-peak hours to minimize disruption.',
  ],
};

export function CardComparisonView() {
  return (
    <div className="grid grid-cols-2 gap-8 p-8">
      <div>
        <h3 className="font-['Work_Sans',sans-serif] font-bold text-2xl text-[#0F172A] mb-2">
          Current Design
        </h3>
        <p className="font-['Inter',sans-serif] text-sm text-[#64748B] mb-6">
          Full-width card with gradient data box and all information displayed
        </p>
        <CommunityPost post={samplePost} />
      </div>
      
      <div>
        <h3 className="font-['Work_Sans',sans-serif] font-bold text-2xl text-[#0F172A] mb-2">
          New Design (Two-Column)
        </h3>
        <p className="font-['Inter',sans-serif] text-sm text-[#64748B] mb-6">
          Technical drawing style with left content (70%) and right map (30%)
        </p>
        <CommunityPostNew post={samplePost} />
      </div>
    </div>
  );
}
