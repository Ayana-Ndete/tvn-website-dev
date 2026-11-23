import HomeProjectDialog from "./HomeProjectDialog"

import { homeProjects, type HomeProject } from "./homeProjectData"

import Navbar from "./Navbar"

import { defineComponent, shallowRef } from "vue"

import { useClientEffect } from "./useClientEffect"

import { usePageMotion } from "./usePageMotion"

import { HeroArtwork } from "./HeroArtwork"

import { TypewriterHeading } from "./TypewriterHeading"

import { NuxtLink } from "#components"

import { useRuntimeConfig } from "#imports"

import homeLayout from "./home-layout.html?raw"

import "./home-layout.css"

const ArrowRight = ({ size = 15 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" />
  </svg>
)

export default defineComponent(
  (props) => {
    const rootRef = shallowRef<HTMLDivElement | null>(null)

    const detail = shallowRef<HomeProject | null>(null)

    const heroPaused = shallowRef(false)

    const scrolled = shallowRef(false)

    const activeSection = shallowRef("hero")

    const progressRef = shallowRef<HTMLDivElement | null>(null)

    const base = useRuntimeConfig().app.baseURL

    const content = homeLayout.replaceAll("__BASE__", base)

    const servicesStart = content.indexOf("<!-- SERVICES -->")

    const aboutStart = content.indexOf("<!-- ABOUT -->")

    const contactStart = content.indexOf("<!-- HOW WE WORK + CONTACT -->")

    const partners = [
      { abbr: "KNCCI", name: "Kenya National Chamber", image: `${base}partners/kncci.png` },
      { abbr: "ABREMA", name: "Autorité Burundaise", image: `${base}partners/abrema.png` },
      { abbr: "ZFDA", name: "Zanzibar Food & Drug Agency", image: `${base}partners/zfda.jpg` },
      { abbr: "EAC", name: "East African Community", image: `${base}partners/eac.jpg` },
      { abbr: "GIZ", name: "Deutsche Gesellschaft", image: `${base}partners/giz.svg` },
      { abbr: "UNIDO", name: "UN Industrial Development", image: `${base}partners/unido.svg` },
    ]

    usePageMotion(rootRef)

    useClientEffect(
      () => {
        const pipeline = rootRef.value?.querySelector<HTMLElement>(".pipe")
        if (!pipeline) return

        const cards = Array.from(pipeline.children) as HTMLElement[]
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
        if (reducedMotion.matches) return

        let active = 0
        let timer = 0
        const showNext = () => {
          cards[active]?.classList.remove("on")
          active = (active + 1) % cards.length
          cards[active]?.classList.add("on")
        }
        const start = () => {
          if (!timer && cards.length > 1) timer = window.setInterval(showNext, 1800)
        }
        const stop = () => {
          window.clearInterval(timer)
          timer = 0
        }

        pipeline.addEventListener("mouseenter", stop)
        pipeline.addEventListener("mouseleave", start)
        pipeline.addEventListener("focusin", stop)
        pipeline.addEventListener("focusout", start)
        start()

        return () => {
          stop()
          pipeline.removeEventListener("mouseenter", stop)
          pipeline.removeEventListener("mouseleave", start)
          pipeline.removeEventListener("focusin", stop)
          pipeline.removeEventListener("focusout", start)
        }
      },
      () => [],
    )

    useClientEffect(
      () => {
        let frame = 0

        const update = () => {
          scrolled.value = window.scrollY > 32

          const total = document.documentElement.scrollHeight - innerHeight

          if (progressRef.value)
            progressRef.value.style.transform = `scaleX(${
              total > 0 ? window.scrollY / total : 0
            })`

          activeSection.value =
            ["hero", "services", "ai", "work", "journey", "about", "how-we-work", "contact"]

              .filter(
                (id) =>
                  (document.getElementById(id)?.getBoundingClientRect().top ??
                    Infinity) <= 150,
              )

              .pop() ?? "hero"

          const story = document.querySelector<HTMLElement>(".workflow-scroll-shell")
          if (story) {
            const distance = Math.max(1, story.offsetHeight - window.innerHeight)
            const progress = Math.max(0, Math.min(1, -story.getBoundingClientRect().top / distance))
            const clamp = (value: number) => Math.max(0, Math.min(1, value))
            story.style.setProperty("--intro-opacity", String(1 - clamp((progress - .06) / .12)))
            story.style.setProperty("--process-opacity", String(clamp((progress - .12) / .1)))
            story.style.setProperty("--process-progress", String(clamp((progress - .22) / .78)))
            if (story.getBoundingClientRect().bottom > 0 && story.getBoundingClientRect().top < window.innerHeight) {
              activeSection.value = progress > .12 ? "how-we-work" : "about"
            }
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

    return () => (
      <div
        ref={rootRef}
        class="font-body overflow-x-clip"
        onClick={(event) => {
          const link = (event.target as Element).closest<HTMLAnchorElement>(
            "a[data-project]",
          )

          if (!link) return

          const project = homeProjects.find(
            (item) => item.id === link.dataset.project,
          )

          if (project) {
            event.preventDefault()
            detail.value = project
          }
        }}
      >
        <HomeProjectDialog
          project={detail.value}
          onDismiss={() => {
            detail.value = null
          }}
        />
        <div ref={progressRef} class="scroll-progress" aria-hidden="true" />
        <Navbar
          tone="dark"
          scrolled={scrolled.value}
          activeSection={activeSection.value}
          homeIcons
          visionLayout
        />
        <main id="top">
          <section id="hero" class="hero-scene home-vision-hero">
            <div class="hero-wash" aria-hidden="true" />
            <HeroArtwork paused={heroPaused.value} />
            <div class="home-hero-grid">
              <div class="hero-centre">
                <TypewriterHeading paused={heroPaused.value} />
                <p class="hero-intro hero-description">
                  Secure software, regulatory systems and applied AI for
                  governments, regional bodies and growing businesses across Africa.
                </p>
                <div class="hero-intro hero-actions">
                  <button onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })} class="hero-button hero-primary">
                    See our work <ArrowRight />
                  </button>
                  <NuxtLink to="/contact" class="hero-button hero-secondary">
                    Book a consultation <ArrowRight />
                  </NuxtLink>
                </div>
              </div>
            </div>
            <a class="hero-scroll-cue" href="#partners">
              <span />
              Explore
            </a>
            <button
              class="hero-motion-toggle"
              onClick={() => (heroPaused.value = !heroPaused.value)}
              aria-pressed={heroPaused.value}
            >
              {heroPaused.value ? "Resume animation" : "Pause animation"}
            </button>
          </section>
          <section id="partners" class="trusted-partners" aria-label="Trusted by">
            <div class="trusted-partners-inner">
              <p>Trusted by leading institutions across East Africa and beyond</p>
              <div class="partner-window">
                <div class="partner-track">
                  {[0, 1].map((copy) => (
                    <div class="partner-group" aria-hidden={copy === 1 ? true : undefined} key={copy}>
                      {partners.map(({ abbr, name, image }) => (
                        <div key={abbr} class="partner-card">
                          <img class="partner-logo" src={image} alt={`${abbr} logo`} width="150" height="76" loading="lazy" />
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
          <div
            class="customer-layout"
            innerHTML={content.slice(servicesStart, aboutStart)}
          />
          <section id="about" class="workflow-scroll-shell" aria-label="About Technovation and how we work">
            <div class="workflow-sticky workflow-story">
              <div class="workflow-about-panel">
                <div class="about-home workflow-about">
                  <div class="workflow-about-copy">
                    <p class="services-kicker">About Technovation</p>
                    <h2 class="font-display">Technology that helps institutions move with confidence.</h2>
                    <p>We design, build and run secure software for governments, regional bodies and growing businesses across East, Central and Southern Africa.</p>
                  </div>
                  <div class="about-stats">
                    {[["2016", "Established", "Technovation Ventures was established in Nairobi."], ["6", "National regulators", "Connected through the EAC medicines harmonisation system."], ["4", "Reporting channels", "Web, mobile, SMS and WhatsApp on South Africa’s DTIC platform."], ["4", "Languages", "Available for trade-barrier reporting on the DTIC platform."]].map(([value, label, note]) => <article key={label}><strong>{value}</strong><span>{label}</span><p>{note}</p></article>)}
                  </div>
                </div>
              </div>
              <section id="how-we-work" class="workflow-process-panel" aria-label="How we work">
                <div class="workflow-process-inner">
                  <div class="services-heading"><div><div class="flex items-center gap-2.5 mb-4"><span class="w-7 h-px bg-[#1B63E8]" /><span class="services-kicker">How we work</span></div><h2 class="font-display services-title">From idea <span>to dependable delivery.</span></h2></div></div>
                  <div class="work-steps-viewport"><ol class="work-steps">{[["Discover", "Map the process, data, constraints and users."], ["Prototype", "Prove value fast on real data."], ["Build", "Engineer, integrate and quality-assure."], ["Deploy", "Phased go-live, training and change management."], ["Run", "SLA-based support and continuous improvement."]].map(([step, detail], index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong><p>{detail}</p></li>)}</ol></div>
                </div>
              </section>
            </div>
          </section>
          {props.showCodeCentreOnHome && (
            <section
              class="engineering-preview"
              aria-labelledby="code-centre-title"
            >
              <div class="engineering-preview-inner">
                <div class="engineering-copy">
                  <p class="engineering-eyebrow">
                    <span /> From our engineering team
                  </p>
                  <h2 id="code-centre-title" class="font-display">
                    Built here.
                    <br />
                    <span>Shared here.</span>
                  </h2>
                  <p class="engineering-description">
                    Explore our Code Centre for Java code, DevOps field notes,
                    and practical solutions to the errors we encounter along the
                    way.
                  </p>
                  <NuxtLink to="/code-centre" class="engineering-link">
                    Explore the Code Centre{" "}
                    <span>
                      <ArrowRight />
                    </span>
                  </NuxtLink>
                </div>
                <div class="engineering-notebook">
                  <div class="engineering-notebook-heading">
                    <span class="engineering-notebook-dots" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                    <span>THE ENGINEERING NOTEBOOK</span>
                    <span aria-hidden="true">↗</span>
                  </div>
                  <NuxtLink
                    to="/code-centre#java-queue-empty"
                    class="engineering-entry"
                  >
                    <span class="engineering-entry-icon" aria-hidden="true">
                      {"{ }"}
                    </span>
                    <span class="engineering-entry-copy">
                      <span class="engineering-entry-topic">
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
                      <span class="engineering-entry-topic">
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
                  <div class="engineering-notebook-footer">
                    <span aria-hidden="true">&lt;/&gt;</span> Practical notes
                    from everyday engineering.
                  </div>
                </div>
              </div>
            </section>
          )}
          <div
            class="customer-layout"
            innerHTML={content.slice(contactStart)}
          />
        </main>
      </div>
    )
  },

  {
    name: "App",

    props: { showCodeCentreOnHome: { type: Boolean, default: true } },
  },
)
