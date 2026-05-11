import { Person, mockPeople } from './mockPeople';

export interface AppEvent {
  id: string;
  title: string;
  type: string; 
  locationType: string; 
  location: string;
  date: string;
  targetAudience: string[]; 
  fieldOfStartup: string[]; 
  description: string;
  imageUrl: string;
  registrationLink: string;
  organizer: string;
  
  // New Mini-Luma fields
  organizerProfile?: Person;
  agenda?: { time: string; title: string; description?: string }[];
  speakers?: Person[];
  participants?: Person[];
  price?: string; 
  registrationDeadline?: string;
}

export const EVENTS_DATA: AppEvent[] = [
  {
    id: "evt_1",
    title: "Delhi NCR Founder Meetup",
    type: "Networking",
    locationType: "In-Person",
    location: "Cyber Hub, Gurugram",
    date: "May 20, 2026 • 5:00 PM - 8:00 PM",
    targetAudience: ["Founders", "Investors"],
    fieldOfStartup: ["All Sectors"],
    description: "An exclusive evening for startup founders in the Delhi NCR region to connect, share challenges, and discuss growth strategies over drinks and dinner. Limited capacity to ensure meaningful conversations.",
    imageUrl: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80&w=1200",
    registrationLink: "https://example.com/register/1",
    organizer: "NCR Startup Network",
    organizerProfile: undefined,
    price: "Free",
    registrationDeadline: "May 18, 2026",
    agenda: [
      { time: "5:00 PM", title: "Arrival & Welcome Drinks", description: "Grab a drink and settle in." },
      { time: "6:00 PM", title: "Founder Lightning Talks", description: "3 founders share their biggest recent learnings (5 mins each)." },
      { time: "6:30 PM", title: "Open Networking", description: "Mingle with fellow founders." },
      { time: "8:00 PM", title: "Closing", description: "Event concludes." }
    ],
    speakers: [],
    participants: []
  },
  {
    id: "evt_2",
    title: "AI Builders Night Bangalore",
    type: "Workshop",
    locationType: "Hybrid",
    location: "Koramangala & Virtual",
    date: "June 5, 2026 • 6:00 PM - 9:00 PM",
    targetAudience: ["Developers", "Founders"],
    fieldOfStartup: ["AI", "Tech"],
    description: "Join the largest gathering of AI engineers and founders in Bangalore. We'll be diving deep into building resilient LLM applications, retrieval-augmented generation techniques, and demoing new internal tools.",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1200",
    registrationLink: "https://example.com/register/2",
    organizer: "Bangalore AI Club",
    organizerProfile: undefined,
    price: "Paid - ₹500",
    registrationDeadline: "June 3, 2026",
    agenda: [
      { time: "6:00 PM", title: "Registration & Snacks" },
      { time: "6:30 PM", title: "Keynote: The State of Indic LLMs", description: "Exploring language models tailored for Indian languages." },
      { time: "7:15 PM", title: "Live Code: RAG from Scratch", description: "Hands-on session building a RAG pipeline." },
      { time: "8:15 PM", title: "Demo Day & Networking", description: "Showcase what you are building." }
    ],
    speakers: [],
    participants: []
  },
  {
    id: "evt_3",
    title: "Startup Pitch Evening Mumbai",
    type: "Competition",
    locationType: "In-Person",
    location: "BKC, Mumbai",
    date: "July 15, 2026 • 4:00 PM - 8:00 PM",
    targetAudience: ["Founders", "Investors"],
    fieldOfStartup: ["Fintech", "D2C", "SaaS"],
    description: "Watch 10 curated early-stage startups pitch live to a panel of top-tier VCs and angel investors. A great opportunity to witness fundraising in action and network with the Mumbai venture ecosystem.",
    imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=1200",
    registrationLink: "https://example.com/register/3",
    organizer: "Mumbai Angels",
    organizerProfile: undefined,
    price: "Free for Investors, ₹1000 for Attendees",
    registrationDeadline: "July 10, 2026",
    agenda: [
      { time: "4:00 PM", title: "Doors Open & High Tea" },
      { time: "5:00 PM", title: "Pitch Session 1", description: "5 startups pitch for 5 minutes each, followed by Q&A." },
      { time: "6:15 PM", title: "Break" },
      { time: "6:30 PM", title: "Pitch Session 2", description: "Remaining 5 startups pitch." },
      { time: "7:45 PM", title: "Networking Dinner" }
    ],
    speakers: [],
    participants: []
  },
  {
    id: "evt_4",
    title: "D2C Brand Growth Workshop",
    type: "Workshop",
    locationType: "Online",
    location: "Virtual",
    date: "August 10, 2026 • 2:00 PM - 5:00 PM",
    targetAudience: ["Founders", "Marketers"],
    fieldOfStartup: ["D2C", "E-commerce"],
    description: "A comprehensive virtual workshop on scaling Direct-to-Consumer brands in India. Covering performance marketing, retention strategies, and optimizing supply chains.",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200",
    registrationLink: "https://example.com/register/4",
    organizer: "GrowthX",
    organizerProfile: undefined,
    price: "Paid - ₹2000",
    registrationDeadline: "August 9, 2026",
    agenda: [
      { time: "2:00 PM", title: "Mastering Meta Ads for D2C" },
      { time: "3:30 PM", title: "Retention is the new Acquisition", description: "Email & WhatsApp marketing teardowns." },
      { time: "4:30 PM", title: "Q&A Session" }
    ],
    speakers: [],
    participants: []
  },
  {
    id: "evt_5",
    title: "Women in Startups Mixer",
    type: "Networking",
    locationType: "In-Person",
    location: "Indiranagar, Bangalore",
    date: "September 5, 2026 • 6:30 PM - 9:30 PM",
    targetAudience: ["Founders", "Investors", "Operators"],
    fieldOfStartup: ["All Sectors"],
    description: "An evening dedicated to celebrating and connecting women building the Indian startup ecosystem. Join us for inspiring stories, mentorship opportunities, and powerful networking.",
    imageUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=1200",
    registrationLink: "https://example.com/register/5",
    organizer: "Women in Tech India",
    organizerProfile: undefined,
    price: "Free",
    registrationDeadline: "September 1, 2026",
    agenda: [
      { time: "6:30 PM", title: "Welcome & Introductions" },
      { time: "7:00 PM", title: "Panel: Navigating Fundraising as a Female Founder" },
      { time: "8:00 PM", title: "Mixer & Dinner" }
    ],
    speakers: [],
    participants: []
  },
  {
    id: "evt_6",
    title: "Incubator Open House",
    type: "Open House",
    locationType: "In-Person",
    location: "T-Hub, Hyderabad",
    date: "October 12, 2026 • 10:00 AM - 4:00 PM",
    targetAudience: ["Students", "Early-stage Founders"],
    fieldOfStartup: ["Tech", "DeepTech", "Hardware"],
    description: "Tour the facilities, meet the mentors, and learn how our incubation programs can accelerate your startup journey from prototype to product-market fit.",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
    registrationLink: "https://example.com/register/6",
    organizer: "T-Hub Innovations",
    organizerProfile: undefined,
    price: "Free",
    registrationDeadline: "October 10, 2026",
    agenda: [
      { time: "10:00 AM", title: "Facility Tour" },
      { time: "11:30 AM", title: "Program Overview Session" },
      { time: "1:00 PM", title: "Networking Lunch" },
      { time: "2:00 PM", title: "1-on-1 Mentorship Slots (Pre-booked)" }
    ],
    speakers: [],
    participants: []
  },
  {
    id: "evt_7",
    title: "Investor Office Hours",
    type: "Office Hours",
    locationType: "Online",
    location: "Virtual",
    date: "November 2, 2026 • 3:00 PM - 5:00 PM",
    targetAudience: ["Founders"],
    fieldOfStartup: ["Seed Stage", "All Sectors"],
    description: "Book a 15-minute slot to pitch your startup or get advice directly from active angel investors and VCs. Registration does not guarantee a slot; selected startups will be notified.",
    imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=1200",
    registrationLink: "https://example.com/register/7",
    organizer: "Angel Network India",
    organizerProfile: undefined,
    price: "Free",
    registrationDeadline: "October 25, 2026",
    agenda: [
      { time: "3:00 PM", title: "Virtual Waiting Room Opens" },
      { time: "3:15 PM", title: "1-on-1 Sessions Begin" }
    ],
    speakers: [],
    participants: []
  }
];
