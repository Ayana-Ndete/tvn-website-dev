import Navbar from "./Navbar"
import { useClientEffect } from "./useClientEffect"
import { defineComponent, shallowRef, computed } from "vue"
import { HeroArtwork } from "./HeroArtwork"
import { TypewriterHeading } from "./TypewriterHeading"
import { usePageMotion } from "./usePageMotion"
import { ScrollText } from "./ScrollText"
import { NuxtLink } from "#components"
import { featuredProjects } from "./projectData"
import logoImage from "./assets/images/brand/technovation-logo.png"
import eacPartnerImage from "./assets/images/partners/eac.jpg"
import gizPartnerImage from "./assets/images/partners/giz.svg"
import unidoPartnerImage from "./assets/images/partners/unido.svg"
import kncciPartnerImage from "./assets/images/partners/kncci.png"
import abremaPartnerImage from "./assets/images/partners/abrema.png"
import zfdaPartnerImage from "./assets/images/partners/zfda.jpg"
// ─── SVG primitives ───────────────────────────────────────────────────────────
const LogoMark = ({ size = 40 }: { size?: number }) => (
  <img
    src={logoImage}
    width={size}
    height={size}
    alt=""
    aria-hidden="true"
    class="shrink-0 object-contain bg-white rounded-sm"
  />
)
const ArrowRight = ({ size = 15 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <line
      x1="2"
      y1="8"
      x2="13"
      y2="8"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />
    <polyline
      points="9 4 13 8 9 12"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
)
// ─── Data ─────────────────────────────────────────────────────────────────────
const partners = [
  { abbr: "EAC", name: "East African Community", image: eacPartnerImage },
  { abbr: "GIZ", name: "Deutsche Gesellschaft", image: gizPartnerImage },
  { abbr: "UNIDO", name: "UN Industrial Development", image: unidoPartnerImage },
  { abbr: "KNCCI", name: "Kenya National Chamber", image: kncciPartnerImage },
  { abbr: "ABREMA", name: "Autorité Burundaise", image: abremaPartnerImage },
  { abbr: "ZFDA", name: "Zanzibar Food & Drug Agency", image: zfdaPartnerImage },
]
const workflowPhases = [
  { title: "Discover", rail: "Map the process, data, constraints and users.", description: "We shadow operators, audit legacy data flows, and surface technical constraints before writing production code.", outputs: ["Process & Data Audit", "Constraint Mapping", "Architecture Spec"] },
  { title: "Prototype", rail: "Prove value fast on real data.", description: "We prove value with working slices connected to real operational data, validating usability and performance early.", outputs: ["Interactive Vertical Slice", "Live Data Validation", "Operator Sign-off"] },
  { title: "Build", rail: "Engineer, integrate and quality-assure.", description: "We engineer resilient services, fault-tolerant integrations and automated quality gates built for institutional scale.", outputs: ["Core Platform Build", "API & ERP Integrations", "Automated QA Suite"] },
  { title: "Deploy", rail: "Phased go-live, training and change management.", description: "We plan phased rollouts with hands-on operator training, practical runbooks and structured change management.", outputs: ["Production Rollout", "Team Enablement", "Operational Runbooks"] },
  { title: "Operate", rail: "SLA-based support and continuous improvement.", description: "We provide long-term reliability through clear SLAs, continuous telemetry monitoring and iterative capability expansion.", outputs: ["99.9% Uptime SLA", "24/7 Telemetry Alerts", "Continuous Iteration"] },
]
// The home page is a preview, not a second portfolio page. Keep the newest
// work visible here and let the dedicated sections carry the full story.
// Each digit has its own vertical reel; the final number remains accessible.
function AnimatedStat({ value }: { value: string }) {
  return (
    <span class="stat-number" aria-label={value}>
      <span aria-hidden="true" class="stat-reels">
        {value.split("").map((digit, index) =>
          /[0-9]/.test(digit) ? (
            <span class="stat-digit" key={index}>
              <span
                class="stat-reel"
                data-digit={digit}
                style={{
                  transform: `translateY(-${(10 + Number(digit)) * 5}%)`,
                }}
              >
                {Array.from({ length: 20 }, (_, n) => (
                  <span key={n}>{n % 10}</span>
                ))}
              </span>
            </span>
          ) : (
            <span key={index}>{digit}</span>
          ),
        )}
      </span>
    </span>
  )
}

export default defineComponent(
  (props) => {
    const heroPaused = shallowRef(false)
    const rootRef = shallowRef<HTMLDivElement | null>(null)
    const workProjectIndex = shallowRef(0)
    const workProjects = featuredProjects.filter((project) => project.image).slice(0, 3)
    const workStackPaused = shallowRef(false)
    const workflowPhase = shallowRef(0)
    const activeWorkflowPhase = computed(() => workflowPhases[workflowPhase.value] ?? workflowPhases[0]!)
    usePageMotion(rootRef)
    useClientEffect(
      () => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        const rotation = window.setInterval(() => {
          workflowPhase.value = (workflowPhase.value + 1) % workflowPhases.length
        }, 4200)
        return () => window.clearInterval(rotation)
      },
      () => [],
    )
    useClientEffect(
      () => {
        if (workProjects.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        const rotation = window.setInterval(() => {
          if (!workStackPaused.value)
            workProjectIndex.value = (workProjectIndex.value + 1) % workProjects.length
        }, 3000)
        return () => window.clearInterval(rotation)
      },
      () => [],
    )
    useClientEffect(
      () => {
        const root = rootRef.value
        if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
          return
        const targets = Array.from(
          root.querySelectorAll<HTMLElement>("[data-cinematic-reveal]"),
        )
        if (!("IntersectionObserver" in window)) {
          targets.forEach((target) => target.classList.add("is-visible"))
          return
        }
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return
              entry.target.classList.add("is-visible")
              observer.unobserve(entry.target)
            })
          },
          { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
        )
        root.classList.add("cinematic-motion-ready")
        targets.forEach((target) => observer.observe(target))
        return () => {
          observer.disconnect()
          root.classList.remove("cinematic-motion-ready")
        }
      },
      () => [],
    )
    const scrolled = shallowRef(false)
    const activeSection = shallowRef("hero")
    const progressRef = shallowRef<HTMLDivElement | null>(null)
    const lightNavigation = computed(() => activeSection.value === "about" || activeSection.value === "work")
    useClientEffect(
      () => {
        let frame = 0
        const update = () => {
          const top = window.scrollY
          scrolled.value = top > 32
          const hero = document.getElementById("hero")
          if (hero && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            const progress = Math.max(
              0,
              Math.min(1, -hero.getBoundingClientRect().top / Math.max(1, hero.offsetHeight)),
            )
            hero.style.setProperty("--hero-scroll-progress", String(progress))
            hero.style.setProperty("--hero-copy-lift", `${progress * -28}px`)
            hero.style.setProperty("--hero-cube-scale", String(1 - progress * 0.12))
          }
          const total =
            document.documentElement.scrollHeight - window.innerHeight
          if (progressRef.value)
            progressRef.value.style.transform = `scaleX(${total > 0 ? top / total : 0})`
          const workflow = document.querySelector<HTMLElement>(".workflow-scroll-shell")
          if (workflow) {
            const distance = Math.max(1, workflow.offsetHeight - window.innerHeight)
            const progress = Math.max(0, Math.min(1, -workflow.getBoundingClientRect().top / distance))
            const clamp = (n: number) => Math.max(0, Math.min(1, n))
            workflow.style.setProperty("--intro-opacity", String(1 - clamp((progress - 0.06) / 0.12)))
            workflow.style.setProperty("--process-opacity", String(clamp((progress - 0.12) / 0.1)))
            workflow.style.setProperty("--process-progress", String(clamp((progress - 0.22) / 0.78)))
            const processProgress = clamp((progress - 0.22) / 0.78)
            const activeStep = Math.min(4, Math.floor(processProgress * 5))
            workflow.querySelectorAll<HTMLElement>(".workflow-process-panel .work-steps li").forEach((step, index) => {
              step.classList.toggle("is-active", index === activeStep)
              step.classList.toggle("is-past", index < activeStep)
              if (index === activeStep) step.setAttribute("aria-current", "step")
              else step.removeAttribute("aria-current")
            })
          }
          const sections = [
            "hero",
            "partners",
            "services",
            "work",
            "about",
            "how-we-work",
            "contact",
          ]
          activeSection.value =
            sections
              .filter(
                (id) =>
                  (document.getElementById(id)?.getBoundingClientRect().top ??
                    Infinity) <= 150,
              )
              .pop() ?? "hero"
          const story = document.querySelector<HTMLElement>(".workflow-scroll-shell")
          if (story && story.getBoundingClientRect().bottom > 0 && story.getBoundingClientRect().top < window.innerHeight) {
            const p = Number(getComputedStyle(story).getPropertyValue("--process-progress"))
            activeSection.value = p > 0 ? "how-we-work" : "about"
          }
          frame = 0
        }
        const schedule = () => {
          if (!frame) frame = requestAnimationFrame(update)
        }
        update()
        window.addEventListener("scroll", schedule, { passive: true })
        window.addEventListener("resize", schedule)
        return () => {
          cancelAnimationFrame(frame)
          window.removeEventListener("scroll", schedule)
          window.removeEventListener("resize", schedule)
        }
      },
      () => [],
    )
    const scrollTo = (id: string) => {
      document
        .getElementById(id)
        ?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        })
    }
    return () => (
      <div
        ref={rootRef}
        class="homepage-shell bg-white text-[#0B1F3A] font-body overflow-x-clip"
      >
        <div ref={progressRef} class="scroll-progress" aria-hidden="true" />
        {/* ── Sticky Nav ───────────────────────────────────────────────────────── */}
        <Navbar
          tone={lightNavigation.value ? "light" : "dark"}
          scrolled={scrolled.value}
          activeSection={activeSection.value}
          homeIcons
        />

        {/* ── Hero ─────────────────────────────────────────────────────────────── */}
        <section id="hero" class="hero-scene">
          <div class="hero-wash" aria-hidden="true" />
          <HeroArtwork paused={heroPaused.value} />
          <div class="hero-centre">
                        <TypewriterHeading paused={heroPaused.value} />
            <p class="hero-intro hero-description">
              Secure software, regulatory systems and applied AI for governments, regional bodies and growing businesses across Africa.
            </p>
            <div class="hero-intro hero-actions">
              <NuxtLink to="/projects" class="hero-button hero-primary">
                See our work <ArrowRight />
              </NuxtLink>
              <NuxtLink to="/contact" class="hero-button hero-secondary">
                Book a consultation <ArrowRight />
              </NuxtLink>
            </div>
          </div>
          <button
            class="hero-scroll-cue"
            onClick={() => scrollTo("partners")}
            aria-label="Scroll to trusted organisations"
          >
            <span />
            Explore
          </button>

        </section>

        {/* ── Trusted Partners ─────────────────────────────────────────────────── */}
        <section id="partners" class="home-partners-strip" aria-label="Trusted by">
          <div class="partners-grid-trace" aria-hidden="true" />
          <div data-cinematic-reveal class="homepage-partners max-w-[1240px] mx-auto px-6">
            <div class="partner-window">
              <div class="partner-track">
                {[0, 1].map((copy) => (
                  <div
                    class="partner-group"
                    aria-hidden={copy === 1 ? true : undefined}
                    key={copy}
                  >
                    {partners.map(({ abbr, name, image }) => (
                      <div key={abbr} class="partner-card">
                        <div class="partner-logo-wrap">
                          <img
                            class="partner-logo"
                            src={image}
                            alt={`${abbr} logo`}
                            width="150"
                            height="76"
                            loading="lazy"
                          />
                        </div>
                        <span class="partner-abbr font-display">{abbr}</span>
                        <span class="partner-name">{name}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Services gateway ─────────────────────────────────────────────────── */}
        <section id="services" class="home-services-gateway" aria-labelledby="services-gateway-title">
          <div class="services-ambient-halo" aria-hidden="true" />
          <div class="services-scan-beam" aria-hidden="true" />
          <div class="services-geo-accent" aria-hidden="true">
            <div class="services-geo-ring" />
            <div class="services-geo-crosshair font-mono">+</div>
          </div>
          <div data-cinematic-reveal class="homepage-services max-w-[1240px] mx-auto px-6">
            <div class="services-text-block">
              <div class="services-kicker-bar">
                <span class="services-kicker-dot" aria-hidden="true" />
                <span class="services-index-badge font-mono">[ 02 / SERVICES ]</span>
              </div>
              <h2 id="services-gateway-title" class="font-display">
                Technology built around <span class="highlight-cyan">real operational problems.</span>
              </h2>
              <p class="services-lead">
                Systems, integrations, and applied AI engineered to make complex work dependable.
              </p>
              <NuxtLink to="/services" class="services-cinematic-action group">
                <span class="action-frame-corner action-corner-tl" aria-hidden="true" />
                <span class="action-frame-corner action-corner-br" aria-hidden="true" />
                <span class="action-text">Explore our services</span>
                <span class="action-icon" aria-hidden="true">
                  <ArrowRight />
                </span>
              </NuxtLink>
            </div>
            <div class="services-orbit" aria-label="Our core service capabilities">
              <div class="services-orbit-dashed" aria-hidden="true" />
              <div class="services-orbit-band" aria-hidden="true" />
              <div class="services-orbit-ring" aria-hidden="true" />
              <div class="services-orbit-axis services-orbit-axis-x" aria-hidden="true" />
              <div class="services-orbit-axis services-orbit-axis-y" aria-hidden="true" />
              <div class="services-orbit-satellite" aria-hidden="true" />
              <div class="services-orbit-satellite services-orbit-satellite-two" aria-hidden="true" />
              <div class="services-orbit-hub"><span class="font-mono">Core stack</span><strong>Dependable</strong></div>
              <span class="services-orbit-tag services-orbit-tag-ai"><i aria-hidden="true" /><span><b>Applied AI</b><small class="font-mono">Workflows</small></span></span>
              <span class="services-orbit-tag services-orbit-tag-systems"><i aria-hidden="true" /><span><b>Systems</b><small class="font-mono">Architecture</small></span></span>
              <span class="services-orbit-tag services-orbit-tag-integrations"><i aria-hidden="true" /><span><b>Integrations</b><small class="font-mono">Real-time APIs</small></span></span>
            </div>
          </div>
        </section>

        {/* ── Work gateway — the full portfolio lives on its own page ─────────── */}
        <section id="work" class="home-work-gateway" aria-labelledby="work-gateway-title">
          <div class="work-transition-sky" aria-hidden="true" />
          <div class="work-blueprint-grid" aria-hidden="true" />
          <div data-cinematic-reveal class="home-work-gateway-grid max-w-[1240px] mx-auto px-6">
            <div class="work-title-wrap">
              <div class="work-tag-row">
                <span class="work-tag-pill font-mono">03 // FIELD PLATFORMS</span>
                <p class="services-kicker">Selected delivery</p>
              </div>
              <h2 id="work-gateway-title" class="font-display">
                Work that holds up<br /><span class="work-bold-highlight">in the real world.</span>
              </h2>
              <p class="work-copy">Platforms and public systems connecting institutions across the region.</p>
              <NuxtLink to="/projects" class="home-work-link group">
                <span>View our work</span>
                <span class="work-link-arrow"><ArrowRight /></span>
              </NuxtLink>
            </div>
            <div class="work-project-stack" aria-label="Featured projects" onMouseenter={() => { workStackPaused.value = true }} onMouseleave={() => { workStackPaused.value = false }}>
              {workProjects.map((project, projectIndex) => {
                // The front card moves to the back; middle and back advance one place.
                const position = (projectIndex - workProjectIndex.value + workProjects.length) % workProjects.length
                return (
                  <NuxtLink key={project.title} to="/projects" class={`work-project-card work-project-card-${position}`} aria-label={`View ${project.title} in our work`}>
                    <span class="work-project-browserbar" aria-hidden="true"><i /><i /><i /><em class="font-mono">{project.client?.toLowerCase().replaceAll(" ", "-") ?? "technovation.app"}</em></span>
                    <img src={project.image} alt="" />
                    <span class="work-project-card-overlay" aria-hidden="true" />
                    <span class="work-project-card-copy"><small class="font-mono">{project.category ?? "Featured project"}</small><strong class="font-display">{project.title}</strong><em>{project.client ?? project.place ?? "Technovation project"}</em></span>
                  </NuxtLink>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Delivery journey ─────────────────────────────────────────────── */}
        <section id="about" class="workflow-scroll-shell">
          <div class="workflow-sticky workflow-story">
            <section id="how-we-work" class="workflow-process-panel" aria-label="How we work">
              <div class="process-cosmic-glow" aria-hidden="true" />
              <div class="process-grid-lines" aria-hidden="true" />
              <div data-cinematic-reveal class="workflow-process-inner max-w-[1240px] mx-auto px-6">
                <div class="services-heading">
                  <div>
                    <div class="flex items-center gap-2.5 mb-4">
                      <span class="w-7 h-px bg-[#1B63E8]" />
                      <span class="services-kicker">How we work</span>
                    </div>
                    <h2 class="font-display services-title">
                      From idea{" "}
                      <span class="delivery-highlight" aria-label="to dependable delivery.">
                        <span aria-hidden="true">to</span>{" "}
                        <span aria-hidden="true">dependable</span>{" "}
                        <span aria-hidden="true">delivery.</span>
                      </span>
                    </h2>
                  </div>
                </div>
                <div class="workflow-timeline">
                  <div class="workflow-rail" role="group" aria-label="Delivery phases">
                    {workflowPhases.map((phase, index) => (
                      <button type="button" key={phase.title}
                        class={index === workflowPhase.value ? "workflow-rail-item is-active" : "workflow-rail-item"}
                        aria-pressed={index === workflowPhase.value}
                        onClick={() => (workflowPhase.value = index)}>
                        <span class="workflow-rail-number font-mono">{String(index + 1).padStart(2, "0")}</span>
                        <span><strong>{phase.title}</strong><small>{phase.rail}</small></span>
                      </button>
                    ))}
                  </div>
                  <article class="workflow-stage" key={workflowPhase.value} aria-live="polite">
                    <div class="workflow-stage-top">
                      <span class="workflow-stage-badge font-mono">Phase {String(workflowPhase.value + 1).padStart(2, "0")} // {activeWorkflowPhase.value.title}</span>
                      <span class="workflow-stage-count font-mono">Step {workflowPhase.value + 1} of 5</span>
                    </div>
                    <div class="workflow-stage-copy">
                      <h3 class="font-display">{activeWorkflowPhase.value.title}</h3>
                      <p>{activeWorkflowPhase.value.description}</p>
                    </div>
                    <div class="workflow-outputs">
                      {activeWorkflowPhase.value.outputs.map((output, index) => (
                        <div key={output}><small class="font-mono">Output {String(index + 1).padStart(2, "0")}</small><strong>{output}</strong></div>
                      ))}
                    </div>
                    <div class="workflow-stage-footer">
                      <div class="workflow-progress" aria-hidden="true"><i style={{ width: `${(workflowPhase.value + 1) * 20}%` }} /></div>
                      <button type="button" onClick={() => (workflowPhase.value = (workflowPhase.value + 1) % workflowPhases.length)}>Next phase <span aria-hidden="true">→</span></button>
                    </div>
                  </article>
                </div>
              </div>
            </section>
          </div>
        </section>

        {props.showCodeCentreOnHome && (
          <section
            class="engineering-preview"
            aria-labelledby="code-centre-title"
          >
            <div class="engineering-ambient-rays" aria-hidden="true" />
            <div class="engineering-blueprint-grid" aria-hidden="true" />
            <div class="engineering-preview-inner">
              <div data-cinematic-reveal class="engineering-copy">
                <div class="engineering-badge-row">
                  <span class="engineering-log-tag font-mono">&gt;_ OPEN ENGINEERING</span>
                  <p class="engineering-eyebrow">
                    <span /> From our engineering team
                  </p>
                </div>
                <h2 id="code-centre-title" class="font-display">
                  Built here.
                  <br />
                  <span>Shared here.</span>
                </h2>
                <p class="engineering-description">
                  Explore our Code Centre for Java code, DevOps field notes, and
                  practical solutions to the errors we encounter along the way.
                </p>
                <NuxtLink to="/code-centre" class="engineering-link group">
                  <span>Explore the Code Centre</span>
                  <span class="engineering-link-circle">
                    <ArrowRight />
                  </span>
                </NuxtLink>
              </div>
              <div data-cinematic-reveal class="engineering-notebook">
                <div class="engineering-notebook-heading">
                  <span class="engineering-notebook-dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span class="engineering-notebook-title font-mono">THE ENGINEERING NOTEBOOK</span>
                  <span class="engineering-live-signal font-mono" aria-hidden="true">● LIVE ↗</span>
                </div>
                <div class="engineering-entries-container">
                  <NuxtLink to="/code-centre#java-queue-empty" class="engineering-entry">
                    <span class="engineering-entry-icon" aria-hidden="true">
                      {"{ }"}
                    </span>
                    <span class="engineering-entry-copy">
                      <span class="engineering-entry-topic font-mono">
                        Java · Error &amp; solution
                      </span>
                      <h3>Handling an empty queue</h3>
                      <span class="engineering-entry-summary">
                        A small edge case. A useful lesson.
                      </span>
                    </span>
                    <span class="engineering-entry-arrow">
                      <ArrowRight />
                    </span>
                  </NuxtLink>
                  <NuxtLink
                    to="/code-centre#devops-container-logs"
                    class="engineering-entry engineering-entry-teal"
                  >
                    <span class="engineering-entry-icon" aria-hidden="true">
                      {" >_"}
                    </span>
                    <span class="engineering-entry-copy">
                      <span class="engineering-entry-topic font-mono">
                        DevOps · Error &amp; solution
                      </span>
                      <h3>Diagnosing a stopped container</h3>
                      <span class="engineering-entry-summary">
                        Follow the logs. Find the cause.
                      </span>
                    </span>
                    <span class="engineering-entry-arrow">
                      <ArrowRight />
                    </span>
                  </NuxtLink>
                </div>
                <div class="engineering-notebook-footer">
                  <span aria-hidden="true">&lt;/&gt;</span> Practical notes from
                  everyday engineering.
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── CTA + Footer — unified dark canvas ───────────────────────────────── */}
        <div class="home-unified-conclusion">
          {/* CTA band */}
          <div class="home-final-cta max-w-[1240px] mx-auto px-6">
            <div class="cta-radial-spotlight" aria-hidden="true" />
            <div class="cta-grid-lines" aria-hidden="true" />
            <div class="cta-inner-layout flex flex-col md:flex-row md:items-center md:justify-between gap-10">
              <div data-cinematic-reveal class="md:max-w-[560px]">
                <div class="cta-mission-tag font-mono">INITIATE // CONSULTATION</div>
                <h2 class="font-display text-[36px] md:text-[46px] lg:text-[54px] font-bold tracking-[-0.035em] leading-[1.04] mb-5">
                  <span class="block text-white">Ready to start</span>
                  <span class="block text-[#1B63E8]">a project?</span>
                </h2>
                <p class="text-[#d9e9ff] text-[15.5px] md:text-[16.5px] leading-[1.8]">Tell us about the process technology or AI could transform. We will respond within one business day with a free initial assessment.</p>
              </div>
              <NuxtLink
                data-cinematic-reveal
                to="/contact"
                class="cta-button flex-shrink-0 self-start md:self-auto inline-flex items-center gap-3.5 px-10 py-5 bg-[#1B63E8] hover:bg-[#3E7DFB] text-white font-semibold text-[15px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_42px_rgba(27,99,232,0.55)] border border-white/20 rounded-[6px]"
              >
                Let’s talk <ArrowRight size={16} />
              </NuxtLink>
            </div>
          </div>

          {/* Footer */}
          <div id="contact" class="home-footer max-w-[1240px] mx-auto px-6">
            <div class="footer-grid-layout">
              {/* Brand */}
              <div data-cinematic-reveal class="footer-brand-column">
                <div class="flex items-center gap-3.5 mb-5">
                  <LogoMark />
                  <span class="font-display font-semibold text-[17px] text-white tracking-[-0.025em]">
                    Technovation Ventures
                  </span>
                </div>
                <p class="text-[#849db5] text-[13.5px] leading-[1.8] mb-6 max-w-[310px]">
                  Software, regulatory systems and applied AI for Africa’s
                  institutions and businesses.
                </p>
                <span class="footer-registry-tag font-mono text-[11px] text-[#55718d]">
                  Registered in Kenya · Est. 2013
                </span>
              </div>

              {/* Company links */}
              <div data-cinematic-reveal class="footer-nav-column">
                <h4 class="font-display font-semibold text-[11.5px] text-[#7ea9ff] mb-5 tracking-[0.16em] uppercase">
                  Company
                </h4>
                <ul class="space-y-3.5">
                  {[
                    "About Us",
                    "Services",
                    "Our Work",
                    "Code Centre",
                    "Careers",
                    "Contact",
                  ].map((item) => (
                    <li key={item}>
                      {item === "Careers" ? (
                        <span class="footer-link inline-block text-[#849db5] text-[13.5px] hover:text-white transition-all duration-200 hover:translate-x-1 cursor-default">
                          {item}
                        </span>
                      ) : (
                        <NuxtLink
                          external={item !== "Code Centre" && item !== "About Us"}
                          to={
                            item === "Code Centre"
                              ? "/code-centre"
                              : item === "Services"
                                ? "/services"
                              : `/#${({ "About Us": "about", Services: "services", "Our Work": "work", Contact: "contact" } as Record<string, string>)[item]}`
                          }
                          class="footer-link inline-block text-[#849db5] text-[13.5px] hover:text-white transition-all duration-200 hover:translate-x-1"
                        >
                          {item}
                        </NuxtLink>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact details */}
              <div data-cinematic-reveal class="footer-contact-column">
                <h4 class="font-display font-semibold text-[11.5px] text-[#7ea9ff] mb-5 tracking-[0.16em] uppercase">
                  Contact
                </h4>
                <ul class="space-y-3.5">
                  <li>
                    <a
                      href="mailto:info@technovation.ke"
                      class="footer-link inline-block text-[#849db5] text-[13.5px] hover:text-white transition-all duration-200 hover:translate-x-1 break-all"
                    >
                      info@technovation.ke
                    </a>
                  </li>
                  <li>
                    <a
                      href="tel:+254202392555"
                      class="footer-link inline-block text-[#849db5] text-[13.5px] hover:text-white transition-all duration-200 hover:translate-x-1"
                    >
                      +254 20 239 2555
                    </a>
                  </li>
                  <li>
                    <a
                      href="tel:+254780000189"
                      class="footer-link inline-block text-[#849db5] text-[13.5px] hover:text-white transition-all duration-200 hover:translate-x-1"
                    >
                      +254 780 000 189
                    </a>
                  </li>
                  <li class="pt-1">
                    <address class="not-italic text-[#849db5] text-[13.5px] leading-[1.7]">
                      Allamano Centre (Consolata Shrine), 3rd Floor, Suite 3C
                      <br />
                      Waiyaki Way, Westlands, Nairobi
                    </address>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div class="footer-bottom-row pt-6 border-t border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <span class="text-[#4e6a85] text-[12px]">
                © 2026 Technovation Ventures Ltd. All rights reserved.
              </span>
              <span class="text-[#4e6a85] text-[12px] font-mono">technovation.ke // NAIROBI</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    name: "App",
    props: { showCodeCentreOnHome: { type: Boolean, default: true } },
  },
)
