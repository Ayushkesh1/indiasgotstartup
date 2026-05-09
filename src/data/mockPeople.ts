export type RoleType = "Startup" | "Incubator" | "Investor" | "Expert" | "Creator" | "Normal";

export interface Person {
  id: string;
  name: string;
  role: RoleType;
  title: string;
  company?: string;
  avatar_url: string;
  bio: string;
  location: string;
  followersCount: number;
  followingCount: number;
  connectionsCount: number;
  isVerified: boolean;
  tags: string[];
}

export const mockPeople: Person[] = [
  {
    id: "p1",
    name: "Rohan Desai",
    role: "Startup",
    title: "Founder & CEO",
    company: "FinEase India",
    avatar_url: "https://i.pravatar.cc/150?u=rohan",
    bio: "Building the next generation of credit solutions for SMBs in India. 2x Founder. Tech enthusiast.",
    location: "Bengaluru, Karnataka",
    followersCount: 1400,
    followingCount: 450,
    connectionsCount: 500,
    isVerified: true,
    tags: ["Fintech", "SaaS", "B2B"],
  },
  {
    id: "p2",
    name: "Ananya Sharma",
    role: "Investor",
    title: "Partner",
    company: "VentureX India",
    avatar_url: "https://i.pravatar.cc/150?u=ananya",
    bio: "Early-stage investor focused on climate tech and consumer brands. Always looking for passionate founders.",
    location: "Mumbai, Maharashtra",
    followersCount: 12000,
    followingCount: 890,
    connectionsCount: 1000,
    isVerified: true,
    tags: ["Climate Tech", "D2C", "Seed Stage"],
  },
  {
    id: "p3",
    name: "Karan Singh",
    role: "Expert",
    title: "Growth Marketer",
    company: "GrowthX",
    avatar_url: "https://i.pravatar.cc/150?u=karan",
    bio: "Helping startups scale from 0 to 1 and beyond. Ex-Swiggy, Ex-Oyo.",
    location: "Delhi, NCR",
    followersCount: 8500,
    followingCount: 300,
    connectionsCount: 800,
    isVerified: true,
    tags: ["Growth", "Marketing", "Performance"],
  },
  {
    id: "p4",
    name: "Meera Patel",
    role: "Incubator",
    title: "Program Director",
    company: "T-Hub",
    avatar_url: "https://i.pravatar.cc/150?u=meera",
    bio: "Managing startup acceleration programs. Supporting the Indian startup ecosystem since 2015.",
    location: "Hyderabad, Telangana",
    followersCount: 5200,
    followingCount: 600,
    connectionsCount: 950,
    isVerified: true,
    tags: ["Incubation", "Mentorship", "Community"],
  },
  {
    id: "p5",
    name: "Vikram Iyer",
    role: "Creator",
    title: "Startup Storyteller",
    avatar_url: "https://i.pravatar.cc/150?u=vikram",
    bio: "Writing about the Indian startup ecosystem. Host of 'The Indic Startup' podcast.",
    location: "Pune, Maharashtra",
    followersCount: 45000,
    followingCount: 120,
    connectionsCount: 4000,
    isVerified: true,
    tags: ["Media", "Content", "Storytelling"],
  },
  {
    id: "p6",
    name: "Sneha Reddy",
    role: "Startup",
    title: "CTO",
    company: "HealthAI",
    avatar_url: "https://i.pravatar.cc/150?u=sneha",
    bio: "Building AI tools for preventive healthcare. AI researcher turned entrepreneur.",
    location: "Bengaluru, Karnataka",
    followersCount: 2300,
    followingCount: 200,
    connectionsCount: 600,
    isVerified: false,
    tags: ["HealthTech", "AI", "Engineering"],
  },
  {
    id: "p7",
    name: "Aditya Verma",
    role: "Investor",
    title: "Angel Investor",
    avatar_url: "https://i.pravatar.cc/150?u=aditya",
    bio: "Active angel investor. 20+ portfolio companies. Exiting founder.",
    location: "Gurugram, Haryana",
    followersCount: 9000,
    followingCount: 1500,
    connectionsCount: 2000,
    isVerified: true,
    tags: ["Angel Investing", "SaaS", "Web3"],
  },
  {
    id: "p8",
    name: "Priya Kapoor",
    role: "Normal",
    title: "Product Manager",
    company: "Zomato",
    avatar_url: "https://i.pravatar.cc/150?u=priya",
    bio: "Product enthusiast. Exploring the startup ecosystem. Always learning.",
    location: "Mumbai, Maharashtra",
    followersCount: 800,
    followingCount: 1000,
    connectionsCount: 450,
    isVerified: false,
    tags: ["Product Management", "Design"],
  }
];
