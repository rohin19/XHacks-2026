import { CommunityPostNew } from './CommunityPostNew';

interface CommunityFeedProps {
  selectedCategory: string;
  selectedTimeframe: string;
  onSelectPost?: (post: any) => void;
  selectedPostIds?: number[];
}

const posts = [
  {
    id: 1,
    category: 'development',
    title: 'Mixed-Use Development Proposed at 234 Main Street',
    author: 'CityPlanningVan',
    timestamp: '2 hours ago',
    upvotes: 127,
    comments: 34,
    status: 'pending',
    location: '234 Main St',
    lat: 49.2327,
    lng: -123.1207,
    data: [
      'Application No: DA-2026-0142',
      'Height: 12 storeys | Units: 89 residential + 4 commercial',
      'Public comment period ends: February 28, 2026',
      'Summary: This mixed-use development aims to add much-needed residential density to the Main Street corridor while preserving street-level commercial character. Community feedback will be critical during the public comment period.',
    ],
  },
  {
    id: 2,
    category: 'road',
    title: 'Victoria Avenue Resurfacing Project Underway',
    author: 'VancouverPublicWorks',
    timestamp: '5 hours ago',
    upvotes: 89,
    comments: 12,
    status: 'approved',
    location: 'Victoria Ave',
    lat: 49.2355,
    lng: -123.1189,
    data: [
      'Project No: RD-2026-008',
      'Duration: 6 weeks | Budget: $1.2M',
      'Expected completion: March 15, 2026',
      'Summary: The resurfacing project will improve road safety and reduce traffic noise. Temporary lane closures are expected during off-peak hours to minimize disruption.',
    ],
  },
  {
    id: 3,
    category: 'council',
    title: 'City Council Approves New Cycling Infrastructure Plan',
    author: 'KerrisdaleResident',
    timestamp: '1 day ago',
    upvotes: 234,
    comments: 67,
    status: 'approved',
    location: 'City-wide',
    lat: 49.2300,
    lng: -123.1250,
    data: [
      'Council Resolution: 2026-047',
      'Investment: $4.5M over 3 years',
      'Next phase: Community consultation Q2 2026',
      'Summary: This infrastructure plan represents a significant investment in active transportation, with protected bike lanes planned for major arterial routes. Public consultation will help shape implementation priorities.',
    ],
  },
  {
    id: 4,
    category: 'service',
    title: 'Street Light Outage Reported on Elm Avenue',
    author: 'SafetyFirst604',
    timestamp: '3 hours ago',
    upvotes: 45,
    comments: 8,
    status: 'pending',
    location: 'Elm Ave & 3rd St',
    lat: 49.2340,
    lng: -123.1180,
    data: [
      'Request No: SR-2026-1847',
      'Location: Elm Ave between 3rd & 5th Street',
      'Status: Assigned to maintenance crew',
      'Summary: The maintenance crew has been dispatched to address the outage. Residents are advised to use alternative routes during evening hours until repairs are completed.',
    ],
  },
  {
    id: 5,
    category: 'development',
    title: 'Heritage Building Renovation Approved for Downtown',
    author: 'HeritageWatchVan',
    timestamp: '2 days ago',
    upvotes: 312,
    comments: 91,
    status: 'approved',
    location: '156 Queen St',
    lat: 49.2370,
    lng: -123.1220,
    data: [
      'Application No: DA-2026-0098',
      'Property: Former Post Office, 156 Queen St',
      'Investment: $3.8M | Timeline: 18 months',
      'Summary: The renovation will restore the historic facade while modernizing interior spaces for mixed commercial use. This project demonstrates the city\'s commitment to heritage preservation.',
    ],
  },
  {
    id: 6,
    category: 'council',
    title: 'New Park Development Proposed for Kerrisdale Community',
    author: 'ParksBoard',
    timestamp: '4 days ago',
    upvotes: 456,
    comments: 123,
    status: 'pending',
    location: '41st Ave & East Blvd',
    lat: 49.2310,
    lng: -123.1160,
    data: [
      'Proposal: 2.5 acre green space with playground',
      'Location: Corner of 41st Ave & East Blvd',
      'Community meeting: February 20, 2026',
      'Summary: The proposed park would fill a critical gap in neighborhood green space and provide recreational facilities for families. Community input will be essential in shaping the final design.',
    ],
  },
];

export function CommunityFeed({ selectedCategory, selectedTimeframe, onSelectPost, selectedPostIds = [] }: CommunityFeedProps) {
  const filteredPosts = posts.filter((post) => {
    if (selectedCategory === 'all') return true;
    return post.category === selectedCategory;
  });

  return (
    <div className="space-y-4">
      {filteredPosts.map((post) => (
        <CommunityPostNew 
          key={post.id} 
          post={post} 
          onSelect={() => onSelectPost?.(post)}
          isSelected={selectedPostIds.includes(post.id)}
        />
      ))}
    </div>
  );
}