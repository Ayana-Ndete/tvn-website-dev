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

    const contactStart = content.indexOf("<!-- HOW WE WORK + CONTACT -->")

    usePageMotion(rootRef)

    useClientEffect(
      () => {
        const update = () => {
          scrolled.value = window.scrollY > 32

          const total = document.documentElement.scrollHeight - innerHeight

          if (progressRef.value)
            progressRef.value.style.transform = `scaleX(${
              total > 0 ? window.scrollY / total : 0
            })`

          activeSection.value =
            ["hero", "services", "ai", "work", "journey", "about", "contact"]

              .filter(
                (id) =>
                  (document.getElementById(id)?.getBoundingClientRect().top ??
                    Infinity) <= 150,
              )

              .pop() ?? "hero"
        }

        update()

        window.addEventListener("scroll", update, { passive: true })

        return () => window.removeEventListener("scroll", update)
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
                <p class="hero-intro home-hero-eyebrow">
                  Software · Regulatory systems · Applied AI
                </p>
                <TypewriterHeading paused={heroPaused.value} />
                <p class="hero-intro hero-description">
                  From national regulatory platforms and regional trade hubs to
                  loyalty, lending, payments and AI agents, we design, build and
                  run secure software for governments, regional bodies and
                  growing businesses in East, Central and Southern Africa.
                </p>
                <div class="hero-intro hero-actions">
                  <a href="#work" class="hero-button hero-primary">
                    See our work <ArrowRight />
                  </a>
                  <a href="#contact" class="hero-button hero-secondary">
                    Book a consultation <ArrowRight />
                  </a>
                </div>
              </div>
            </div>
            <a class="hero-scroll-cue" href="#services">
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
          <div
            class="customer-layout"
            innerHTML={content.slice(0, contactStart)}
          />
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
