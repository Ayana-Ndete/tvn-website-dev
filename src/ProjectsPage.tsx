import Navbar from "./Navbar"

import { useClientEffect } from "./useClientEffect"

import { defineComponent, shallowRef, computed, type CSSProperties } from "vue"

import countries from "./africaMap.json"

import { useRoute } from "#imports"

import { NuxtLink } from "#components"

import { work } from "./projectCatalog"

const locations = [
  { name: "Kenya", x: 387, y: 375, labelX: 426, labelY: 364 },

  { name: "Uganda", x: 289, y: 338, labelX: 240, labelY: 298 },

  { name: "Tanzania", x: 442, y: 486, labelX: 458, labelY: 498 },

  { name: "Rwanda", x: 231, y: 390, labelX: 157, labelY: 375 },

  { name: "Burundi", x: 225, y: 419, labelX: 154, labelY: 438 },
]

type Project = typeof work[number]

function EdgeSignal() {
  return (
    <svg class="px-edge" aria-hidden="true">
      <rect x="1" y="1" rx="20" pathLength="100" />
      <rect x="1" y="1" rx="20" pathLength="100" />
    </svg>
  )
}

export default defineComponent(
  () => {
    const location = shallowRef("Kenya")

    const selected = shallowRef<Project>(work[0]!)

    const detail = shallowRef<Project | null>(null)

    const hover = shallowRef<string | null>(null)

    const motionPaused = shallowRef(false)

    const page = shallowRef<HTMLDivElement | null>(null)

    const progress = shallowRef<HTMLDivElement | null>(null)

    const dialog = shallowRef<HTMLDialogElement | null>(null)

    const route = useRoute()

    const isProducts = computed(
      () => route.path.replace(/\/$/, "") === "/products",
    )

    const visible = computed(() =>
      location.value === "All projects"
        ? work
        : work.filter((p) => p.place === location.value),
    )

    const choose = (name: string) => {
      location.value = name

      selected.value = work.find((p) => p.place === name) ?? work[0]!
    }

    useClientEffect(
      () => {
        const media = window.matchMedia("(prefers-reduced-motion: reduce)")

        const observer = new IntersectionObserver(
          (entries) =>
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                if (!media.matches)
                  entry.target.animate(
                    [
                      { opacity: 0.35, transform: "translateY(25px)" },

                      { opacity: 1, transform: "translateY(0)" },
                    ],

                    { duration: 650, easing: "cubic-bezier(.2,.8,.2,1)" },
                  )

                observer.unobserve(entry.target)
              }
            }),

          { threshold: 0.12 },
        )

        page.value

          ?.querySelectorAll(
            ".px-section-title,.px-product-card,.px-project-grid,.px-cta",
          )

          .forEach((el) => observer.observe(el))

        let frame = 0

        const update = () => {
          frame = 0

          const distance =
            document.documentElement.scrollHeight - window.innerHeight

          if (progress.value)
            progress.value.style.transform = `scaleX(${
              distance > 0 ? window.scrollY / distance : 0
            })`
        }

        const scroll = () => {
          if (!frame) frame = requestAnimationFrame(update)
        }

        update()

        window.addEventListener("scroll", scroll, { passive: true })

        return () => {
          observer.disconnect()

          cancelAnimationFrame(frame)

          window.removeEventListener("scroll", scroll)
        }
      },

      () => [],
    )

    useClientEffect(
      () => {
        document.title = `${
          isProducts.value ? "Products" : "Projects"
        } — Technovation Ventures`

        if (isProducts.value)
          document

            .getElementById("products")

            ?.scrollIntoView({ behavior: "instant" })
      },

      () => [isProducts.value],
    )

    useClientEffect(
      () => {
        if (detail.value) dialog.value?.showModal()
        else dialog.value?.close()
      },

      () => [detail.value],
    )

    return () => (
      <div
        ref={page}
        class={`px-page ${motionPaused.value ? "px-motion-paused" : ""}`}
      >
        <div ref={progress} class="scroll-progress" aria-hidden="true" />
        <a class="px-skip" href="#explorer">
          Skip to project explorer
        </a>
        <Navbar scrolled />
        <main>
          <section class="px-hero px-wrap">
            <div>
              <p class="px-kicker">
                <i /> OUR WORK, ON THE MAP
              </p>
              <h1>
                Ideas put into practice.
                <br />
                <span>Built for opportunity.</span>
              </h1>
            </div>
            <div class="px-intro">
              <p>
                We turn complex operational, regulatory and commercial
                challenges into digital solutions. Explore the platforms,
                systems and applications we build to help organisations work
                smarter, connect services and create new opportunities.
              </p>
              <a
                class="px-down"
                href="#explorer"
                aria-label="Scroll to the project map"
              >
                <svg viewBox="0 0 24 32" fill="none" aria-hidden="true">
                  <path
                    d="M12 3V27M4 19L12 27L20 19"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                </svg>
              </a>
            </div>
          </section>
          <section
            id="explorer"
            class="px-wrap px-explorer"
            aria-label="Interactive project explorer"
          >
            <div class="px-explorer-top">
              <div>
                <span class="px-live" /> PROJECT ATLAS{" "}
                <span class="px-dim"> / EAST AFRICA</span>
              </div>
              <span class="px-map-instruction">
                Tap a country to discover our work
              </span>
              <button
                class="px-motion-toggle"
                aria-pressed={motionPaused.value}
                onClick={() => (motionPaused.value = !motionPaused.value)}
              >
                {motionPaused.value ? "Resume motion" : "Pause motion"}
              </button>
            </div>
            <div class="px-atlas-grid">
              <div class="px-map">
                <svg
                  viewBox="80 210 560 355"
                  aria-label="East Africa project locations"
                >
                  <defs>
                    <pattern
                      id="map-grid"
                      width="46"
                      height="46"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 46 0 L 0 0 0 46"
                        fill="none"
                        stroke="#93b8cb"
                        stroke-opacity=".07"
                      />
                    </pattern>
                    <radialGradient id="map-light">
                      <stop stop-color="#32698c" stop-opacity=".3" />
                      <stop offset="1" stop-color="#122733" stop-opacity="0" />
                    </radialGradient>
                  </defs>
                  <rect
                    x="0"
                    y="90"
                    width="720"
                    height="590"
                    fill="url(#map-grid)"
                  />
                  <ellipse
                    cx="340"
                    cy="360"
                    rx="330"
                    ry="300"
                    fill="url(#map-light)"
                  />
                  {countries.map((c) => {
                    const active = locations.some((l) => l.name === c.name)

                    return (
                      <path
                        key={c.name}
                        d={c.d}
                        class={`px-country ${active ? "px-covered" : ""} ${
                          location.value === c.name ? "px-selected" : ""
                        } ${hover.value === c.name ? "px-hover" : ""}`}
                        onClick={active ? () => choose(c.name) : undefined}
                        onMouseenter={
                          active ? () => (hover.value = c.name) : undefined
                        }
                        onMouseleave={() => (hover.value = null)}
                        aria-hidden="true"
                      />
                    )
                  })}
                  <text x="220" y="160" class="px-neighbour">
                    SOUTH SUDAN
                  </text>
                  <text x="458" y="189" class="px-neighbour">
                    ETHIOPIA
                  </text>
                  <text x="97" y="330" class="px-neighbour">
                    D. R. CONGO
                  </text>
                  <text x="550" y="412" class="px-ocean">
                    INDIAN
                  </text>
                  <text x="555" y="433" class="px-ocean">
                    OCEAN
                  </text>
                  <text x="306" y="503" class="px-neighbour">
                    TANZANIA
                  </text>
                  {locations

                    .filter((l) => l.name !== "Kenya")

                    .map((l, index) => (
                      <g
                        key={l.name}
                        aria-hidden="true"
                        style={
                          {
                            "--signal-delay": `${index * -0.9}s`,
                          } as CSSProperties
                        }
                      >
                        <path
                          d={`M387 375 Q ${(387 + l.x) / 2 + 35} ${(375 + l.y) / 2 - 40} ${l.x} ${l.y}`}
                          class="px-connection"
                        />
                        <path
                          pathLength="100"
                          d={`M387 375 Q ${(387 + l.x) / 2 + 35} ${(375 + l.y) / 2 - 40} ${l.x} ${l.y}`}
                          class="px-connection-signal"
                        />
                      </g>
                    ))}
                  {locations.map((l) => (
                    <g
                      key={l.name}
                      role="button"
                      tabindex={0}
                      aria-label={`Explore ${l.name} projects`}
                      aria-pressed={location.value === l.name}
                      onClick={() => choose(l.name)}
                      onKeydown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()

                          choose(l.name)
                        }
                      }}
                      onMouseenter={() => (hover.value = l.name)}
                      onMouseleave={() => (hover.value = null)}
                      class={`px-pin ${
                        location.value === l.name ? "px-pin-active" : ""
                      }`}
                    >
                      <circle cx={l.x} cy={l.y} r="26" class="px-pin-hit" />
                      <circle cx={l.x} cy={l.y} r="12" class="px-pin-pulse" />
                      <circle cx={l.x} cy={l.y} r="14" class="px-pin-ring" />
                      <circle cx={l.x} cy={l.y} r="5" class="px-pin-core" />
                      <text x={l.labelX} y={l.labelY}>
                        {l.name === "Tanzania" ? "Zanzibar" : l.name}
                        {location.value === l.name ? " ↗" : ""}
                      </text>
                    </g>
                  ))}
                  <g class="px-compass" transform="translate(609 248)">
                    <text y="-12">N</text>
                    <path d="M0 0L-5 20L0 15L5 20Z" />
                  </g>
                </svg>
                <div class="px-map-caption">
                  <span>
                    <i /> Project location
                  </span>
                  <span>Boundaries: Natural Earth</span>
                </div>
                <div class="px-map-hint">
                  {hover.value
                    ? `Discover ${hover.value} →`
                    : "From Nairobi, across the region."}
                </div>
              </div>
              <aside
                class="px-preview"
                aria-live="polite"
                aria-atomic="true"
                key={selected.value.id}
              >
                <div class="px-preview-top">
                  <span class="px-kicker">
                    {selected.value.place === "Tanzania"
                      ? "Zanzibar · Tanzania"
                      : selected.value.place}
                  </span>
                  <span>
                    {String(work.indexOf(selected.value) + 1).padStart(2, "0")}{" "}
                    / {String(work.length).padStart(2, "0")}
                  </span>
                </div>
                <div class="px-browser">
                  <div>
                    <i />
                    <i />
                    <i />
                    <span>{selected.value.name}</span>
                  </div>
                  <img
                    class={
                      [
                        "kncci",
                        "nda",
                        "smstele",
                        "biasharalink",
                        "dealhouse",
                      ].includes(selected.value.id)
                        ? "px-project-logo"
                        : selected.value.id === "sarit"
                          ? "px-app-shot"
                          : undefined
                    }
                    src={selected.value.image}
                    alt={`${selected.value.name} interface`}
                  />
                </div>
                <p class="px-category">
                  {selected.value.year} / {selected.value.category}
                </p>
                <h2>{selected.value.name}</h2>
                <p class="px-description">{selected.value.description}</p>
                <button
                  class="px-action"
                  onClick={() => (detail.value = selected.value)}
                >
                  Explore project <span>↗</span>
                </button>
                <p class="px-preview-note">
                  Purpose-built technology. Regional perspective.
                </p>
              </aside>
            </div>
            <div
              class="px-location-list"
              aria-label="Filter projects by location"
            >
              {[
                "All projects",

                ...locations.map((l) => l.name),

                "Regional",

                "Other projects",
              ].map((name) => (
                <button
                  key={name}
                  aria-pressed={location.value === name}
                  onClick={() => choose(name)}
                >
                  {name}
                  <span>
                    {name === "All projects"
                      ? work.length
                      : work.filter((p) => p.place === name).length}
                  </span>
                </button>
              ))}
            </div>
          </section>
          <nav class="px-section-nav px-wrap" aria-label="Page sections">
            <a href="#explorer">
              01 <span>Project atlas</span> ↑
            </a>
            <a href="#collection">
              02 <span>Project collection</span> ↓
            </a>
            <a href="#products">
              03 <span>Our products</span> ↓
            </a>
          </nav>
          <section id="collection" class="px-wrap px-collection">
            <div class="px-section-title">
              <div>
                <p class="px-kicker">THE PROJECT COLLECTION</p>
                <h2>
                  {location.value === "All projects"
                    ? "Ideas put into practice."
                    : location.value === "Other projects"
                      ? "More of our work."
                      : `A closer look at ${
                          location.value === "Regional"
                            ? "the region"
                            : location.value
                        }.`}
                </h2>
              </div>
              <p aria-live="polite">
                {visible.value.length}{" "}
                {visible.value.length === 1 ? "project" : "projects"}{" "}
                <span> / </span>
                <button onClick={() => choose("All projects")}>
                  View all projects ↗
                </button>
              </p>
            </div>
            <div
              class={`px-project-grid ${
                visible.value.length === 1 ? "px-project-featured" : ""
              }`}
            >
              {visible.value.map((p) => (
                <button
                  class="px-project-tile"
                  key={p.id}
                  onClick={() => (detail.value = p)}
                >
                  <EdgeSignal />
                  <div class="px-tile-image">
                    <img
                      class={
                        [
                          "kncci",
                          "nda",
                          "smstele",
                          "biasharalink",
                          "dealhouse",
                        ].includes(p.id)
                          ? "px-project-logo"
                          : p.id === "sarit"
                            ? "px-app-shot"
                            : undefined
                      }
                      loading="lazy"
                      src={p.image}
                      alt={`${p.name} interface`}
                    />
                    <span>↗</span>
                  </div>
                  <div class="px-tile-copy">
                    <p>
                      {p.year} <span> / {p.category}</span>
                    </p>
                    <h3>{p.name}</h3>
                    <p>{p.description}</p>
                    <div class="px-tile-features">
                      {p.features.slice(0, 2).map((f) => (
                        <span key={f}>{f}</span>
                      ))}
                    </div>
                    <span class="px-tile-link">
                      Discover the project <span>↗</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>
            {location.value === "Other projects" && (
              <p class="px-footnote">
                These systems are listed separately because their deployment
                locations are not specified in the published portfolio.
              </p>
            )}
          </section>
          <section id="products" class="px-products">
            <div class="px-wrap">
              <div class="px-section-title">
                <div>
                  <p class="px-kicker">OUR PRODUCTS</p>
                  <h2>
                    Your next chapter.
                    <br />
                    <span>Already taking shape.</span>
                  </h2>
                </div>
                <p>
                  Proven platforms for the work that matters.
                  <br />
                  Let’s find the right fit for your organisation.
                </p>
              </div>
              <div class="px-product-grid">
                <article class="px-product-card">
                  <EdgeSignal />
                  <span class="px-product-number">
                    01 / CUSTOMER EXPERIENCE
                  </span>
                  <h3>Ticket Management System</h3>
                  <p class="px-product-description">
                    Organise, prioritise and track support tickets. Keep
                    customers informed with personalised SMS updates.
                  </p>
                  <div class="px-tags">
                    <span>Ticket tracking</span>
                    <span>SMS updates</span>
                  </div>
                  <a>
                    Enquire about this product <span>↗</span>
                  </a>
                </article>
                <article class="px-product-card px-product-regulatory">
                  <EdgeSignal />
                  <span class="px-product-number">
                    02 / MEDICINE REGULATION
                  </span>
                  <h3>Technovation NMRA System</h3>
                  <p class="px-product-description">
                    Manage medicine registration, licensing, inspections and
                    safety in one platform for national medicine regulators.
                  </p>
                  <div class="px-tags">
                    <span>Registration</span>
                    <span>Licensing</span>
                    <span>Pharmacovigilance</span>
                  </div>
                  <a>
                    Enquire about this product <span>↗</span>
                  </a>
                </article>
              </div>
            </div>
          </section>
          <section class="px-wrap px-cta">
            <p class="px-kicker">LET’S BUILD WHAT’S NEXT</p>
            <h2>
              Your ambition.
              <br />
              Our next point on the map.
            </h2>
            <NuxtLink class="px-action" to="/#contact">
              Start a conversation <span>↗</span>
            </NuxtLink>
          </section>
        </main>
        <footer class="px-wrap px-footer">
          <NuxtLink to="/">Technovation Ventures</NuxtLink>
          <span>Nairobi, Kenya · Built for the region.</span>
          <span>© {new Date().getFullYear()} Technovation Ventures Ltd.</span>
        </footer>
        <dialog
          ref={dialog}
          class="px-dialog"
          onCancel={() => (detail.value = null)}
          onClick={(e) => {
            if (e.target === e.currentTarget) detail.value = null
          }}
          aria-labelledby="project-title"
        >
          {detail.value && (
            <>
              <button
                class="px-dialog-close"
                onClick={() => (detail.value = null)}
                aria-label="Close project details"
                autofocus
              >
                ✕
              </button>
              <img
                class={
                  [
                    "kncci",
                    "nda",
                    "smstele",
                    "biasharalink",
                    "dealhouse",
                  ].includes(detail.value.id)
                    ? "px-project-logo"
                    : detail.value.id === "sarit"
                      ? "px-app-shot"
                      : undefined
                }
                src={detail.value.image}
                alt={`${detail.value.name} application screenshot`}
              />
              <div class="px-dialog-copy">
                <p class="px-kicker">
                  {detail.value.year} / {detail.value.category}
                </p>
                <h2 id="project-title">{detail.value.name}</h2>
                <p>{detail.value.description}</p>
                <h3>Overview</h3>
                <p>{detail.value.overview}</p>
                <h3>Key capabilities / focus areas</h3>
                <ul>
                  {detail.value.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <h3>The value</h3>
                <p>{detail.value.value}</p>
                <a class="px-action">Discuss a similar project ↗</a>
              </div>
            </>
          )}
        </dialog>
      </div>
    )
  },

  { name: "ProjectsPage", props: [] },
)
