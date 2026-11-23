import { defineComponent } from "vue"
import { NuxtLink } from "#components"
import { ServiceIcon } from "./ServiceIcon"
import logoImage from "./assets/images/brand/technovation-logo.png"

type Service = { icon: "code" | "consult" | "transform" | "integration" | "data" | "security"; title: string; desc: string; links: string[] }

const workflow = [
  ["Your data", "Documents + regulations", "▤"],
  ["Rules", "Compliance checks", "✓"],
  ["AI agents", "Retrieve · reason · act", "✦"],
  ["Human review", "Approve exceptions", "◉"],
  ["Your systems", "RIMS · ERP · M-Pesa · eTIMS", "↗"],
]
const useCases = [
  ["Case triage", "Classify, prioritise and route cases automatically.", "↗"],
  ["Application screening", "Check applications for completeness before staff review.", "✓"],
  ["24/7 assistants", "Answer from your own policies and documents, with citations.", "◌"],
  ["Document intelligence", "Turn documents and inquiries into structured data.", "▤"],
]
const trustPoints = ["Kenya Data Protection Act aligned", "On-premise or private-cloud deployment", "Human-in-the-loop by default", "Full audit trail"]

export const ServiceStack = defineComponent((props: { services: Service[] }) => () => {
  const [aiService, ...standardServices] = props.services
  if (!aiService) return null
  return <div class="services-experience">
    <section id="ai" class="ai-service-hero" aria-labelledby="agentic-title">
      <div class="ai-topline"><p class="ai-overline">01 / 05 · New capability</p><span class="ai-proof">Already in production <b>→</b> AI classification and routing on South Africa&apos;s national NTB platform.</span></div>
      <h3 id="agentic-title" class="font-display">AI &amp; Agentic Systems</h3><strong class="ai-service-promise">AI that works inside your existing systems.</strong><p class="ai-service-copy">Automate document review, case triage, customer support and reporting — with your rules, your data and human oversight.</p>
      <div class="ai-workflow" aria-label="AI workflow">
        {workflow.map(([title, text, icon], index) => <div class={`ai-flow-step ai-flow-${index + 1}`} key={title}><span class="ai-flow-icon">{index === 2 ? <img src={logoImage} alt="" /> : icon}</span><small>{title}</small><strong>{text}</strong>{index < workflow.length - 1 && <i class="ai-flow-arrow" aria-hidden="true">→</i>}</div>)}
      </div>
    </section>

    <section class="ai-applied-section" aria-labelledby="ai-use-cases-title">
      <div class="ai-applied-heading"><div><p class="ai-overline">Applied AI &amp; automation</p><h3 id="ai-use-cases-title" class="font-display">Where AI pays off first</h3></div><p>High-leverage enterprise automation workflows designed to streamline operations, cut cycle times, and unlock immediate ROI.</p></div>
      <div class="ai-use-case-grid">{useCases.map(([title, text, icon]) => <article key={title}><span>{icon}</span><h4 class="font-display">{title}</h4><p>{text}</p></article>)}</div>
      <div class="ai-trust">{trustPoints.map((point) => <span key={point}>{point}</span>)}</div>
      <aside class="ai-pilot"><div><h3 class="font-display">The 2-week AI pilot</h3><p>One workflow, your real data, a working prototype and a clear go/no-go report.</p></div><NuxtLink to="/contact" class="ai-pilot-link">Scope your pilot <span aria-hidden="true">→</span></NuxtLink></aside>
      <div class="ai-capabilities-heading"><div><p class="ai-overline">Capabilities matrix</p><h3 class="font-display">Core Digital Infrastructure &amp; Services</h3></div><span>Modules 02 · 05</span></div>
      <div class="service-card-grid">{standardServices.map(({ icon, title, desc }, index) => <article class="service-card" key={title} aria-labelledby={`service-title-${index + 1}`}><span class="service-card-index">0{index + 2} / 05</span><span class="service-icon"><ServiceIcon kind={icon} /></span><h3 id={`service-title-${index + 1}`} class="font-display">{title}</h3><p>{desc}</p><NuxtLink to="/contact">Discuss this service <span aria-hidden="true">→</span></NuxtLink></article>)}</div>
    </section>
  </div>
}, { name: "ServiceStack", props: ["services"] })
