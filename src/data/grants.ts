export interface Grant {
  id: number;
  title: string;
  organization: string;
  amount: string;
  deadline: string;
  tags: string[];
  description: string;
  eligibility: string[];
  fieldOfExpertise: string[];
  applyUrl: string;
  matchScore?: number; // Optional simulated score
}

export const GRANTS_DATA: Grant[] = [
  {
    id: 1,
    title: "Startup India Seed Fund Scheme",
    organization: "DPIIT, Govt. of India",
    amount: "Up to ₹50 Lakhs",
    deadline: "Rolling Deadline",
    tags: ["Seed Funding", "Grant", "Hardware", "Govt"],
    description: "Financial assistance to startups for proof of concept, prototype development, product trials, market entry, and commercialization. It aims to support early-stage startups that have a strong potential for growth but are struggling to find angel investors or VC funding.",
    eligibility: [
      "Must be recognized by DPIIT.",
      "Incorporated not more than 2 years ago.",
      "Must have a business idea to develop a product or service with market fit.",
      "Indian promoters must hold at least 51% shareholding."
    ],
    fieldOfExpertise: ["Hardware", "Enterprise SaaS", "Healthcare", "DeepTech"],
    applyUrl: "https://seedfund.startupindia.gov.in/",
    matchScore: 92
  },
  {
    id: 2,
    title: "NIDHI PRAYAS",
    organization: "Department of Science and Technology",
    amount: "Up to ₹10 Lakhs",
    deadline: "Dec 31, 2026",
    tags: ["Grant", "Incubator", "Science"],
    description: "NIDHI Promoting and Accelerating Young and Aspiring technology entrepreneurs (PRAYAS) is focused on addressing the funding gap for very early prototype development. It provides grant support to innovators to convert their ideas into working prototypes.",
    eligibility: [
      "Must be individual innovators or very early-stage startups.",
      "The idea should be a technology-based hardware product innovation.",
      "Applicant must be an Indian citizen."
    ],
    fieldOfExpertise: ["Robotics", "IoT", "CleanTech", "BioTech"],
    applyUrl: "https://www.nidhi-prayas.org/",
    matchScore: 78
  },
  {
    id: 3,
    title: "AWS Activate Founders",
    organization: "Amazon Web Services",
    amount: "$1,000 to $100,000 in credits",
    deadline: "Rolling Deadline",
    tags: ["Accelerator", "SaaS", "Grant"],
    description: "AWS Activate provides startups with a host of benefits, including AWS credits, technical support and training, to help grow your business. Ideal for highly scalable digital startups looking to offload infrastructure costs.",
    eligibility: [
      "Must be a self-funded or bootstrapped startup.",
      "Cannot have received institutional funding.",
      "Active AWS account is required.",
      "Startups up to 10 years old are eligible."
    ],
    fieldOfExpertise: ["Cloud Computing", "SaaS", "AI/ML", "Mobile Apps"],
    applyUrl: "https://aws.amazon.com/activate/founders/",
    matchScore: 95
  },
  {
    id: 4,
    title: "Google for Startups Accelerator",
    organization: "Google",
    amount: "Mentorship + Cloud Credits",
    deadline: "Mar 15, 2026",
    tags: ["Accelerator", "Incubator", "Scale-up"],
    description: "A three-month accelerator program for seed to investment-ready startups building innovative products with AI/ML. The program brings the best of Google's programs, products, people, and technology to startup founders.",
    eligibility: [
      "Startup must be based in India.",
      "Must be leveraging AI/ML technologies in their core product.",
      "Preferably at Seed to Series A stage."
    ],
    fieldOfExpertise: ["Artificial Intelligence", "Machine Learning", "Data Analytics"],
    applyUrl: "https://startup.google.com/accelerator/",
    matchScore: 84
  },
  {
    id: 5,
    title: "Women Entrepreneurship Program",
    organization: "NITI Aayog",
    amount: "Variable",
    deadline: "Rolling Deadline",
    tags: ["Seed Funding", "Incubator"],
    description: "A platform designed to support women entrepreneurs with funding access, compliance assistance, and incubation support. WEP brings together diverse stakeholders to facilitate resource sharing and collaborative growth.",
    eligibility: [
      "Must be a woman entrepreneur.",
      "Business must have at least 51% ownership by women.",
      "Open to both product and service-based startups."
    ],
    fieldOfExpertise: ["E-commerce", "D2C Brands", "EdTech", "FinTech"],
    applyUrl: "https://wep.gov.in/",
    matchScore: 65
  },
  {
    id: 6,
    title: "MeitY TIDE 2.0 Challenge",
    organization: "Ministry of Electronics & IT",
    amount: "Up to ₹40 Lakhs",
    deadline: "Jun 30, 2026",
    tags: ["Contest", "Grant", "Hardware"],
    description: "Technology Incubation and Development of Entrepreneurs (TIDE 2.0) empowers startups leveraging growing ICT technologies to address societal challenges in identified thematic areas.",
    eligibility: [
      "Startup must be primarily working in ICT for societal domains.",
      "Ideation to prototype stage startups are preferred.",
      "Must be endorsed by a recognized incubation center."
    ],
    fieldOfExpertise: ["Healthcare IT", "AgriTech", "Smart Cities", "EdTech"],
    applyUrl: "https://meity.gov.in/tide2.0",
    matchScore: 88
  }
];
