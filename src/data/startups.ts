export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  email?: string;
  linkedin?: string;
  location?: string;
  bio?: string;
  image_url?: string;
}

export interface Startup {
  id: string;
  slug: string;
  name: string;
  logo: string;
  coverImage: string;
  city: string;
  state: string;
  sector: string;
  shortDescription: string;
  about: string;
  problemSolved: string;
  productExplanation: string;
  targetCustomers: string;
  currentStage: string;
  website?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    email?: string;
  };
  hiringStatus: 'Yes' | 'No' | 'Not disclosed';
  openRoles?: string[];
  applyLink?: string;
  teamMembers?: TeamMember[];
  email?: string;
  phone?: string;
  address?: string;
}

export const dummyStartups: Startup[] = [
  {
    id: "s1",
    slug: "fintech-pro",
    name: "FinTech Pro",
    logo: "https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?q=80&w=200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
    city: "Bengaluru",
    state: "Karnataka",
    sector: "FinTech",
    shortDescription: "Revolutionizing peer-to-peer lending for small businesses.",
    about: "FinTech Pro is an innovative financial technology platform that bridges the gap between investors and small businesses in need of capital. By leveraging advanced AI-driven risk assessment models, we provide fast, reliable, and transparent lending solutions.",
    problemSolved: "Small businesses often face significant hurdles when trying to secure loans from traditional banks due to stringent requirements and long processing times. FinTech Pro eliminates these barriers.",
    productExplanation: "Our platform connects borrowers directly with lenders. We offer a seamless digital experience where businesses can apply for loans within minutes and receive funding within 24 hours.",
    targetCustomers: "Small to Medium Enterprises (SMEs) looking for working capital, and retail investors seeking alternative investment opportunities with attractive yields.",
    currentStage: "Series A",
    website: "https://example.com/fintechpro",
    socials: {
      linkedin: "https://linkedin.com/company/fintechpro",
      twitter: "https://twitter.com/fintechpro",
      email: "hello@fintechpro.example.com"
    },
    hiringStatus: "Yes",
    openRoles: ["Senior Frontend Engineer", "Product Manager", "Risk Analyst"],
    applyLink: "https://example.com/fintechpro/careers",
    email: "contact@fintechpro.example.com",
    phone: "+91 98765 43210",
    address: "123 Innovation Drive, Koramangala, Bengaluru, Karnataka 560034",
    teamMembers: [
      {
        id: "tm1",
        name: "Rahul Sharma",
        designation: "Founder & CEO",
        linkedin: "https://linkedin.com/in/rahulsharma",
        email: "rahul@fintechpro.example.com",
        location: "Bengaluru",
        bio: "Former investment banker turned fintech entrepreneur with 10+ years of experience in credit risk.",
        image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
      },
      {
        id: "tm2",
        name: "Priya Patel",
        designation: "CTO",
        linkedin: "https://linkedin.com/in/priyapatel",
        location: "Bengaluru",
        bio: "Tech leader with a passion for scalable architectures. Previously led engineering teams at top tech firms.",
        image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "s2",
    slug: "health-sync",
    name: "HealthSync",
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1600&auto=format&fit=crop",
    city: "Mumbai",
    state: "Maharashtra",
    sector: "HealthTech",
    shortDescription: "AI-powered patient management system for modern clinics.",
    about: "HealthSync is redefining how clinics and hospitals manage patient data, appointments, and medical records. Our holistic cloud-based platform ensures that doctors can focus more on patient care and less on administrative overhead.",
    problemSolved: "Fragmented health records and inefficient scheduling lead to poor patient experiences and doctor burnout.",
    productExplanation: "A unified dashboard that integrates EHR (Electronic Health Records), automated appointment reminders, and billing. The AI assistant predicts patient no-shows and optimizes clinic workflows.",
    targetCustomers: "Private clinics, polyclinics, and mid-sized hospitals.",
    currentStage: "Seed",
    website: "https://example.com/healthsync",
    socials: {
      linkedin: "https://linkedin.com/company/healthsync",
      instagram: "https://instagram.com/healthsync"
    },
    hiringStatus: "No",
    email: "info@healthsync.example.com",
    address: "45 Healthcare Hub, Andheri East, Mumbai, Maharashtra 400069",
    teamMembers: [
      {
        id: "tm3",
        name: "Dr. Ananya Singh",
        designation: "Co-Founder & CMO",
        location: "Mumbai",
        bio: "Practicing physician who recognized the need for better clinic management software.",
        image_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "s3",
    slug: "agri-yield",
    name: "AgriYield",
    logo: "https://images.unsplash.com/photo-1592982537447-6f2a6a0a241e?q=80&w=200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop",
    city: "Pune",
    state: "Maharashtra",
    sector: "AgriTech",
    shortDescription: "IoT sensors for precision agriculture and crop monitoring.",
    about: "AgriYield provides smart farming solutions using IoT sensors and data analytics. We help farmers optimize water usage, monitor soil health, and predict crop diseases before they spread.",
    problemSolved: "Overuse of fertilizers and water, leading to soil degradation and lower crop yields.",
    productExplanation: "Solar-powered IoT sensors placed in fields collect real-time data on soil moisture, temperature, and pH levels. This data is analyzed to provide actionable insights via a mobile app.",
    targetCustomers: "Commercial farmers, agricultural cooperatives, and farm management companies.",
    currentStage: "Pre-Series A",
    website: "https://example.com/agriyield",
    socials: {
      linkedin: "https://linkedin.com/company/agriyield",
      twitter: "https://twitter.com/agriyield"
    },
    hiringStatus: "Yes",
    openRoles: ["IoT Hardware Engineer", "Agronomist", "Sales Executive"],
    applyLink: "https://example.com/agriyield/jobs",
    email: "contact@agriyield.example.com",
    phone: "+91 91234 56789",
    address: "Green Tech Park, Hinjewadi, Pune, Maharashtra 411057",
    teamMembers: [
      {
        id: "tm4",
        name: "Vikram Desai",
        designation: "CEO",
        linkedin: "https://linkedin.com/in/vikramdesai",
        location: "Pune",
        bio: "Agricultural engineer with a vision to modernize farming practices in India.",
        image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "s4",
    slug: "edusphere",
    name: "EduSphere",
    logo: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1600&auto=format&fit=crop",
    city: "Delhi",
    state: "Delhi",
    sector: "EdTech",
    shortDescription: "Personalized learning paths for K-12 students using AI.",
    about: "EduSphere is an interactive learning platform that adapts to each student's unique learning pace and style. We believe education should be personalized, engaging, and accessible to everyone.",
    problemSolved: "A one-size-fits-all approach in traditional education leaves many students behind or unchallenged.",
    productExplanation: "Our AI engine analyzes student performance in real-time, dynamically adjusting the difficulty of questions and suggesting tailored video lessons to bridge knowledge gaps.",
    targetCustomers: "K-12 students, parents, and schools looking for supplementary learning tools.",
    currentStage: "Series B",
    website: "https://example.com/edusphere",
    socials: {
      linkedin: "https://linkedin.com/company/edusphere",
      youtube: "https://youtube.com/c/edusphere"
    },
    hiringStatus: "Not disclosed",
    email: "hello@edusphere.example.com",
    address: "Education Hub, Connaught Place, New Delhi 110001",
    teamMembers: [
      {
        id: "tm5",
        name: "Neha Gupta",
        designation: "Founder",
        location: "Delhi",
        bio: "Ex-educator who pivoted to tech to impact learning at scale.",
        image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "s5",
    slug: "climate-guard",
    name: "ClimateGuard",
    logo: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1600&auto=format&fit=crop",
    city: "Chennai",
    state: "Tamil Nadu",
    sector: "ClimateTech",
    shortDescription: "Carbon tracking and offset solutions for enterprises.",
    about: "ClimateGuard empowers businesses to measure, reduce, and offset their carbon footprint. We are on a mission to accelerate the transition to a net-zero economy through data transparency.",
    problemSolved: "Companies struggle to accurately measure their Scope 1, 2, and 3 emissions and find reliable offset projects.",
    productExplanation: "A B2B SaaS platform that integrates with company ERPs to automate carbon accounting. We also provide a verified marketplace for purchasing high-quality carbon credits.",
    targetCustomers: "Mid to large enterprises committed to ESG goals.",
    currentStage: "Seed",
    website: "https://example.com/climateguard",
    socials: {
      linkedin: "https://linkedin.com/company/climateguard"
    },
    hiringStatus: "Yes",
    openRoles: ["Sustainability Consultant", "Backend Developer"],
    applyLink: "https://example.com/climateguard/careers",
    email: "impact@climateguard.example.com",
    address: "Green Building, Tidel Park, Chennai, Tamil Nadu 600113",
    teamMembers: [
      {
        id: "tm6",
        name: "Arjun Krishnan",
        designation: "Co-Founder",
        location: "Chennai",
        bio: "Environmental scientist and climate activist.",
        image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "s6",
    slug: "d2c-apparel",
    name: "Vastra D2C",
    logo: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1600&auto=format&fit=crop",
    city: "Jaipur",
    state: "Rajasthan",
    sector: "D2C",
    shortDescription: "Sustainable, ethically sourced modern ethnic wear.",
    about: "Vastra D2C brings traditional Indian craftsmanship to modern wardrobes. We work directly with artisans to create sustainable, high-quality clothing while ensuring fair wages.",
    problemSolved: "Fast fashion is harmful to the environment, and traditional artisans are often exploited by middlemen.",
    productExplanation: "An online direct-to-consumer store offering a curated collection of ethnic and fusion wear, emphasizing transparency in the supply chain.",
    targetCustomers: "Conscious consumers looking for sustainable fashion.",
    currentStage: "Bootstrapped",
    website: "https://example.com/vastra",
    socials: {
      instagram: "https://instagram.com/vastrad2c"
    },
    hiringStatus: "No",
    email: "hello@vastra.example.com",
    address: "Artisan Block, Sitapura, Jaipur, Rajasthan 302022",
    teamMembers: []
  },
  {
    id: "s7",
    slug: "nexus-web3",
    name: "Nexus Protocol",
    logo: "https://images.unsplash.com/photo-1622630998477-20b41cd0e0b2?q=80&w=200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1639762681485-074b7f4ec651?q=80&w=1600&auto=format&fit=crop",
    city: "Hyderabad",
    state: "Telangana",
    sector: "Web3",
    shortDescription: "Decentralized identity verification for Web3 applications.",
    about: "Nexus Protocol provides a secure, privacy-preserving layer for identity verification on the blockchain. We enable users to own their data and share it selectively with dApps.",
    problemSolved: "Lack of sybil resistance and privacy in decentralized applications.",
    productExplanation: "An SDK that developers can integrate into their dApps to seamlessly verify user credentials using Zero-Knowledge Proofs.",
    targetCustomers: "Web3 developers, DeFi protocols, and DAO communities.",
    currentStage: "Pre-Seed",
    website: "https://example.com/nexus",
    socials: {
      twitter: "https://twitter.com/nexusprotocol"
    },
    hiringStatus: "Yes",
    openRoles: ["Smart Contract Engineer", "Developer Relations"],
    applyLink: "https://example.com/nexus/jobs",
    email: "build@nexus.example.com",
    address: "Cyber Towers, HITECH City, Hyderabad, Telangana 500081",
    teamMembers: [
      {
        id: "tm7",
        name: "Rishi Verma",
        designation: "Founder & Lead Dev",
        location: "Hyderabad",
        bio: "Early crypto adopter and smart contract auditor.",
        image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "s8",
    slug: "saas-flow",
    name: "FlowSaaS",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop",
    city: "Noida",
    state: "Uttar Pradesh",
    sector: "SaaS",
    shortDescription: "No-code workflow automation for marketing teams.",
    about: "FlowSaaS enables marketing teams to automate repetitive tasks without writing a single line of code. From lead routing to campaign management, we make operations frictionless.",
    problemSolved: "Marketing teams waste hours manually transferring data between different tools and CRMs.",
    productExplanation: "A visual drag-and-drop builder to connect apps and automate workflows, featuring pre-built templates for common marketing use cases.",
    targetCustomers: "Marketing agencies and in-house marketing teams.",
    currentStage: "Series A",
    website: "https://example.com/flowsaas",
    socials: {
      linkedin: "https://linkedin.com/company/flowsaas",
      twitter: "https://twitter.com/flowsaas"
    },
    hiringStatus: "Yes",
    openRoles: ["Marketing Manager", "Full Stack Developer"],
    applyLink: "https://example.com/flowsaas/careers",
    email: "hello@flowsaas.example.com",
    address: "Sector 62, Noida, Uttar Pradesh 201309",
    teamMembers: [
      {
        id: "tm8",
        name: "Sneha Reddy",
        designation: "CPO",
        location: "Noida",
        bio: "Product visionary with a background in marketing automation.",
        image_url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200&auto=format&fit=crop"
      }
    ]
  }
];
