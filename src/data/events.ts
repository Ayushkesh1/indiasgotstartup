export interface AppEvent {
  id: string;
  title: string;
  type: string; // 'Hackathon', 'Seminar', 'Competition', 'Networking'
  locationType: string; // 'Online', 'In-Person'
  location: string;
  date: string;
  targetAudience: string[]; // 'Students', 'Startups', 'Investors', 'Everyone'
  fieldOfStartup: string[]; // 'Tech', 'Fintech', 'SaaS', 'Hardware', 'BioTech', 'EdTech'
  description: string;
  imageUrl: string;
  registrationLink: string;
  organizer: string;
}

export const EVENTS_DATA: AppEvent[] = [
  {
    id: "evt_1",
    title: "Global AI Hackathon 2026",
    type: "Hackathon",
    locationType: "Online",
    location: "Virtual",
    date: "May 15 - 17, 2026",
    targetAudience: ["Students", "Startups"],
    fieldOfStartup: ["Tech", "AI"],
    description: "Join thousands of developers worldwide to build the next generation of generative AI models and applications over a thrilling 48-hour period.",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800",
    registrationLink: "https://example.com/register/1",
    organizer: "OpenAI Foundation"
  },
  {
    id: "evt_2",
    title: "Fintech Summit India",
    type: "Seminar",
    locationType: "In-Person",
    location: "Bengaluru, India",
    date: "June 22, 2026",
    targetAudience: ["Startups", "Investors"],
    fieldOfStartup: ["Fintech"],
    description: "The premier gathering for fintech founders, banking leaders, and VCs in Asia. Discover emerging regulatory trends and decentralized finance architectures.",
    imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=800",
    registrationLink: "https://example.com/register/2",
    organizer: "FinTech India Core"
  },
  {
    id: "evt_3",
    title: "Hardware Innovators Challenge",
    type: "Competition",
    locationType: "In-Person",
    location: "IIT Bombay, Mumbai",
    date: "July 10, 2026",
    targetAudience: ["Students", "Startups"],
    fieldOfStartup: ["Hardware", "Tech"],
    description: "A pitch competition specifically designed for hardware deeptech startups. Compete for a total prize pool of ₹50 Lakhs and direct acceleration.",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    registrationLink: "https://example.com/register/3",
    organizer: "DeepTech Partners"
  },
  {
    id: "evt_4",
    title: "SaaS Builders Networking Meetup",
    type: "Networking",
    locationType: "In-Person",
    location: "Delhi NCR",
    date: "August 05, 2026",
    targetAudience: ["Startups"],
    fieldOfStartup: ["SaaS", "Tech"],
    description: "An exclusive, invite-only evening for SaaS founders crossing $1M ARR. Discuss go-to-market strategies and scaling challenges over drinks.",
    imageUrl: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80&w=800",
    registrationLink: "https://example.com/register/4",
    organizer: "SaaSBooster"
  },
  {
    id: "evt_5",
    title: "EdTech Disruptors Conference",
    type: "Seminar",
    locationType: "Hybrid",
    location: "Hyderabad & Virtual",
    date: "September 12, 2026",
    targetAudience: ["Startups", "Everyone"],
    fieldOfStartup: ["EdTech"],
    description: "Explaining the future of immersive learning. Hear from top educators and technologists building VR classrooms and AI tutors.",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
    registrationLink: "https://example.com/register/5",
    organizer: "EduFuture Org"
  },
  {
    id: "evt_6",
    title: "BioTech Research Symposium",
    type: "Seminar",
    locationType: "In-Person",
    location: "Chennai, India",
    date: "October 01, 2026",
    targetAudience: ["Students", "Investors"],
    fieldOfStartup: ["BioTech"],
    description: "Focused on CRISPR, cellular agriculture, and longevity startups. Connect researchers transitioning from academic labs to commercial ventures.",
    imageUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800",
    registrationLink: "https://example.com/register/6",
    organizer: "BioIncubator Labs"
  }
];
