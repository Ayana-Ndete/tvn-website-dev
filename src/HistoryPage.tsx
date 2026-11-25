import logoImage from "./assets/images/brand/technovation-logo.png"
import { useClientEffect } from "./useClientEffect"
import { defineComponent, shallowRef } from "vue"
const chapters = [
  { year: "2026", category: "Trade, loyalty, lending & applied AI", headline: "Putting AI to work on national trade, and loyalty at mall scale.", detail: "South Africa DTIC NTB Platform with AI-assisted routing · Sarit Belong · Chanuka Micro-Lending Platform · TradeConnect" },
  { year: "2025", category: "Business matchmaking", headline: "Turning enquiries into opportunities.", detail: "BiasharaLink · DealHouse" },
  { year: "2024", category: "Cross-border trade & modernisation", headline: "Safer agricultural trade, and a national regulator rebuilt.", detail: "EAC SPS Platform with blockchain-based TLIP verification · ZFDA IRMIS V2 client portal live" },
  { year: "2023", category: "Regulatory systems", headline: "Extending our footprint to Zanzibar.", detail: "First ZFDA regulatory system · NDAMIS multi-year support begins" },
  { year: "2022", category: "Digital communication", headline: "Messages that move information.", detail: "Ujumbe Message Delivery Platform" },
  { year: "2021", category: "Business & trade services", headline: "Connecting business services with digital processes.", detail: "KNCCI Marketplace and CMIS · Pharmacy and Poisons Board trade initiatives" },
  { year: "2020", category: "Digital regulation", headline: "Strengthening medicines regulation in Uganda.", detail: "National Drug Authority MIS (NDAMIS)" },
  { year: "2019", category: "A regional milestone", headline: "One system, six national regulators.", detail: "EAC Medicines Regulatory Harmonisation IMS" },
  { year: "2017", category: "Regional pharmaceutical markets", headline: "Where our regional work began.", detail: "EAC Integrated Pharmaceutical Market Information System (IPMIS)" },
]
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
          <div class="history-kicker"><span>Our journey · 2017–2026</span></div>
          <div class="history-hero-grid">
            <div class="history-hero-copy">
              <h1 class="history-title">A decade of building for institutions, regions and business</h1>
            </div>
            <div class="archive-cover" aria-label="Technovation journey book cover">
              <div class="archive-stamp">TECHNOVATION<br />THE MEMORY COLLECTION</div>
              <span class="archive-cover-label">Past / Present / Possibility</span>
              <div class="archive-cover-years">2026<span>↓</span>2017</div>
              <div class="archive-cover-bottom">
                <span>Ten chapters.<br />One continuing story.</span>
                <img src={logoImage} alt="" width="44" height="44" />
              </div>
            </div>
          </div>
        </section>
        <div class="history-year-bar">
          <nav aria-label="Jump to a year">
            {chapters.map(({ year }) => (
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
          {chapters.map(({ year, category, headline, detail }, index) => (
            <section
              id={`year-${year}`}
              class={`history-chapter ${index % 2 ? "archive-reverse" : ""}`}
              key={year}
              aria-labelledby={`chapter-${year}`}
            >
              <div class="history-year" data-archive-reveal="true">
                <div>{year}</div>
              </div>
              <article class="history-memory" data-archive-reveal="true">
                <div class="memory-meta"><span>{category}</span></div>
                <h2 id={`chapter-${year}`}>{headline}</h2>
                <p class="memory-project">{detail}</p>
              </article>
            </section>
          ))}
        </div>
      </section>
    )
  },
  { name: "HistoryPage", props: [] },
)
