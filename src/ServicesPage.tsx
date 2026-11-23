import { defineComponent, ref } from "vue"
import { NuxtLink } from "#components"
import Navbar from "./Navbar"
import { services } from "./servicesData"
import { useClientEffect } from "./useClientEffect"
import aiWorkflowImage from "../public/services/analytics-photo.jpg"
import regulatoryImage from "../public/projects/ZFDA-SP-1.png"
import developmentImage from "../public/services/development-photo.jpg"
import paymentsImage from "../public/services/integration-photo.jpg"
import consultingImage from "../public/services/consulting-photo.jpg"

const serviceImages = [
  { src: aiWorkflowImage, alt: "Document review workflow and analytics dashboard", position: "center" },
  { src: regulatoryImage, alt: "Regulatory platform dashboard", position: "center top" },
  { src: developmentImage, alt: "Software development workspace", position: "center" },
  { src: paymentsImage, alt: "Connected payment and systems integration infrastructure", position: "center" },
  { src: consultingImage, alt: "Technology consulting workshop", position: "center 42%" },
] as const

const deliveryStats = [
  ["06", "Regional perspective", "Connected across", "East Africa.", "We create systems that work across institutions, borders and real operating environments."],
  ["10", "Years of delivery", "Built for the", "long run.", "Technology that evolves without leaving its people or purpose behind."],
  ["24", "A shared standard", "Thoughtful by", "design.", "Every detail is made to reduce friction, not add to it."],
] as const

export default defineComponent({
  name: "ServicesPage",
  setup() {
    const scrolled = ref(false)
    const scene = ref<HTMLElement | null>(null)
    useClientEffect(() => {
      document.title = "Services — Technovation Ventures"
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const reveal = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("is-visible") }), { threshold: .16 })
      document.querySelectorAll(".et-rv").forEach((item) => reveal.observe(item))
      let raf = 0
      let smooth = window.scrollY
      const render = () => {
        smooth += (window.scrollY - smooth) * (reduced ? 1 : .05)
        scrolled.value = smooth > 24
        const header = document.querySelector(".site-nav")
        header?.classList.toggle("etale-nav-ink", smooth < (scene.value?.offsetTop ?? 0) + innerHeight * .5)
        const top = scene.value?.offsetTop ?? 0
        document.documentElement.style.setProperty("--et-progress", String(Math.max(0, Math.min(1, (smooth - top + innerHeight) / (innerHeight * 3)))))
        raf = requestAnimationFrame(render)
      }
      raf = requestAnimationFrame(render)
      return () => { cancelAnimationFrame(raf); reveal.disconnect(); document.querySelector(".site-nav")?.classList.remove("etale-nav-ink") }
    }, () => [])
    return () => <div class="services-page etale-services">
      <Navbar scrolled={scrolled.value} activeSection="services" />
      <main>
        <section class="et-hero" aria-labelledby="services-title">
          <div class="et-hero-noise" />
          <div class="et-wrap et-hero-copy et-rv">
            <p class="et-hero-eyebrow">Engineering your next chapter</p>
            <h1 id="services-title" aria-label="Systems that move with intent.">
              <span>Systems that</span>
              <span class="et-typewriter-line" aria-hidden="true">move with intent.</span>
            </h1>
            <p class="et-hero-lede">From your first idea to your next million users, we design, build and scale software that moves your business forward.</p>
            <div class="et-hero-actions">
              <NuxtLink class="et-link et-link-primary" to="/contact">Build with us <b>↗</b></NuxtLink>
              <a class="et-link et-link-secondary" href="#capabilities">Explore our services <b>↓</b></a>
            </div>
          </div>
          <p class="et-hero-mark" aria-hidden="true">TECH<br />NOVATION</p>
        </section>
        <section id="capabilities" ref={scene} class="et-sheet-scene" aria-labelledby="capabilities-title"><div class="et-veil" aria-hidden="true" /><header class="et-sheet-head et-rv"><p class="et-cap">03 / 05 &nbsp;&nbsp; What we build</p><h2 id="capabilities-title">Capability,<br /><em>in layers.</em></h2></header><div class="et-sheets">{services.map((service, index) => <article class={{ "et-sheet": true, "et-sheet-blue": index % 2 === 0 }} key={service.title} style={{ "--n": index }}><div class="et-sheet-art"><img class="et-service-image" src={serviceImages[index]!.src} alt={serviceImages[index]!.alt} style={{ objectPosition: serviceImages[index]!.position }} /><span class="et-service-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><small>Technovation / systems in motion</small></div><div class="et-sheet-copy"><p class="et-cap">0{index + 1} / 05</p><h3>{service.title}</h3><p>{service.desc}</p><div class="et-tags">{service.links.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}</div><NuxtLink to="/contact" class="et-link">Explore capability <b>→</b></NuxtLink></div></article>)}</div></section>
        <section class="et-numbers et-rv" aria-labelledby="delivery-stats-title">
          <div class="et-stats-inner">
            <header class="et-stats-heading">
              <p class="et-cap">REGIONAL DELIVERY / AT A GLANCE</p>
              <h2 id="delivery-stats-title">Experience built to last.</h2>
            </header>
            <div class="et-stats-grid">
              {deliveryStats.map(([number, cap, line, em, copy], statIndex) => (
                <article class="et-stat-card" key={number}>
                  <div class="et-stat-value" aria-label={number}>
                    {number.split("").map((digit, index) => (
                      <span class="et-stat-digit" aria-hidden="true" key={`${number}-${index}`} style={{ "--roll-to": `-${(10 + Number(digit)) * 1.12}em`, transitionDelay: `${statIndex * 130 + index * 80}ms` }}>
                        <span class="et-stat-reel">{Array.from({ length: 20 }, (_, value) => <span key={value}>{value % 10}</span>)}</span>
                      </span>
                    ))}
                  </div>
                  <span class="et-cap">{cap}</span>
                  <h3>{line}<br /><em>{em}</em></h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  },
})
