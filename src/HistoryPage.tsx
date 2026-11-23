import logoImage from "./assets/images/brand/technovation-logo.png"
import { useClientEffect } from "./useClientEffect"
import { defineComponent, shallowRef } from "vue"
const chapters = [
  [
    "2017",
    "Making regional market information more accessible.",
    "Regional pharmaceutical markets",
    "EAC Integrated Pharmaceutical Market Information System (IPMIS)",
    "The EAC Integrated Pharmaceutical Market Information System (IPMIS) supports regional pharmaceutical market analytics, helping make market information more accessible to inform analysis and decision-making.",
    "Using digital information to support a more connected view of the regional pharmaceutical market.",
  ],
  [
    "2019",
    "Supporting harmonised medicines registration.",
    "A regional milestone",
    "East African Community Medicines Registration Harmonisation Information Management System",
    "A regional platform connected to six national medicines regulators for joint drug registration and GMP inspections.",
    "One system, six national regulators.",
  ],
  [
    "2020",
    "Strengthening medicines regulatory information management.",
    "Digital regulation",
    "National Drug Authority Management Information System (NDAMIS), Uganda",
    "A management information system for Uganda’s National Drug Authority, integrated with Microsoft Dynamics and supported under a multi-year SLA.",
    "Strengthening medicines regulation with connected digital services.",
  ],
  [
    "2021",
    "Connecting business services with digital processes.",
    "Business and trade services",
    "KNCCI digital systems and Pharmacy and Poisons Board initiatives",
    "Our 2021 portfolio included digital systems for the Kenya National Chamber of Commerce and Industry, alongside Pharmacy and Poisons Board Trade Affairs and electronic single-window initiatives. Together, these engagements reflect work across business services and trade-related regulatory processes.",
    "Bringing digital systems to business services and trade facilitation.",
  ],
  [
    "2022",
    "Messages that move information.",
    "Digital communication",
    "SMS Tele",
    "Ujumbe is a messaging platform that helps organisations send, manage and track messages to customers and users.",
    "Messages that move information.",
  ],
  [
    "2023",
    "Extending our digital footprint.",
    "Regulatory systems",
    "Zanzibar Food and Drugs Agency (ZFDA) regulatory systems",
    "The first ZFDA regulatory system and the start of multi-year support for Uganda’s NDAMIS.",
    "Extending our regulatory systems footprint to Zanzibar.",
  ],
  [
    "2024",
    "Supporting safer, smoother agricultural trade.",
    "Cross-border trade",
    "EAC Sanitary & Phytosanitary (SPS) Platform",
    "A regional hub for accessing and verifying permits and e-phyto certificates, connected to TradeMark Africa’s blockchain-based TLIP pipeline. ZFDA IRMIS V2 client portal also went live.",
    "Safer agricultural trade, and a national regulator rebuilt.",
  ],
  [
    "2025",
    "Turning enquiries into opportunities.",
    "Business matchmaking",
    "BiasharaLink Digital Inquiry and Matchmaking Platform",
    "BiasharaLink captures trade enquiries and uses an AI decision engine to validate, score and route them. DealHouse supports B2B deals from inquiry to settlement.",
    "Turning enquiries into opportunities.",
  ],
  [
    "2026",
    "Trade, loyalty, lending & applied AI",
    "South Africa DTIC Export Barrier Reporting and Resolution Platform; Sarit Belong; Chanuka; TradeConnect",
    "AI-assisted routing on South Africa’s national export-barrier platform, loyalty and e-purse services at Sarit Centre, and a complete micro-lending platform for a financial institution.",
    "Putting AI to work on national trade, and loyalty at mall scale.",
  ],
]
chapters.reverse()
export default defineComponent(
  () => {
    const root = shallowRef<HTMLElement | null>(null)
    const active = shallowRef("2026")
    useClientEffect(
      () => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
        const cards =
          root.value?.querySelectorAll<HTMLElement>(".history-chapter") ?? []
        const animations: Animation[] = []
        const observer = new IntersectionObserver(
          (entries) =>
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                active.value = entry.target.id.replace("year-", "")
                if (
                  !reduced.matches &&
                  !(entry.target as HTMLElement).dataset.played
                ) {
                  ;(entry.target as HTMLElement).dataset.played = "true"
                  entry.target
                    .querySelectorAll<HTMLElement>("[data-archive-reveal]")
                    .forEach((element, index) => {
                      animations.push(
                        element.animate(
                          [
                            {
                              opacity: 0,
                              transform: `translateY(${
                                index ? 45 : 24
                              }px) rotate(${index ? "-2deg" : "0deg"})`,
                            },
                            {
                              opacity: 1,
                              transform: "translateY(0) rotate(0)",
                            },
                          ],
                          {
                            duration: 1000,
                            delay: index * 130,
                            easing: "cubic-bezier(.16,1,.3,1)",
                            fill: "backwards",
                          },
                        ),
                      )
                    })
                }
              }
            }),
          { rootMargin: "-15% 0px -35% 0px", threshold: 0 },
        )
        cards.forEach((card) => observer.observe(card))
        const stop = () => {
          if (reduced.matches)
            animations.forEach((animation) => animation.finish())
        }
        reduced.addEventListener("change", stop)
        return () => {
          observer.disconnect()
          animations.forEach((animation) => animation.cancel())
          reduced.removeEventListener("change", stop)
          cards.forEach((card) => delete card.dataset.played)
        }
      },
      () => [],
    )
    return () => (
      <section
        class="history-page history-embedded"
        id="history"
        ref={root}
        aria-label="Our history"
      >
        <section class="history-hero history-wrap">
          <div class="history-kicker">
            <span>Our journey</span>
            <span>Memory Lane / 2026—2017</span>
          </div>
          <div class="history-hero-grid">
            <div class="history-hero-copy">
              <p class="history-eyebrow">Website copy · Project-led timeline</p>
              <h2 class="history-title">
                Our journey.
                <br />
                <span>Memory Lane.</span>
              </h2>
              <p>
                A decade of building digital systems for institutions, regions
                and business. Explore the projects and milestones that have
                shaped Technovation Ventures’ work across Africa.
              </p>
              <a class="history-start" href="#year-2016">
                Take a walk down memory lane <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div class="archive-cover">
              <div class="archive-stamp">
                TECHNOVATION
                <br />
                THE MEMORY COLLECTION
              </div>
              <span class="archive-cover-label">
                Past / Present / Possibility
              </span>
              <div class="archive-cover-years">
                2026<span>↓</span>2017
              </div>
              <div class="archive-cover-bottom">
                <span>
                  Ten chapters.
                  <br />
                  One continuing story.
                </span>
                <img
                  src={logoImage}
                  alt=""
                  width="44"
                  height="44"
                />
              </div>
            </div>
          </div>
          <div class="history-hero-bottom">
            <span>A journey through the years</span>
            <span>Scroll to turn the page ↓</span>
          </div>
        </section>
        <div class="history-year-bar">
          <nav aria-label="Jump to a year">
            {chapters.map(([year]) => (
              <a
                key={year}
                href={`#year-${year}`}
                aria-current={active.value === year ? "location" : undefined}
              >
                {year}
              </a>
            ))}
          </nav>
        </div>
        <div class="history-wrap history-archive" id="archive">
          {chapters.map(([year, title, label, project, prompt, memory], index) => (
            <section
              id={`year-${year}`}
              class={`history-chapter ${index % 2 ? "archive-reverse" : ""}`}
              key={year}
              aria-labelledby={`chapter-${year}`}
            >
              <div class="history-year" data-archive-reveal="true">
                <span>CHAPTER {String(index + 1).padStart(2, "0")}</span>
                <div>{year}</div>
                <span class="history-year-caption">
                  {index === chapters.length - 1
                    ? "The story continues"
                    : "From the archive"}
                </span>
              </div>
              <article class="history-memory" data-archive-reveal="true">
                <div class="memory-meta">
                  <span>{label}</span>
                  <span>TV / {year!.slice(2)}</span>
                </div>
                <h2 id={`chapter-${year}`}>{title}</h2>
                <p class="memory-project">{project}</p>
                <p>{prompt}</p>
                <div class="memory-note">
                  <span class="memory-note-label">A moment to remember</span>
                  <p>{memory}</p>
                </div>
                <div class="memory-bottom">
                  <span>Technovation Ventures</span>
                  <span>
                    {year} / {index === chapters.length - 1
                      ? "Today"
                      : "A page from our past"}
                  </span>
                </div>
              </article>
            </section>
          ))}
        </div>
        <section class="history-ending history-wrap">
          <p class="history-eyebrow">The next chapter</p>
          <h2>
            Want to be a part of us<br />
            <span>in this journey?</span>
          </h2>
          <a class="history-start history-contact" href="/contact">
            Contact us <b>→</b>
          </a>
        </section>
      </section>
    )
  },
  { name: "HistoryPage", props: [] },
)
