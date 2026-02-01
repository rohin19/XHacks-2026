import { EventCard } from './EventCard';

const events = [
  {
    id: 1,
    category: 'development',
    title: 'Mixed-Use Development Proposed at 234 Main Street',
    status: 'pending',
    data: [
      'Application No: DA-2026-0142',
      'Height: 12 storeys | Units: 89 residential',
      'Public comment period ends: February 28, 2026',
    ],
  },
  {
    id: 2,
    category: 'road',
    title: 'Victoria Avenue Resurfacing Project Underway',
    status: 'approved',
    data: [
      'Project No: RD-2026-008',
      'Duration: 6 weeks | Budget: $1.2M',
      'Expected completion: March 15, 2026',
    ],
  },
  {
    id: 3,
    category: 'council',
    title: 'City Council Approves New Cycling Infrastructure Plan',
    status: 'approved',
    data: [
      'Council Resolution: 2026-047',
      'Investment: $4.5M over 3 years',
      'Next phase: Community consultation Q2 2026',
    ],
  },
  {
    id: 4,
    category: 'service',
    title: 'Street Light Outage Reported on Elm Avenue',
    status: 'pending',
    data: [
      'Request No: SR-2026-1847',
      'Location: Elm Ave between 3rd & 5th Street',
      'Status: Assigned to maintenance crew',
    ],
  },
  {
    id: 5,
    category: 'development',
    title: 'Heritage Building Renovation Approved for Downtown',
    status: 'approved',
    data: [
      'Application No: DA-2026-0098',
      'Property: Former Post Office, 156 Queen St',
      'Investment: $3.8M | Timeline: 18 months',
    ],
  },
];

export function EventFeed() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg text-[#2C2416] tracking-wide mb-8">Recent Activity</h2>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
