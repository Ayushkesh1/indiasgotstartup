export interface IncubatorTeamMember {
  id: string;
  name: string;
  designation: string;
  image_url: string;
  email: string;
  linkedin_url: string;
  location: string;
}

export interface IncubatorData {
  id: string;
  slug: string;
  name: string;
  logo: string;
  coverImage: string;
  city: string;
  state: string;
  sectors: string[];
  shortDescription: string;
  about: string;
  programDescription: string;
  website: string;
  socials: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    email?: string;
  };
  investmentStages: string[];
  grantAvailable: boolean;
  grantAmount?: string;
  equityRequirement?: string;
  applicationStatus: 'Open' | 'Closed' | 'Rolling';
  deadline?: string;
  eligibility: string;
  badges: string[];
  teamMembers: IncubatorTeamMember[];
  address: string;
  phone: string;
}

export const dummyIncubators: IncubatorData[] = [
  {
    id: "inc-001",
    slug: "t-hub-hyderabad",
    name: "T-Hub Hyderabad",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop&q=80",
    city: "Hyderabad",
    state: "Telangana",
    sectors: ["SaaS", "AI", "FinTech", "HealthTech"],
    shortDescription: "India's pioneering innovation hub and ecosystem enabler powering the next generation of startups.",
    about: "T-Hub (Technology Hub) is an innovation hub and ecosystem enabler. Based out of Hyderabad, India, T-Hub leads India’s pioneering innovation ecosystem that powers next-generation products and new business models.",
    programDescription: "Our flagship 6-month accelerator provides intensive mentoring, market access, and funding connections to scale your startup globally.",
    website: "https://t-hub.co",
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      email: "hello@t-hub.co"
    },
    investmentStages: ["Idea Stage", "MVP Stage", "Early Revenue"],
    grantAvailable: true,
    grantAmount: "Up to ₹50 Lakhs",
    equityRequirement: "No Equity for Grants",
    applicationStatus: "Rolling",
    eligibility: "DPIIT recognized startup, minimum viable product ready, registered in India.",
    badges: ["Govt Backed", "Grant Available", "No Equity", "Top Tier Mentorship"],
    teamMembers: [
      {
        id: "tm-1",
        name: "Ravi Kumar",
        designation: "CEO",
        image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80",
        email: "ravi@t-hub.dummy",
        linkedin_url: "https://linkedin.com",
        location: "Hyderabad, India"
      },
      {
        id: "tm-2",
        name: "Priya Sharma",
        designation: "Director of Programs",
        image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
        email: "priya@t-hub.dummy",
        linkedin_url: "https://linkedin.com",
        location: "Hyderabad, India"
      }
    ],
    address: "T-Hub Phase 2, Knowledge City, HITEC City, Hyderabad, Telangana 500081",
    phone: "+91 40 1234 5678"
  },
  {
    id: "inc-002",
    slug: "cii-co-startup-incubation",
    name: "CIIE.CO",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?w=1200&h=400&fit=crop&q=80",
    city: "Ahmedabad",
    state: "Gujarat",
    sectors: ["ClimateTech", "DeepTech", "Agritech"],
    shortDescription: "The Innovation Continuum spreading across incubation, acceleration, seed and growth funding.",
    about: "CIIE.CO is The Innovation Continuum. We catalyze startups to solve the most pressing problems. Our focus is on deep tech, climate tech, and inclusion.",
    programDescription: "Deep tech focused incubation program with access to labs, industry experts, and a seed fund of up to ₹1 Crore.",
    website: "https://ciie.co",
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      email: "contact@ciie.dummy"
    },
    investmentStages: ["Early Revenue", "Growth Stage", "DeepTech Startups"],
    grantAvailable: true,
    grantAmount: "Up to ₹1 Crore",
    equityRequirement: "3-5% Equity",
    applicationStatus: "Open",
    deadline: "2024-08-15",
    eligibility: "Technology backed product, revenue generating or strong IP, addressing large market.",
    badges: ["DeepTech Focus", "Seed Funding", "University Backed"],
    teamMembers: [
      {
        id: "tm-3",
        name: "Vikram Seth",
        designation: "Managing Partner",
        image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&q=80",
        email: "vikram@ciie.dummy",
        linkedin_url: "https://linkedin.com",
        location: "Ahmedabad, India"
      }
    ],
    address: "IIM Ahmedabad Campus, Vastrapur, Ahmedabad, Gujarat 380015",
    phone: "+91 79 1234 5678"
  },
  {
    id: "inc-003",
    slug: "nsrcel-iim-bangalore",
    name: "NSRCEL IIM Bangalore",
    logo: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1541844053589-346841d0b34c?w=1200&h=400&fit=crop&q=80",
    city: "Bangalore",
    state: "Karnataka",
    sectors: ["Social Impact", "Women-led", "EdTech", "D2C"],
    shortDescription: "A premier hub for entrepreneurial growth at the Indian Institute of Management Bangalore.",
    about: "NSRCEL brings together startups, industry mentors, and academic experts. We have specialized programs for women entrepreneurs and social impact ventures.",
    programDescription: "Provides a 12-month incubation encompassing masterclasses, strict milestones, and networking opportunities.",
    website: "https://nsrcel.org",
    socials: {
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com"
    },
    investmentStages: ["Idea Stage", "Women-led Startups", "Social Impact Startups"],
    grantAvailable: true,
    grantAmount: "₹10 - ₹25 Lakhs",
    equityRequirement: "No Equity for Grants",
    applicationStatus: "Closed",
    eligibility: "Open to ventures with a clear social mission or led by women founders.",
    badges: ["Women Founder Support", "Social Impact", "University Backed", "Grant Available"],
    teamMembers: [
      {
        id: "tm-4",
        name: "Anita Rao",
        designation: "Program Head - Women Startup Program",
        image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80",
        email: "anita@nsrcel.dummy",
        linkedin_url: "https://linkedin.com",
        location: "Bangalore, India"
      }
    ],
    address: "IIM Bangalore, Bannerghatta Road, Bengaluru, Karnataka 560076",
    phone: "+91 80 2699 3000"
  },
  {
    id: "inc-004",
    slug: "10000-startups-nasscom",
    name: "10,000 Startups (NASSCOM)",
    logo: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=400&fit=crop&q=80",
    city: "Gurgaon",
    state: "Haryana",
    sectors: ["SaaS", "AI", "Web3", "Cybersecurity"],
    shortDescription: "NASSCOM's initiative to scale the startup ecosystem in India.",
    about: "10,000 Startups is an initiative by NASSCOM to support, impact, and scale 10,000 tech startups in India. We provide workspace, mentoring, and investor access.",
    programDescription: "Warehouse program offering subsidized co-working space, cloud credits, and direct introductions to angels and VCs.",
    website: "https://10000startups.com",
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    },
    investmentStages: ["MVP Stage", "Early Revenue"],
    grantAvailable: false,
    applicationStatus: "Rolling",
    eligibility: "Tech startup with an MVP, highly scalable model, registered in India.",
    badges: ["Corporate Connects", "Cloud Credits", "Investor Network"],
    teamMembers: [
      {
        id: "tm-5",
        name: "Karan Singh",
        designation: "Community Manager",
        image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
        email: "karan@10k.dummy",
        linkedin_url: "https://linkedin.com",
        location: "Gurgaon, India"
      }
    ],
    address: "NASSCOM Center of Excellence, Sector 44, Gurugram, Haryana 122003",
    phone: "+91 124 123456"
  },
  {
    id: "inc-005",
    slug: "venture-center-pune",
    name: "Venture Center",
    logo: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&h=200&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=400&fit=crop&q=80",
    city: "Pune",
    state: "Maharashtra",
    sectors: ["Biotech", "HealthTech", "Hardware", "Materials"],
    shortDescription: "India's largest science-based business incubator hosted by CSIR-NCL.",
    about: "Venture Center is a technology business incubator specializing in technology ventures based on materials, chemicals, and biological sciences.",
    programDescription: "Offers specialized lab spaces, analytical facilities, and seed funding through NIDHI-SEED and BIRAC SEED programs.",
    website: "https://venturecenter.co.in",
    socials: {
      linkedin: "https://linkedin.com",
      email: "info@venturecenter.dummy"
    },
    investmentStages: ["DeepTech Startups", "Idea Stage", "MVP Stage"],
    grantAvailable: true,
    grantAmount: "Up to ₹50 Lakhs",
    equityRequirement: "2% Equity or Convertible Note",
    applicationStatus: "Open",
    deadline: "2024-09-30",
    eligibility: "Science and technology based startup, strong IP potential.",
    badges: ["DeepTech Focus", "Lab Access", "Govt Backed", "Grant Available"],
    teamMembers: [
      {
        id: "tm-6",
        name: "Dr. Premnath",
        designation: "Director",
        image_url: "https://images.unsplash.com/photo-1537368910025-7028a909ddf4?w=150&h=150&fit=crop&q=80",
        email: "premnath@vc.dummy",
        linkedin_url: "https://linkedin.com",
        location: "Pune, India"
      }
    ],
    address: "NCL Innovation Park, Dr. Homi Bhabha Road, Pune, Maharashtra 411008",
    phone: "+91 20 2586 5877"
  },
  {
    id: "inc-006",
    slug: "sines-iit-bombay",
    name: "SINE IIT Bombay",
    logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=400&fit=crop&q=80",
    city: "Mumbai",
    state: "Maharashtra",
    sectors: ["Hardware", "DeepTech", "CleanTech", "EdTech"],
    shortDescription: "Society for Innovation and Entrepreneurship at IIT Bombay.",
    about: "SINE administers a business incubator which provides support for technology based entrepreneurship. It fosters the translation of research into commercial applications.",
    programDescription: "Comprehensive incubation including physical infrastructure, seed funding, and access to IIT Bombay labs and faculty.",
    website: "https://sineiitb.org",
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    },
    investmentStages: ["Idea Stage", "MVP Stage", "Student Startups", "DeepTech Startups"],
    grantAvailable: true,
    grantAmount: "Up to ₹10 Lakhs (Prototyping)",
    equityRequirement: "4-6% Equity",
    applicationStatus: "Rolling",
    eligibility: "Tech focus, scalable, preferably with IITB alumni/student involvement but open to all.",
    badges: ["University Backed", "DeepTech Focus", "Student Friendly", "Seed Funding"],
    teamMembers: [
      {
        id: "tm-7",
        name: "Poyni Bhatt",
        designation: "CEO",
        image_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&q=80",
        email: "poyni@sine.dummy",
        linkedin_url: "https://linkedin.com",
        location: "Mumbai, India"
      }
    ],
    address: "CSRE Building, IIT Bombay Campus, Powai, Mumbai, Maharashtra 400076",
    phone: "+91 22 2576 7016"
  },
  {
    id: "inc-007",
    slug: "aic-bimtech",
    name: "AIC-BIMTECH",
    logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200&h=200&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&h=400&fit=crop&q=80",
    city: "Greater Noida",
    state: "Uttar Pradesh",
    sectors: ["AgriTech", "HealthTech", "EdTech", "D2C"],
    shortDescription: "Atal Incubation Centre backed by NITI Aayog at BIMTECH.",
    about: "AIC-BIMTECH is a sector-agnostic incubator focusing on high-growth startups. We are supported by AIM, NITI Aayog.",
    programDescription: "12-month incubation program providing dedicated workspace, mentoring, and corporate connects.",
    website: "https://aicbimtech.com",
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    },
    investmentStages: ["MVP Stage", "Early Revenue"],
    grantAvailable: false,
    applicationStatus: "Open",
    deadline: "2024-10-31",
    eligibility: "Startups with a registered entity, MVP ready, early traction preferred.",
    badges: ["Govt Backed", "Corporate Connects", "Sector Agnostic"],
    teamMembers: [
      {
        id: "tm-8",
        name: "Abha Rishi",
        designation: "CEO",
        image_url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&h=150&fit=crop&q=80",
        email: "abha@aic.dummy",
        linkedin_url: "https://linkedin.com",
        location: "Greater Noida, India"
      }
    ],
    address: "BIMTECH Campus, Plot Number 5, Knowledge Park II, Greater Noida, UP 201306",
    phone: "+91 120 684 3000"
  },
  {
    id: "inc-008",
    slug: "riidl-somaiya",
    name: "riidl Somaiya",
    logo: "https://images.unsplash.com/photo-1614030424754-24d0eebd46ad?w=200&h=200&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=1200&h=400&fit=crop&q=80",
    city: "Mumbai",
    state: "Maharashtra",
    sectors: ["Consumer Tech", "IoT", "HealthTech", "Web3"],
    shortDescription: "Research Innovation Incubation Design Laboratory.",
    about: "riidl is an incubation center supported by NSTEDB, DST, BIRAC, and MSME. We focus on bridging the gap between academia and industry.",
    programDescription: "Offers MakerSpace, BioRiiDL, and tech incubation with a strong focus on community and prototyping.",
    website: "https://riidl.org",
    socials: {
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com"
    },
    investmentStages: ["Idea Stage", "MVP Stage", "Student Startups"],
    grantAvailable: true,
    grantAmount: "Up to ₹7 Lakhs (Nidhi Prayas)",
    equityRequirement: "No Equity for Prototyping Grants",
    applicationStatus: "Rolling",
    eligibility: "Open to students, faculty, and outside entrepreneurs with physical or digital product ideas.",
    badges: ["MakerSpace", "Student Friendly", "Prototyping Grant", "Bio Lab"],
    teamMembers: [
      {
        id: "tm-9",
        name: "Gaurang Shetty",
        designation: "Chief Innovation Catalyst",
        image_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&q=80",
        email: "gaurang@riidl.dummy",
        linkedin_url: "https://linkedin.com",
        location: "Mumbai, India"
      }
    ],
    address: "Somaiya Vidyavihar University Campus, Vidyavihar East, Mumbai, Maharashtra 400077",
    phone: "+91 22 6728 3220"
  }
];
