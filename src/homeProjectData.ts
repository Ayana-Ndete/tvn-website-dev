import { work } from "./projectCatalog"

import image_biasharalink from "./assets/images/projects/biasharalink-logo.png"

import image_dealhouse from "./assets/images/projects/dealhouse-logo.png"

import image_kncci from "./assets/images/projects/KNCCI-SP-1.png"

import image_nda from "./assets/images/projects/UNDA-SP-1.png"

import image_ipmis from "./assets/images/projects/EAC-SP-1.png"

import image_abrema from "./assets/images/projects/ABREMA-SP-1.png"

import cmisImage from "./assets/images/projects/CMIS-SP-1.png"

export interface HomeProject {
  id: string
  name: string
  description: string
  overview: string
  features: string[]
  value?: string
  year?: string
  category?: string
  images: { src: string alt: string }[]
}

export const homeProjects: HomeProject[] = [
  {
    ...work.find((p) => p.id === "tradeconnect")!,
    id: "tradeconnect",
    name: "TradeConnect",
    description:
      "A digital trade and business platform bringing together information, opportunities and business interactions in one place.",
    year: "2026",
    category: "Trade facilitation | Business platforms",
    images: [],
  },

  {
    ...work.find((p) => p.id === "biasharalink")!,
    id: "biasharalink",
    name: "BiasharaLink",
    description:
      "A business-matchmaking platform that captures trade inquiries and uses an AI decision engine to validate, score and route them.",
    year: "2025",
    category: "Digital commerce | AI & data",
    images: [{ src: image_biasharalink, alt: "BiasharaLink logo" }],
  },

  {
    ...work.find((p) => p.id === "dealhouse")!,
    id: "dealhouse",
    name: "DealHouse",
    description:
      "Takes B2B trade deals from first inquiry to settlement, with deal rooms, contract templates and escrow-backed payments.",
    year: "2025",
    category: "Business platforms | Fintech",
    images: [{ src: image_dealhouse, alt: "DealHouse logo" }],
  },

  {
    ...work.find((p) => p.id === "sps")!,
    id: "sps",
    name: "EAC Sanitary & Phytosanitary (SPS) Platform",
    description:
      "A regional hub to access and verify permits and e-phyto certificates, connected to TradeMark Africa's blockchain-based TLIP pipeline.",
    year: "2024",
    category: "Trade facilitation | Digital trust",
    images: [],
  },

  {
    id: "drc-payments",
    name: "Mobile Money & USSD Integrations, DRC",
    description:
      "USSD and mobile-money integrations on Vodacom DRC's network, so customers can pay and be paid from any phone.",
    category: "Fintech | Payments",
    overview:
      "USSD and mobile-money integrations on Vodacom DRC\u2019s network let customers pay and receive payments from any phone. The work connects telco channels and payment workflows, supporting access without requiring a smartphone.",
    features: [
      "USSD access from any phone",
      "Mobile-money payment integrations",
      "Payment and receipt workflows on Vodacom DRC",
    ],
    images: [],
  },

  {
    id: "ujumbe",
    name: "Ujumbe Message Delivery Platform",
    description:
      "A messaging platform that helps organisations send, manage and track messages to customers and users.",
    year: "2022",
    category: "Digital communications",
    overview:
      "Ujumbe gives organisations a platform to send, manage and track messages to customers and users. It brings message delivery and communication management into one place, helping teams follow delivery activity and manage customer communications.",
    features: [
      "Message sending and management",
      "Delivery tracking",
      "Customer and user communications",
    ],
    images: [],
  },

  {
    ...work.find((p) => p.id === "kncci")!,
    id: "kncci",
    name: "KNCCI Digital Platforms",
    description:
      "A marketplace for chamber members, plus a membership system integrated with Sage ERP and KoboToolbox field data collection.",
    year: "2021",
    category: "Digital commerce | Business platforms",
    images: [
      { src: image_kncci, alt: "KNCCI Digital Platforms interface" },
      { src: cmisImage, alt: "Chamber management interface" },
    ],
  },

  {
    id: "ppb",
    name: "Pharmacy and Poisons Board: Trade Affairs & e-Single Window",
    description:
      "Digital initiatives supporting trade-related regulatory processes for Kenya's Pharmacy and Poisons Board.",
    year: "2021",
    category: "Regulatory technology | Trade facilitation",
    overview:
      "Digital initiatives supporting trade-related regulatory processes for Kenya\u2019s Pharmacy and Poisons Board. The work supports trade affairs and e-Single Window processes, connecting regulatory services with the digital processes used in trade.",
    features: [
      "Trade-related regulatory workflows",
      "Trade affairs services",
      "e-Single Window processes",
    ],
    images: [],
  },

  {
    ...work.find((p) => p.id === "nda")!,
    id: "nda",
    name: "NDAMIS, Uganda",
    description:
      "A management information system for Uganda's National Drug Authority, integrated with Microsoft Dynamics and supported under a multi-year SLA.",
    year: "2020",
    category: "Regulatory technology | Public sector",
    images: [{ src: image_nda, alt: "NDAMIS, Uganda interface" }],
  },

  {
    ...work.find((p) => p.id === "eac-harmonisation")!,
    id: "eac-harmonisation",
    name: "EAC Medicines Regulatory Harmonisation IMS",
    description:
      "A regional platform connected to six national medicines regulators for joint drug registration and GMP inspections.",
    year: "2019",
    category: "Regional systems | Health technology",
    images: [],
  },

  {
    id: "abrema",
    name: "Burundi ABREMA IMS",
    description:
      "A regulatory information system for Burundi's medicines and food regulator, connected to the EAC harmonisation platform.",
    category: "Regulatory technology | Health technology",
    overview:
      "A regulatory information management system for Burundi\u2019s medicines and food regulator, connected to the EAC medicines regulatory harmonisation platform. It supports structured regulatory records, organisational workflows and information management for the agency.",
    features: [
      "Regulatory information management",
      "Organisational workflows",
      "Connection to the EAC harmonisation platform",
    ],
    images: [{ src: image_abrema, alt: "Burundi ABREMA IMS interface" }],
  },

  {
    ...work.find((p) => p.id === "ipmis")!,
    id: "ipmis",
    name: "EAC Pharmaceutical Market Information System (IPMIS)",
    description:
      "A regional pharmaceutical market information system improving access to market information and analytics across the EAC.",
    year: "2017",
    category: "Regional systems | Health technology",
    images: [
      {
        src: image_ipmis,
        alt: "EAC Pharmaceutical Market Information System (IPMIS) interface",
      },
    ],
  },
]
