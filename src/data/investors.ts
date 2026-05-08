export interface InvestorTeamMember {
  id: string;
  name: string;
  designation: string;
  image_url: string;
  email?: string;
  linkedin_url?: string;
  location: string;
  bio?: string;
}

export interface InvestorData {
  id: string;
  slug: string;
  name: string;
  logo: string;
  coverImage: string;
  city: string;
  state: string;
  type: 'Angel' | 'Micro-VC' | 'VC Fund' | 'Family Office' | 'Corporate VC' | 'Accelerator Fund';
  tagline: string;
  about: string;
  investmentThesis?: string;
  notableInvestments?: string[];
  preferredSectors: string[];
  preferredStages: string[];
  ticketSizeMin?: string;
  ticketSizeMax?: string;
  portfolioCount?: number;
  aum?: string;
  website?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
  isVerified?: boolean;
  teamMembers?: InvestorTeamMember[];
  email?: string;
  phone?: string;
  address?: string;
  badges?: string[];
  openToDeals?: boolean;
}

export const dummyInvestors: InvestorData[] = [
  {
    id: "inv-001",
    slug: "nexus-venture-partners",
    name: "Nexus Venture Partners",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop&q=80",
    city: "Mumbai",
    state: "Maharashtra",
    type: "VC Fund",
    tagline: "Partnering with bold entrepreneurs building category-defining companies from India.",
    about: "Nexus Venture Partners is an India and US focused venture capital firm. We believe in partnering with exceptional entrepreneurs who are building transformative businesses. With over 15 years of investment experience, we have backed some of India's most iconic startups across enterprise software, consumer internet, and deep tech.",
    investmentThesis: "We invest in seed to Series A companies with a strong technology moat. Our thesis centers on founders who are solving large, real problems with a clear path to global scale. We look for exceptional product thinking, capital efficiency, and a deep understanding of the market.",
    notableInvestments: ["Unacademy", "Postman", "DarwinBox", "Snapdeal", "Delhivery", "Druva", "Capillary Technologies"],
    preferredSectors: ["SaaS", "AI", "FinTech", "EdTech", "HealthTech"],
    preferredStages: ["Seed", "Series A"],
    ticketSizeMin: "₹2 Cr",
    ticketSizeMax: "₹25 Cr",
    portfolioCount: 85,
    aum: "$1.5B+",
    website: "https://nexusvp.com",
    socials: {
      linkedin: "https://linkedin.com/company/nexusvp",
      twitter: "https://twitter.com/NexusVP",
      email: "deals@nexusvp.com"
    },
    isVerified: true,
    teamMembers: [
      {
        id: "itm-1",
        name: "Sandeep Singhal",
        designation: "Co-Founder & Managing Director",
        image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80",
        email: "sandeep@nexusvp.com",
        linkedin_url: "https://linkedin.com/in/sandeepsinghal",
        location: "Mumbai, India",
        bio: "Former VP at Microsoft and serial entrepreneur turned investor. Backed 80+ companies over two decades."
      },
      {
        id: "itm-2",
        name: "Naren Gupta",
        designation: "Co-Founder & Managing Director",
        image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&q=80",
        linkedin_url: "https://linkedin.com/in/narengupta",
        location: "Silicon Valley, USA",
        bio: "Co-founder of Integrated Device Technology (IDT). Brings global perspective to early stage investing."
      }
    ],
    email: "contact@nexusvp.com",
    phone: "+91 22 6730 1900",
    address: "Nariman Point, Mumbai, Maharashtra 400021",
    badges: ["Tier 1 VC", "SEBI Registered", "India + US Focus", "15+ Years Active"],
    openToDeals: true
  },
  {
    id: "inv-002",
    slug: "blume-ventures",
    name: "Blume Ventures",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop&q=80",
    city: "Bengaluru",
    state: "Karnataka",
    type: "VC Fund",
    tagline: "India's most founder-friendly early-stage venture fund.",
    about: "Blume Ventures is one of India's leading early-stage venture capital funds. We are deeply focused on the Indian startup ecosystem and have been investing since 2011. Our portfolio spans fintech, climate, SaaS, and consumer brands. We are known for being deeply founder-centric and providing hands-on support beyond just capital.",
    investmentThesis: "We invest at the Pre-Seed and Seed stage, with follow-on at Series A. Our conviction is in founders building for the next 500 million internet users in India and those tackling global problems from India. We value frugality, speed, and product obsession.",
    notableInvestments: ["Unacademy", "Slice", "Purplle", "Spinny", "Dunzo", "IDfy", "Smallcase"],
    preferredSectors: ["FinTech", "D2C", "SaaS", "ClimateTech", "Consumer Tech"],
    preferredStages: ["Pre-Seed", "Seed", "Series A"],
    ticketSizeMin: "₹50 L",
    ticketSizeMax: "₹10 Cr",
    portfolioCount: 120,
    aum: "$450M+",
    website: "https://blume.vc",
    socials: {
      linkedin: "https://linkedin.com/company/blume-ventures",
      twitter: "https://twitter.com/blume_ventures",
      email: "hello@blume.vc"
    },
    isVerified: true,
    teamMembers: [
      {
        id: "itm-3",
        name: "Karthik Reddy",
        designation: "Co-Founder & Managing Partner",
        image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
        linkedin_url: "https://linkedin.com/in/karthikb351",
        location: "Bengaluru, India",
        bio: "Pioneer of India's early-stage VC ecosystem. Invested in 100+ companies since 2011."
      },
      {
        id: "itm-4",
        name: "Sanjay Nath",
        designation: "Co-Founder & Managing Partner",
        image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80",
        linkedin_url: "https://linkedin.com/in/sanjaynath",
        location: "Bengaluru, India",
        bio: "Former entrepreneur and operator with deep roots in the Indian technology ecosystem."
      }
    ],
    email: "deals@blume.vc",
    phone: "+91 80 4150 3400",
    address: "Indiranagar, Bengaluru, Karnataka 560038",
    badges: ["India's Leading Seed Fund", "SEBI Registered", "120+ Portfolio", "Founder Friendly"],
    openToDeals: true
  },
  {
    id: "inv-003",
    slug: "kunal-shah-angel",
    name: "Kunal Shah",
    logo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=1200&h=400&fit=crop&q=80",
    city: "Mumbai",
    state: "Maharashtra",
    type: "Angel",
    tagline: "Founder of CRED. Angel investor backing Indian internet & consumer businesses.",
    about: "Kunal Shah is one of India's most prominent angel investors and the founder of CRED. Having built and exited FreeCharge (acquired by Snapdeal for $400M), Kunal brings rare operator experience to his investments. He is known for his delta-4 theory of wealth creation and backs founders building products that create irreversible behavioral shifts.",
    investmentThesis: "I back founders who understand human behavior deeply. I look for businesses that create a 'delta-4' shift — where the new experience is so much better that people can never go back. I prefer consumer internet, fintech, and founder networks.",
    notableInvestments: ["BharatPe", "Razorpay", "Groww", "Open", "Khatabook", "INDmoney"],
    preferredSectors: ["FinTech", "Consumer Tech", "SaaS", "D2C"],
    preferredStages: ["Pre-Seed", "Seed"],
    ticketSizeMin: "₹25 L",
    ticketSizeMax: "₹2 Cr",
    portfolioCount: 200,
    website: "https://twitter.com/kunalb11",
    socials: {
      linkedin: "https://linkedin.com/in/kunalshah",
      twitter: "https://twitter.com/kunalb11",
      email: "angels@cred.club"
    },
    isVerified: true,
    teamMembers: [],
    email: "angel@kunalshah.com",
    address: "Mumbai, Maharashtra",
    badges: ["Super Angel", "200+ Investments", "CRED Founder", "FreeCharge Exit"],
    openToDeals: false
  },
  {
    id: "inv-004",
    slug: "sequoia-india-surge",
    name: "Peak XV Partners (Surge)",
    logo: "https://images.unsplash.com/photo-1560472355-536de3962603?w=200&h=200&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?w=1200&h=400&fit=crop&q=80",
    city: "Bengaluru",
    state: "Karnataka",
    type: "VC Fund",
    tagline: "Rapid-scale program for startups from South & Southeast Asia.",
    about: "Peak XV Partners (formerly Sequoia India & Southeast Asia) runs Surge, a rapid-scale program for startups. Surge combines $1–2M in funding, an intensive 16-week program, and a lifetime membership in the Surge network of 500+ founders. We have backed over 50 companies across South and Southeast Asia through Surge.",
    investmentThesis: "Surge is designed for pre-seed and seed stage startups. We back exceptional founders with a clear vision, strong market insight, and the grit to build lasting companies. Our approach combines investment with hands-on company building support.",
    notableInvestments: ["Akasa Air", "Classplus", "Bijak", "Jai Kisan", "Kredmint"],
    preferredSectors: ["SaaS", "AI", "AgriTech", "HealthTech", "FinTech", "EdTech"],
    preferredStages: ["Pre-Seed", "Seed"],
    ticketSizeMin: "₹1 Cr",
    ticketSizeMax: "₹16 Cr",
    portfolioCount: 50,
    aum: "$9B+ (Peak XV total)",
    website: "https://surgeahead.com",
    socials: {
      linkedin: "https://linkedin.com/company/peakxv-partners",
      twitter: "https://twitter.com/surge_ahead",
      email: "surge@peakxv.com"
    },
    isVerified: true,
    teamMembers: [
      {
        id: "itm-5",
        name: "Rajan Anandan",
        designation: "Managing Director - Surge",
        image_url: "https://images.unsplash.com/photo-1537368910025-7028a909ddf4?w=150&h=150&fit=crop&q=80",
        linkedin_url: "https://linkedin.com/in/rajan-anandan",
        location: "Bengaluru, India",
        bio: "Former Google India MD. One of India's most influential tech investors and startup advocates."
      }
    ],
    email: "apply@surgeahead.com",
    phone: "+91 80 4190 3000",
    address: "Embassy Golf Links, Bengaluru, Karnataka 560071",
    badges: ["Tier 1 VC", "16-Week Program", "SEBI Registered", "Global Network"],
    openToDeals: true
  },
  {
    id: "inv-005",
    slug: "ah-ventures",
    name: "AHVentures",
    logo: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=1200&h=400&fit=crop&q=80",
    city: "Ahmedabad",
    state: "Gujarat",
    type: "Micro-VC",
    tagline: "Micro-VC empowering India's next wave of impact-driven entrepreneurs.",
    about: "AHVentures is a sector-agnostic early-stage micro-VC fund based in Ahmedabad. We focus on finding and funding exceptional entrepreneurs from Tier-2 and Tier-3 cities who are often overlooked by mainstream VCs. Our portfolio spans agritech, rural fintech, healthcare, and vernacular content.",
    investmentThesis: "We believe that the next great Indian companies will be built not just in Mumbai and Bangalore, but across the heartland. We invest in founders who have deep local insight and are solving problems for Bharat — the 600 million Indians outside the top 20 cities.",
    notableInvestments: ["KhetiBadi", "RuPay Credit (partner)", "GramCover", "Vernacular AI Co."],
    preferredSectors: ["AgriTech", "FinTech", "HealthTech", "Consumer Tech", "EdTech"],
    preferredStages: ["Pre-Seed", "Seed"],
    ticketSizeMin: "₹25 L",
    ticketSizeMax: "₹3 Cr",
    portfolioCount: 30,
    aum: "₹150 Cr",
    website: "https://ahventures.in",
    socials: {
      linkedin: "https://linkedin.com/company/ahventures",
      twitter: "https://twitter.com/AHVentures",
      email: "hello@ahventures.in"
    },
    isVerified: false,
    teamMembers: [
      {
        id: "itm-6",
        name: "Abhijit Bhatt",
        designation: "Founder & Managing Partner",
        image_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&q=80",
        email: "abhijit@ahventures.in",
        linkedin_url: "https://linkedin.com/in/abhijitbhatt",
        location: "Ahmedabad, India",
        bio: "Serial entrepreneur who sold his last startup and pivoted to investing in the next generation of Bharat-focused founders."
      }
    ],
    email: "deals@ahventures.in",
    phone: "+91 79 4000 1234",
    address: "GIFT City, Gandhinagar, Gujarat 382355",
    badges: ["Bharat Focus", "Tier-2/3 Cities", "Micro-VC", "SEBI Registered"],
    openToDeals: true
  },
  {
    id: "inv-006",
    slug: "100x-vc",
    name: "100X.VC",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=1200&h=400&fit=crop&q=80",
    city: "Mumbai",
    state: "Maharashtra",
    type: "Micro-VC",
    tagline: "India's first VC fund to invest using iSAFE notes, enabling rapid, standardized deal closures.",
    about: "100X.VC is a Mumbai-based micro-VC fund investing in early-stage Indian startups using India SAFE (iSAFE) notes. This allows for quick, founder-friendly term sheets. We run a cohort-based model, selecting 25-30 startups per cohort and providing intensive mentoring and investor connections. We are sector-agnostic and invest across India.",
    investmentThesis: "We invest ₹25 Lakhs per company via iSAFE notes, enabling a fast and clean transaction. We look for strong founders, a validated problem, and early signs of product-market fit. Our cohort model means you get peer learning from co-invested startups.",
    notableInvestments: ["Cashflo", "Evenflow", "SocialPilot", "LegalPay", "Finvolv"],
    preferredSectors: ["SaaS", "FinTech", "D2C", "HealthTech", "Consumer Tech", "AI"],
    preferredStages: ["Pre-Seed", "Seed"],
    ticketSizeMin: "₹25 L",
    ticketSizeMax: "₹25 L",
    portfolioCount: 200,
    aum: "₹500 Cr",
    website: "https://100x.vc",
    socials: {
      linkedin: "https://linkedin.com/company/100x-vc",
      twitter: "https://twitter.com/100xVC",
      email: "apply@100x.vc"
    },
    isVerified: true,
    teamMembers: [
      {
        id: "itm-7",
        name: "Sanjay Mehta",
        designation: "Founder & Chief Investment Officer",
        image_url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&q=80",
        linkedin_url: "https://linkedin.com/in/sanjaymehta",
        location: "Mumbai, India",
        bio: "One of India's most active angel investors with 400+ investments. Pioneer of the iSAFE note model in India."
      },
      {
        id: "itm-8",
        name: "Ninad Karpe",
        designation: "Partner",
        image_url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&h=150&fit=crop&q=80",
        linkedin_url: "https://linkedin.com/in/ninadkarpe",
        location: "Mumbai, India",
        bio: "Ex-CEO of Aptech and Franke Faber. Brings deep operating experience across consumer and enterprise."
      }
    ],
    email: "hello@100x.vc",
    phone: "+91 22 4890 1000",
    address: "Bandra Kurla Complex, Mumbai, Maharashtra 400051",
    badges: ["iSAFE Notes", "Cohort Model", "200+ Portfolio", "Sector Agnostic"],
    openToDeals: true
  },
  {
    id: "inv-007",
    slug: "india-quotient",
    name: "India Quotient",
    logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200&h=200&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=1200&h=400&fit=crop&q=80",
    city: "Mumbai",
    state: "Maharashtra",
    type: "VC Fund",
    tagline: "Investing in the intersection of technology and India's massive cultural diversity.",
    about: "India Quotient is an early-stage VC fund that invests in startups solving uniquely Indian problems. We believe India's next internet companies will be built on the back of cultural nuances, language diversity, and the specific social fabric of the subcontinent. We back founders who 'get' India — not just metrics, but the mindset.",
    investmentThesis: "We look for startups that have a strong vernacular angle, regional depth, or are leveraging cultural insights to build differentiated products. We love businesses that serve the 'real India' — beyond metros, in every language, catering to every income group.",
    notableInvestments: ["ShareChat", "Rooter", "Progcap", "Trell (Sell.do)", "Kissht"],
    preferredSectors: ["Consumer Tech", "FinTech", "Social Commerce", "EdTech", "HealthTech"],
    preferredStages: ["Seed", "Series A"],
    ticketSizeMin: "₹1 Cr",
    ticketSizeMax: "₹15 Cr",
    portfolioCount: 45,
    aum: "$100M+",
    website: "https://indiaquotient.in",
    socials: {
      linkedin: "https://linkedin.com/company/india-quotient",
      twitter: "https://twitter.com/IndiaqVC",
      email: "contact@indiaquotient.in"
    },
    isVerified: true,
    teamMembers: [
      {
        id: "itm-9",
        name: "Madhukar Sinha",
        designation: "Co-Founder & Partner",
        image_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&q=80",
        linkedin_url: "https://linkedin.com/in/madhukarsinha",
        location: "Mumbai, India",
        bio: "Former journalist turned venture capitalist. Deep passion for vernacular internet and India's cultural economy."
      }
    ],
    email: "pitch@indiaquotient.in",
    address: "Worli, Mumbai, Maharashtra 400030",
    badges: ["India-First", "Cultural Investing", "SEBI Registered", "Vernacular Focus"],
    openToDeals: true
  },
  {
    id: "inv-008",
    slug: "stellaris-venture-partners",
    name: "Stellaris Venture Partners",
    logo: "https://images.unsplash.com/photo-1614030424754-24d0eebd46ad?w=200&h=200&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1541844053589-346841d0b34c?w=1200&h=400&fit=crop&q=80",
    city: "Bengaluru",
    state: "Karnataka",
    type: "VC Fund",
    tagline: "Seed to Series A fund for technology companies with global ambition.",
    about: "Stellaris Venture Partners is an early-stage venture capital firm investing in technology startups in India. Founded by former Helion Venture partners, Stellaris brings decades of Indian venture investing experience. We focus on enterprise software, SaaS, and consumer internet companies with proven product-market fit and a clear path to global scale.",
    investmentThesis: "We invest in companies at Seed and Series A where the founders have exceptional domain expertise, a defensible technology moat, and the ambition to build a global company from India. We have a strong preference for B2B and SaaS businesses with recurring revenue models.",
    notableInvestments: ["Mamaearth", "mFine", "Recko", "Pixxel", "Loadshare"],
    preferredSectors: ["SaaS", "AI", "HealthTech", "DeepTech", "Consumer Tech", "FinTech"],
    preferredStages: ["Seed", "Series A"],
    ticketSizeMin: "₹2 Cr",
    ticketSizeMax: "₹20 Cr",
    portfolioCount: 35,
    aum: "$225M+",
    website: "https://stellarisvp.com",
    socials: {
      linkedin: "https://linkedin.com/company/stellarisvp",
      twitter: "https://twitter.com/StellariVP",
      email: "hello@stellarisvp.com"
    },
    isVerified: true,
    teamMembers: [
      {
        id: "itm-10",
        name: "Alok Goyal",
        designation: "Partner",
        image_url: "https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?w=150&h=150&fit=crop&q=80",
        linkedin_url: "https://linkedin.com/in/alokgoyalvc",
        location: "Bengaluru, India",
        bio: "25 years of experience in building and investing in technology companies. Former partner at Helion Ventures."
      },
      {
        id: "itm-11",
        name: "Rahul Chowdhri",
        designation: "Partner",
        image_url: "https://images.unsplash.com/photo-1538991383142-36c4edeaffde?w=150&h=150&fit=crop&q=80",
        linkedin_url: "https://linkedin.com/in/rahulchowdhri",
        location: "Bengaluru, India",
        bio: "Former partner at Helion and Draper Fisher Jurvetson. Invests at the intersection of enterprise and deep tech."
      }
    ],
    email: "pitch@stellarisvp.com",
    phone: "+91 80 4030 2000",
    address: "Koramangala, Bengaluru, Karnataka 560034",
    badges: ["Enterprise Focus", "Global Scale", "SEBI Registered", "Helion Alumni"],
    openToDeals: true
  }
];
