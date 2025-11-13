export interface NewsItem {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  source: string;
  sourceUrl: string;
  thumbnail?: string;
  author?: string;
  authorImage?: string;
  readTime?: string;
}

export const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "How Zerodha Built India's Largest Stock Brokerage Without Spending on Marketing",
    description: "The story of how two brothers from Bangalore created a fintech unicorn that revolutionized retail trading in India, serving over 10 million clients without traditional advertising.",
    category: "Founders",
    date: "Jan 15",
    source: "India Got Startup",
    sourceUrl: "#",
    thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&auto=format&fit=crop",
    author: "Priya Sharma",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop",
    readTime: "8 min read",
  },
  {
    id: "2",
    title: "CRED's Kunal Shah on Building Products That Users Love",
    description: "An in-depth conversation with CRED's founder about product design, user psychology, and why solving for trust became India's most valuable fintech play.",
    category: "Insights",
    date: "Jan 14",
    source: "India Got Startup",
    sourceUrl: "#",
    thumbnail: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1200&auto=format&fit=crop",
    author: "Rahul Mehta",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop",
    readTime: "12 min read",
  },
  {
    id: "3",
    title: "Razorpay Crosses $1 Billion in Annual Revenue: The Journey",
    description: "From a two-person team in Bangalore to processing billions in payments, Razorpay's founders share their story of building India's payment infrastructure.",
    category: "Growth",
    date: "Jan 13",
    source: "India Got Startup",
    sourceUrl: "#",
    thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&auto=format&fit=crop",
    author: "Anjali Reddy",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop",
    readTime: "10 min read",
  },
  {
    id: "4",
    title: "The Rise of Tier 2 City Startups: Why Jaipur is the New Bangalore",
    description: "How startups from smaller cities are disrupting traditional tech hubs and building billion-dollar companies with half the cost and twice the determination.",
    category: "Trends",
    date: "Jan 12",
    source: "India Got Startup",
    sourceUrl: "#",
    thumbnail: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&auto=format&fit=crop",
    author: "Vikram Singh",
    authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop",
    readTime: "7 min read",
  },
  {
    id: "5",
    title: "Meesho's Blueprint: Winning India's Heartland Through Social Commerce",
    description: "The untold story of how Meesho cracked the code of reaching 100 million+ users in small towns by empowering housewives to become entrepreneurs.",
    category: "Strategy",
    date: "Jan 11",
    source: "India Got Startup",
    sourceUrl: "#",
    thumbnail: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop",
    author: "Neha Kapoor",
    authorImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&auto=format&fit=crop",
    readTime: "9 min read",
  },
  {
    id: "6",
    title: "From Rejection to $150M: PhonePe's Acquisition by Flipkart",
    description: "The dramatic story of three founders who were rejected by every VC in India, only to build one of the country's largest digital payment platforms.",
    category: "Founders",
    date: "Jan 10",
    source: "India Got Startup",
    sourceUrl: "#",
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop",
    author: "Arjun Patel",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop",
    readTime: "11 min read",
  },
  {
    id: "7",
    title: "Why Indian SaaS Startups Are Conquering Global Markets",
    description: "Freshworks, Zoho, and others are proving that India can build world-class B2B software. Here's what makes the Indian SaaS playbook different.",
    category: "SaaS",
    date: "Jan 9",
    source: "India Got Startup",
    sourceUrl: "#",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop",
    author: "Kavita Nair",
    authorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop",
    readTime: "8 min read",
  },
  {
    id: "8",
    title: "Inside Swiggy's Playbook: Mastering Food Delivery at Scale",
    description: "How Swiggy built India's most efficient delivery network, handling millions of orders daily across 500+ cities with technology and gig workers.",
    category: "Operations",
    date: "Jan 8",
    source: "India Got Startup",
    sourceUrl: "#",
    thumbnail: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1200&auto=format&fit=crop",
    author: "Sanjay Kumar",
    authorImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop",
    readTime: "10 min read",
  },
];
