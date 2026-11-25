import Navbar from "./Navbar"
import "./about-glass.css"
import logoImage from "./assets/images/brand/technovation-logo.png"
import { defineComponent, shallowRef } from "vue"
import { useClientEffect } from "./useClientEffect"

const strengths = [
  ["Built for government scale", "High-availability deployments in government data centres, disaster recovery, and 99.5% availability."],
  ["Integration depth", "M-Pesa, KCB, Vodacom USSD, ZanMalipo, KRA eTIMS, NetSuite, Dynamics, Sage, and more."],
  ["Responsible AI", "Rules-before-AI guardrails, explainable decisions, full audit trails and human review of exceptions."],
  ["Data protection by design", "Built for Kenya's Data Protection Act, on-premise or private cloud where data must stay in-country."],
]

export default defineComponent(() => {
  const scrolled = shallowRef(false)
  const page = shallowRef<HTMLDivElement | null>(null)
  useClientEffect(() => {
    document.title = "About Us — Technovation Ventures"
    const update = () => { scrolled.value = window.scrollY > 32 }
    update(); window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, () => [])
  useClientEffect(() => {
    const targets = page.value?.querySelectorAll<HTMLElement>(".about-reveal")
    if (!targets?.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target) }
    }), { threshold: .18 })
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, () => [])
  return () => <div ref={page} class="about-page about-reference-page">
    <Navbar tone="dark" scrolled={scrolled.value} activeSection="about" />
    <main class="about-reference">
      <section class="about-reference-hero" aria-labelledby="about-title">
        <div class="about-reference-wrap">
          <div class="about-reference-mark">
            <img src={logoImage} width="116" height="116" alt="Technovation Ventures" />
          </div>
          <div class="about-reference-copy about-reveal">
            <p>About Technovation</p>
            <h1 id="about-title">Digital systems Africa's institutions rely on</h1>
            <p class="about-reference-lede">Technovation Ventures is a Nairobi software engineering and ICT consulting company. Our systems process medicines registrations for national regulators, verify trade documents across EAC borders, route export complaints for South Africa's trade ministry, and run loyalty and payments for one of Nairobi's leading malls.</p>
          </div>
        </div>
      </section>
      <section class="about-reference-strengths" aria-label="What we are built for">
        <div class="about-reference-wrap about-reference-strength-grid">
          {strengths.map(([title, description], index) => <article class="about-reveal" style={{ "--reveal-delay": `${index * 90}ms` }} key={title}>
            <span>0{index + 1}</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </article>)}
        </div>
      </section>
    </main>
  </div>
}, { name: "AboutPage" })
