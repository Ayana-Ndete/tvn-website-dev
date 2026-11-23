import saritImage from "./assets/images/projects/sarit-belong-site.png"
import dticImage from "./assets/images/projects/AMIMS-SP-1.png"
import ticketImage from "./assets/images/projects/website_background_2.png"
import zfdaImage from "./assets/images/projects/ZFDA-SP-1.png"
import biasharaLinkImage from "./assets/images/projects/biasharalink-logo.png"
import dealHouseImage from "./assets/images/projects/dealhouse-logo.png"
import spsImage from "./assets/images/projects/CMIS-SP-1.png"
import smsTeleImage from "./assets/images/projects/smstele-logo.svg"
import kncciImage from "./assets/images/projects/KNCCI-SP-1.png"
import ndamisImage from "./assets/images/projects/UNDA-SP-1.png"
import abremaImage from "./assets/images/projects/ABREMA-SP-1.png"
import eacImage from "./assets/images/projects/EAC-SP-1.png"
import saritAdminDashboard from "./assets/images/projects/portfolio/sarit-admin-dashboard.png"
import saritCustomerHomeOne from "./assets/images/projects/portfolio/sarit-customer-home-1.png"
import saritCustomerHomeTwo from "./assets/images/projects/portfolio/sarit-customer-home-2.png"
import dticDashboard from "./assets/images/projects/portfolio/dtic-dashboard.png"
import ticketingDashboard from "./assets/images/projects/portfolio/ticketing-dashboard.png"
import zfdaDashboard from "./assets/images/projects/portfolio/zfda-dashboard.png"

export type ProjectGroup =
  | "Kenya / Nairobi"
  | "South Africa"
  | "Tanzania / Zanzibar"
  | "Uganda"
  | "Burundi"
  | "DRC"
  | "East Africa / Regional"
  | "Location not specified"

export type Project = {
  id: string
  title: string
  client?: string
  place?: string
  year?: string
  status?: "Live" | "In delivery"
  category?: string
  tags?: string[]
  description?: string
  overview?: string
  role?: string
  scope?: string[]
  outputs?: string[]
  integrations?: string[]
  statistics?: { value: string; label: string }[]
  image?: string
  imageAlt?: string
  screenshots?: { src: string; label: string }[]
  group: ProjectGroup
  featured?: boolean
}

// This is the single public portfolio inventory used by the homepage and /projects.
// Fields are intentionally omitted where the published source does not confirm them.
export const projects: Project[] = [
  {
    id: "sarit-belong", title: "Sarit Belong Loyalty Management System", client: "Sarit Centre", place: "Nairobi, Kenya", year: "2026", status: "Live", category: "Customer engagement", tags: ["Customer engagement", "Payments & integrations", "Digital commerce"], image: saritAdminDashboard, imageAlt: "Sarit Belong administrator dashboard", screenshots: [{ src: saritAdminDashboard, label: "Operations dashboard" }, { src: saritCustomerHomeOne, label: "Customer app — home" }, { src: saritCustomerHomeTwo, label: "Customer app — wallet" }], group: "Kenya / Nairobi", featured: true,
    description: "A mall-wide loyalty and e-purse platform connecting shoppers, merchants and partners. Earn points at any store, spend them anywhere, and pay with M-Pesa.",
    overview: "Sarit Belong brings the Sarit Centre loyalty programme into one digital experience. Shoppers use the app to earn and spend points, hold value in an e-purse, redeem vouchers and pay for parking. Merchant, partner and centre teams each have dedicated tools for promotions, campaigns and programme performance.",
    role: "Technical leadership, solution architecture and delivery across the apps, back office and integrations.", scope: ["Customer loyalty, e-purse, vouchers and parking journeys", "Merchant, partner and centre administration tools", "Campaign, promotion and programme-performance workflows", "Secure payments, identity and enterprise-system integrations"], outputs: ["Customer-facing Sarit Belong experience", "Operations and merchant administration dashboard", "Integrated loyalty, voucher and e-purse capabilities", "Reporting-ready programme data"], integrations: ["M-Pesa payments", "NetSuite ERP", "Infobip OTP and SMS", "Power BI reporting", "Keycloak single sign-on"], statistics: [{ value: "[N]", label: "registered members" }, { value: "[N]", label: "participating outlets" }, { value: "[N]", label: "transactions" }],
  },
  {
    id: "dtic-ntb", title: "DTIC Export Barrier Reporting & Resolution (NTB) Platform", client: "the dtic, South Africa", place: "South Africa, with TradeMark Africa", year: "2026", status: "Live", category: "Trade facilitation", tags: ["Trade facilitation", "Public-sector systems", "AI & data intelligence"], image: dticDashboard, imageAlt: "DTIC export barrier reporting dashboard", group: "South Africa", featured: true,
    description: "A national platform where exporters report trade barriers by web, mobile, SMS or WhatsApp in four languages. AI routes each case to the right agency and tracks it through to resolution.",
    overview: "The platform gives South African exporters a simple way to report non-tariff barriers and follow each case through resolution. Configurable service levels, referrals to regional mechanisms, AI classification and routing, and intelligence on recurring issues give responsible agencies one accountable workflow.",
    role: "Technical leadership, architecture, development, deployment, stakeholder validation, national training and change management.", scope: ["Exporter reporting across web, mobile, SMS and WhatsApp", "Multilingual intake, classification, assignment and referral workflows", "Configurable service-level tracking and accountable case resolution", "Trade intelligence for recurring barriers and agency performance"], outputs: ["National non-tariff-barrier reporting and resolution platform", "Four-channel, four-language reporting experience", "Agency case-management workspace", "Decision-support intelligence and regional referral links"], integrations: ["WhatsApp Business API", "SMS and email", "WTO ePing", "ITC Market Access Map"], statistics: [{ value: "4", label: "reporting channels" }, { value: "4", label: "languages" }, { value: "[N]", label: "cases handled" }],
  },
  {
    id: "technovation-ticketing", title: "Ticketing System", client: "Technovation product", category: "Customer support", tags: ["Ticket prioritisation & tracking", "Customised bulk SMS updates"], image: ticketingDashboard, imageAlt: "Ticketing System dashboard", group: "Kenya / Nairobi", featured: true,
    description: "Customer support, organised from the first request to resolution.", overview: "A system for organising customer support from the first request through to resolution.", role: "Keeps support requests visible and customers informed.",
  },
  {
    id: "zfda-irmis", title: "ZFDA Integrated Regulatory Management Information System (IRMIS)", client: "Zanzibar Food and Drugs Agency", place: "Zanzibar, Tanzania", year: "2024–2027", status: "Live", category: "Regulatory technology", tags: ["Regulatory technology", "Public-sector systems", "Government payments"], image: zfdaDashboard, imageAlt: "ZFDA Integrated Regulatory Management Information System dashboard", group: "Tanzania / Zanzibar", featured: true,
    description: "A rebuilt national regulatory system for foods, drugs, cosmetics and medical devices, with public and internal portals and government payments.",
    overview: "Technovation replaced ZFDA's end-of-life platform with a modern, secure regulatory system without disrupting live services. Businesses apply and pay through a public portal while staff process applications in a separate internal workspace, with phased delivery beginning with the client portal.",
    role: "Project leadership, architecture, full re-platforming, analytics and ongoing product ownership.", scope: ["Re-platforming of end-of-life regulatory services", "Public applications and payments for regulated businesses", "Internal processing workspace for ZFDA teams", "Phased migration, analytics and live-service continuity"], outputs: ["Modern public regulatory portal", "Secure internal case-processing workspace", "Digitised applications and payment workflows", "Analytics foundation for regulatory operations"], statistics: [{ value: "99.5%", label: "system availability" }, { value: "40%", label: "faster application processing" }, { value: "0", label: "service disruption during migration" }],
  },
  {
    id: "chanuka", title: "Chanuka Micro-Lending Platform", client: "[Microfinance client]", place: "Kenya", year: "2026", status: "In delivery", category: "Micro-lending", group: "Kenya / Nairobi", featured: true,
    description: "A complete micro-lending platform for a financial institution.",
  },
  { id: "tradeconnect", title: "TradeConnect", year: "2026", category: "Trade facilitation", image: spsImage, imageAlt: "TradeConnect platform", group: "East Africa / Regional", description: "A digital trade and business platform bringing together information, opportunities and business interactions.", overview: "TradeConnect is designed to give users a digital environment for discovering relevant information and opportunities and managing business interactions." },
  { id: "biasharalink", title: "BiasharaLink", year: "2025", category: "Digital commerce", image: biasharaLinkImage, imageAlt: "BiasharaLink platform", group: "Kenya / Nairobi", description: "A digital inquiry and business-matchmaking platform that helps connect commercial enquiries with relevant business opportunities.", overview: "BiasharaLink provides a digital route for submitting business inquiries and connecting them with relevant opportunities. Depending on configuration, it may support inquiry capture through web forms, QR codes or links, and structured routing or scoring." },
  { id: "dealhouse", title: "DealHouse", year: "2025", category: "Digital commerce", image: dealHouseImage, imageAlt: "DealHouse platform", group: "Kenya / Nairobi", description: "A digital deal-management environment designed to support the organisation and progression of business transactions.", overview: "DealHouse supports structured deal workflows and the information used to move transactions forward. Depending on the deployed scope, functions may include deal rooms, templates, document handling, billing and links to logistics, warehousing or financing workflows." },
  { id: "eac-sps", title: "EAC Sanitary & Phytosanitary (SPS) Platform", place: "East African Community", year: "2024", category: "Trade facilitation", image: spsImage, imageAlt: "EAC SPS platform", group: "East Africa / Regional", featured: true, description: "A regional hub to access and verify permits and e-phyto certificates, connected to TradeMark Africa's blockchain-based TLIP pipeline.", overview: "The platform brings sanitary and phytosanitary information, permit verification and cross-border agricultural-trade requirements into one regional service for traders and authorities.", role: "Platform design and delivery for regional SPS information, verification and connected trade workflows.", scope: ["Regional access to SPS requirements and permit information", "Verification of permits and electronic phytosanitary certificates", "Cross-border trader and authority workflows", "Connection to TradeMark Africa's TLIP pipeline"], outputs: ["Regional SPS information and verification hub", "Permit and e-phyto certificate verification capability", "Connected cross-border trade workflow", "Shared digital service for EAC stakeholders"] },
  { id: "mobile-money-drc", title: "Mobile Money & USSD Integrations, DRC", group: "DRC" },
  { id: "sms-tele", title: "SMS Tele Message Delivery Platform", place: "Nairobi, Kenya", category: "Digital communication", image: smsTeleImage, imageAlt: "SMS Tele Message Delivery Platform", group: "Kenya / Nairobi", description: "SMS Tele is a messaging platform that helps organisations send, manage and track messages to customers and users." },
  { id: "kncci", title: "KNCCI Digital Platforms", place: "Kenya", year: "2021", category: "Business services", image: kncciImage, imageAlt: "KNCCI digital platform", group: "Kenya / Nairobi" },
  { id: "ppb", title: "Pharmacy and Poisons Board: Trade Affairs & e-Single Window", place: "Kenya", year: "2021", category: "Trade-related regulatory processes", group: "Kenya / Nairobi" },
  { id: "ndamis", title: "NDAMIS, Uganda", place: "Uganda", year: "2020", category: "Regulatory technology", image: ndamisImage, imageAlt: "NDAMIS interface", group: "Uganda", description: "A digital information management system supporting the National Drug Authority’s regulatory and service workflows in Uganda.", overview: "NDAMIS supports the digitisation of regulatory processes and information handled by Uganda’s National Drug Authority. The platform is intended to make relevant services and application processes more accessible and support the management of regulatory information." },
  { id: "eac-mrh", title: "EAC Medicines Regulatory Harmonisation IMS", year: "2019", category: "Regional information systems", image: dticImage, imageAlt: "EAC medicines regulatory harmonisation system", group: "East Africa / Regional", description: "A regional information management system supporting medicines-registration harmonisation across the East African Community.", overview: "The system supports information management associated with regional efforts to harmonise medicines registration." },
  { id: "burundi-abrema", title: "Burundi ABREMA IMS", place: "Burundi", category: "Medicine regulation", image: abremaImage, imageAlt: "Burundi ABREMA IMS", group: "Burundi" },
  { id: "eac-ipmis", title: "EAC Pharmaceutical Market Information System (IPMIS)", year: "2017", category: "Regional information systems", image: eacImage, imageAlt: "EAC pharmaceutical market information system", group: "East Africa / Regional", description: "A regional pharmaceutical market information system designed to improve access to information and market analytics across the East African Community.", overview: "IPMIS was developed to support a more informed view of the pharmaceutical market across the EAC region." },
]

export const featuredProjects = projects.filter((project) => project.featured)
export const moreProjects = projects.filter((project) => !project.featured)
export const projectGroups: ProjectGroup[] = ["Kenya / Nairobi", "South Africa", "Tanzania / Zanzibar", "Uganda", "Burundi", "DRC", "East Africa / Regional", "Location not specified"]
