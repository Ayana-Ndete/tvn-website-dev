import Navbar from "./Navbar"
import HistoryPage from "./HistoryPage"
import { NuxtLink } from "#components"
import { defineComponent, shallowRef } from "vue"
import { useClientEffect } from "./useClientEffect"

const metrics = [["2016", "Established", "Nairobi, Kenya"], ["06", "Regulators connected", "Across one regional system"], ["03", "Reporting channels", "Web, mobile and SMS"], ["10+", "Years in delivery", "From discovery through support"]]

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
  return () => <div ref={page} class="about-page about-story-page">
    <Navbar tone="dark" scrolled={scrolled.value} activeSection="about" />
    <main>
      <section class="about-bridge about-opening" aria-labelledby="about-title"><div><p class="about-system-cap">A connected history</p><h1 id="about-title">Every milestone starts<br />with a <em>real need.</em></h1><p>Follow the systems, teams and institutions that have shaped the way we work.</p><a href="#history">Explore the journey <b>↓</b></a></div></section>
      <section class="about-evidence" aria-labelledby="evidence-title"><div class="about-evidence-wrap"><header class="about-reveal"><p class="about-system-cap">Our footprint / at a glance</p><h2 id="evidence-title">Proof built into<br /><span>the work.</span></h2></header><div class="about-metrics">{metrics.map(([value, label, note], index) => <article class="about-reveal" style={{ "--reveal-delay": `${index * 90}ms` }} key={label}><span class="about-metric-index">0{index + 1}</span><strong>{value}</strong><h3>{label}</h3><p>{note}</p><i aria-hidden="true" /></article>)}</div></div></section>
      <HistoryPage />
    </main>
  </div>
}, { name: "AboutPage" })
