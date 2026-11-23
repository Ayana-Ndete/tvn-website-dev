import Navbar from "./Navbar"
import { useClientEffect } from "./useClientEffect"
import { defineComponent, shallowRef, computed } from "vue"
import { type Post } from "./codeCentreData"
import { useCodeCentreMotion } from "./useCodeCentreMotion"
import { useRuntimeConfig } from "#imports"
import { NuxtLink } from "#components"
import logoImage from "./assets/images/brand/technovation-logo.png"
function CardPulse() {
  return (
    <svg class="cc-card-pulse" aria-hidden="true" focusable="false">
      <rect class="cc-pulse-track" x="1" y="1" rx="18" pathLength="100" />
      <rect class="cc-pulse-trail" x="1" y="1" rx="18" pathLength="100" />
      <rect class="cc-pulse-tip" x="1" y="1" rx="18" pathLength="100" />
    </svg>
  )
}
function BrandCircuit() {
  const traces = [
    "M0 55H180L215 90H340",
    "M80 125H230L265 90H340",
    "M760 55H580L545 90H420",
    "M680 125H530L495 90H420",
  ]
  return (
    <div class="cc-brand-circuit">
      <svg class="cc-brand-traces" viewBox="0 0 760 180" fill="none">
        {traces.map((d, i) => (
          <g key={d}>
            <path class="cc-brand-wire" d={d} />
            <path
              class="cc-brand-packet"
              d={d}
              pathLength="100"
              style={{ animationDelay: `${i * -1.3}s` }}
            />
          </g>
        ))}
        {[
          [180, 55],
          [230, 125],
          [580, 55],
          [530, 125],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" />
        ))}
      </svg>
      <div class="cc-brand-core">
        <span class="cc-brand-halo" />
        <div class="cc-brand-chip">
          <img
            src={logoImage}
            width="48"
            height="48"
            alt=""
          />
        </div>
      </div>
      <span class="cc-brand-signature">THE TECHNOVATION WAY</span>
    </div>
  )
}
function GlassTransition({
  variant = "white",
}: {
  variant?: "white" | "blue"
}) {
  const edge =
    "M0 48 C120 8 240 8 360 48 S600 88 720 48 S960 8 1080 48 S1320 88 1440 48"
  const wave = `${edge} V160 H0 Z`
  return (
    <div
      class={`cc-glass-transition cc-glass-transition-${variant}`}
      aria-hidden="true"
    >
      {[0, 1, 2].map((layer) => (
        <svg
          key={layer}
          class={`cc-wave cc-wave-${layer}`}
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
        >
          <path d={wave} />
          {variant === "blue" && (
            <>
              <path class="cc-wave-rim" d={edge} />
              <path class="cc-wave-signal" d={edge} pathLength="100" />
            </>
          )}
        </svg>
      ))}
      {variant === "blue" && <BrandCircuit />}
    </div>
  )
}
const CodeBlock = defineComponent(
  (props: { code: string; language: string }) => {
    const message = shallowRef("Copy code")
    return () => (
      <div class="cc-code">
        <div>
          <span>{props.language || "code"}</span>
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(props.code)
                message.value = "Copied!"
              } catch {
                message.value = "Select code to copy"
              }
            }}
            aria-live="polite"
          >
            {message.value}
          </button>
        </div>
        <pre>
          <code>{props.code}</code>
        </pre>
      </div>
    )
  },
  { name: "CodeBlock", props: ["code", "language"] },
)
function ArticleBody({ body }: { body: string }) {
  return (
    <div class="cc-body">
      {body.split(/```/).map((block, i) => {
        if (i % 2) {
          const newline = block.indexOf("\n")
          return (
            <CodeBlock
              key={i}
              language={newline < 0 ? "" : block.slice(0, newline)}
              code={(newline < 0 ? block : block.slice(newline + 1)).trimEnd()}
            />
          )
        }
        return block
          .split("\n")
          .filter((line) => line.trim())
          .map((line, j) =>
            line.startsWith("## ") ? (
              <h2 id={`section-${i}-${j}`} key={j}>
                {line.slice(3)}
              </h2>
            ) : (
              <p key={j}>{line}</p>
            ),
          )
      })}
    </div>
  )
}
export default defineComponent(
  () => {
    const root = shallowRef<HTMLDivElement | null>(null)
    const progress = shallowRef<HTMLDivElement | null>(null)
    const scrolled = shallowRef(false)
    const ambientPaused = shallowRef(false)
    useCodeCentreMotion(root)
    useClientEffect(
      () => {
        let frame = 0
        const update = () => {
          const distance =
            document.documentElement.scrollHeight - window.innerHeight
          if (progress.value)
            progress.value.style.transform = `scaleX(${
              distance > 0 ? Math.min(1, window.scrollY / distance) : 0
            })`
          scrolled.value = window.scrollY > 32
          frame = 0
        }
        const schedule = () => {
          if (!frame) frame = requestAnimationFrame(update)
        }
        const resize = new ResizeObserver(schedule)
        if (root.value) resize.observe(root.value)
        update()
        window.addEventListener("scroll", schedule, { passive: true })
        window.addEventListener("resize", schedule)
        return () => {
          resize.disconnect()
          cancelAnimationFrame(frame)
          window.removeEventListener("scroll", schedule)
          window.removeEventListener("resize", schedule)
        }
      },
      () => [],
    )
    const localPosts = shallowRef<Post[]>([])
    const loadError = shallowRef("")
    const config = useRuntimeConfig()
    useClientEffect(
      () => {
        let cancelled = false
        $fetch<Post[]>("api/posts", { baseURL: config.app.baseURL })
          .then((items) => {
            if (!cancelled) localPosts.value = items
          })
          .catch(() => {
            if (!cancelled) loadError.value = "The Code Centre is temporarily unavailable."
          })
        return () => {
          cancelled = true
        }
      },
      () => [],
    )
    const route = shallowRef(window.location.hash.slice(1))
    const query = shallowRef("")
    const topic = shallowRef("All topics")
    const kind = shallowRef("All posts")
    const posts = computed(() =>
      localPosts.value.filter((item) => ["Java", "DevOps"].includes(item.topic)),
    )
    const post = computed(() =>
      posts.value.find((item) => item.id === route.value),
    )
    useClientEffect(
      () => {
        const change = () => {
          route.value = window.location.hash.slice(1)
          window.scrollTo(0, 0)
        }
        window.addEventListener("hashchange", change)
        return () => window.removeEventListener("hashchange", change)
      },
      () => [],
    )
    useClientEffect(
      () => {
        document.title = `${post.value?.title || "Code Centre"} — Technovation Ventures`
      },
      () => [post.value, route.value],
    )
    const filtered = computed(() =>
      posts.value.filter(
        (item) =>
          (topic.value === "All topics" || item.topic === topic.value) &&
          (kind.value === "All posts" || item.kind === kind.value) &&
          `${item.title} ${item.summary} ${item.body} ${item.topic}`
            .toLowerCase()
            .includes(query.value.toLowerCase()),
      ),
    )
    return () => (
      <div
        ref={root}
        class={`cc-page ${!route.value ? "cc-home" : ""} ${
          ambientPaused.value ? "cc-motion-paused" : ""
        }`}
      >
        <div ref={progress} class="scroll-progress" aria-hidden="true" />
        <a
          class="cc-skip"
          href="#cc-main"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById("cc-main")?.focus()
          }}
        >
          Skip to content
        </a>
        <Navbar scrolled={scrolled.value} />
        <main id="cc-main" tabindex={-1}>
          {route.value === "write" ? (
            <div class="cc-container cc-empty">
              <h1>Admin publishing only</h1>
              <p>Code Centre articles are created and managed by authorised Technovation administrators.</p>
              <NuxtLink to="/admin/login">Admin sign in →</NuxtLink>
            </div>
          ) : post.value ? (
            <div class="cc-container">
              <div class="cc-article-top">
                <a class="cc-back" href="#">
                  ← All posts
                </a>
                <span>
                  {post.value.topic} / {post.value.kind}
                </span>
              </div>
              <div class="cc-article-layout">
                <article>
                  <p class="cc-eyebrow">{post.value.kind}</p>
                  <h1>{post.value.title}</h1>
                  <p class="cc-lead">{post.value.summary}</p>
                  <div class="cc-byline">
                    <span class="cc-avatar">
                      {post.value.author.slice(0, 1)}
                    </span>
                    <span>
                      {post.value.author}
                      <small>
                        {post.value.date} ·{" "}
                        {Math.max(
                          1,
                          Math.ceil(post.value.body.split(/\s+/).length / 180),
                        )}{" "}
                        min read ·{" "}
                        Published article
                      </small>
                    </span>
                  </div>
                  <ArticleBody body={post.value.body} />
                  <div class="cc-article-end">
                    <span>More engineering notes are available in the Code Centre.</span>
                    <a href="#">Browse all posts →</a>
                  </div>
                </article>
                <aside class="cc-toc">
                  <p class="cc-eyebrow">ON THIS PAGE</p>
                  {post.value.body.split(/```/).flatMap((block, i) =>
                    i % 2
                      ? []
                      : block
                          .split("\n")
                          .filter((line) => line.trim())
                          .map((line, j) =>
                            line.startsWith("## ") ? (
                              <a
                                key={`${i}-${j}`}
                                href={`#${post.value!.id}`}
                                onClick={(e) => {
                                  e.preventDefault()
                                  document
                                    .getElementById(`section-${i}-${j}`)
                                    ?.scrollIntoView({
                                      behavior: window.matchMedia(
                                        "(prefers-reduced-motion: reduce)",
                                      ).matches
                                        ? "instant"
                                        : "smooth",
                                    })
                                }}
                              >
                                {line.slice(3)}
                              </a>
                            ) : null,
                          ),
                  )}
                  <div class="cc-sidebar-note">
                    <span aria-hidden="true">{"</>"}</span>
                    <h3>
                      Knowledge grows
                      <br />
                      when it’s shared.
                    </h3>
                    <p>Document the fix. Help the next developer.</p>
                    
                  </div>
                </aside>
              </div>
            </div>
          ) : route.value ? (
            <div class="cc-container cc-empty">
              <h1>Post not found</h1>
              <p>
                This article may have been unpublished, deleted, or the link may be incorrect.
              </p>
              <a href="#">Back to all posts →</a>
            </div>
          ) : (
            <>
              <section
                class={`cc-hero cc-glass-hero ${
                  ambientPaused.value ? "cc-ambient-paused" : ""
                }`}
              >
                <div class="cc-aurora" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <div class="cc-container cc-hero-grid">
                  <div>
                    <p class="cc-eyebrow">
                      <span class="cc-dot" /> TECHNOVATION / CODE CENTRE
                    </p>
                    <h1>
                      Code <span class="cc-glass-title">Centre.</span>
                    </h1>
                    <p>
                      Java in practice. DevOps in production. Code, fixes and
                      field notes from the people building at Technovation.
                    </p>
                    <a class="cc-primary" href="#cc-notebook">
                      Explore the notebook <span>↓</span>
                    </a>
                  </div>
                  <div
                    class="cc-glass-stack"
                    aria-label="Java and DevOps knowledge"
                  >
                    <div class="cc-glass-orbit" aria-hidden="true" />
                    <a
                      class="cc-glass-panel cc-glass-java"
                      href="#notebook"
                      onClick={(event) => {
                        event.preventDefault()
                        topic.value = "Java"
                        document
                          .getElementById("cc-notebook")
                          ?.scrollIntoView({
                            behavior: window.matchMedia(
                              "(prefers-reduced-motion: reduce)",
                            ).matches
                              ? "instant"
                              : "smooth",
                          })
                      }}
                    >
                      <CardPulse />
                      <div class="cc-glass-panel-top">
                        <span class="cc-glass-symbol" aria-hidden="true">
                          {"{ }"}
                        </span>
                        <span>01 / DEVELOPMENT</span>
                        <span aria-hidden="true">↗</span>
                      </div>
                      <strong>Java</strong>
                      <p>Small fixes. Better applications.</p>
                      <div class="cc-glass-code" aria-hidden="true">
                        <span>while</span> (curious) {"{"}
                        <br />
                        &nbsp; learn(); build(); share();
                        <br />
                        {"}"}
                      </div>
                      <div class="cc-glass-panel-foot">
                        <span class="cc-glass-status" /> Code worth sharing{" "}
                        <span>Explore →</span>
                      </div>
                    </a>
                    <a
                      class="cc-glass-panel cc-glass-devops"
                      href="#notebook"
                      onClick={(event) => {
                        event.preventDefault()
                        topic.value = "DevOps"
                        document
                          .getElementById("cc-notebook")
                          ?.scrollIntoView({
                            behavior: window.matchMedia(
                              "(prefers-reduced-motion: reduce)",
                            ).matches
                              ? "instant"
                              : "smooth",
                          })
                      }}
                    >
                      <CardPulse />
                      <div class="cc-glass-panel-top">
                        <span class="cc-glass-symbol" aria-hidden="true">
                          &gt;_
                        </span>
                        <span>02 / OPERATIONS</span>
                        <span aria-hidden="true">↗</span>
                      </div>
                      <strong>DevOps</strong>
                      <p>From the first build to production.</p>
                      <div class="cc-glass-pipeline" aria-hidden="true">
                        <span>BUILD</span>
                        <i />
                        <span>TEST</span>
                        <i />
                        <span>DEPLOY</span>
                      </div>
                      <div class="cc-glass-panel-foot">
                        <span class="cc-glass-status" /> Lessons from the field{" "}
                        <span>Explore →</span>
                      </div>
                    </a>
                  </div>
                </div>
              </section>
              <GlassTransition variant="blue" />
              <section id="cc-notebook" class="cc-container cc-library">
                <div class="cc-notebook-content">
                  <div class="cc-library-heading">
                    <div>
                      <p class="cc-eyebrow">FROM THE ENGINEERING TEAM</p>
                      <h2>
                        Explore the notebook<span>.</span>
                      </h2>
                    </div>
                    <div class="cc-library-tools">
                      <span class="cc-muted">
                        {posts.value.length} posts & counting
                      </span>
                      <button
                        class="cc-motion-control"
                        onClick={() =>
                          (ambientPaused.value = !ambientPaused.value)
                        }
                        aria-pressed={ambientPaused.value}
                      >
                        {ambientPaused.value
                          ? "Resume motion ▷"
                          : "Pause motion Ⅱ"}
                      </button>
                    </div>
                  </div>
                  <div class="cc-filters">
                    <label class="cc-search">
                      <span aria-hidden="true">⌕</span>
                      <input
                        aria-label="Search articles"
                        type="search"
                        placeholder="Search an error, topic or solution…"
                        value={query.value}
                        onInput={(e) =>
                          (query.value =
                            (e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value)
                        }
                      />
                    </label>
                    <select
                      aria-label="Filter by post type"
                      value={kind.value}
                      onChange={(e) =>
                        (kind.value =
                          (e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value)
                      }
                    >
                      {[
                        "All posts",
                        "Error & solution",
                        "Code snippet",
                        "Guide",
                      ].map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </div>
                  <div class="cc-topics" aria-label="Filter by topic">
                    {["All topics", "Java", "DevOps"].map((value) => (
                      <button
                        key={value}
                        aria-pressed={topic.value === value}
                        onClick={() => (topic.value = value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <p class="cc-results" aria-live="polite">
                    {filtered.value.length}{" "}
                    {filtered.value.length === 1 ? "post" : "posts"} · Published by the Technovation team.
                  </p>
                  {loadError.value && <p class="cc-error" role="alert">{loadError.value}</p>}
                  <div class="cc-post-grid">
                    {filtered.value.map((item, index) => (
                      <a
                        class={`cc-card ${
                          index === 0 &&
                          !query.value &&
                          topic.value === "All topics" &&
                          kind.value === "All posts"
                            ? "cc-featured"
                            : ""
                        }`}
                        href={`#${item.id}`}
                        key={item.id}
                      >
                        <CardPulse />
                        <span
                          class="cc-card-icon"
                          data-topic={item.topic}
                          aria-hidden="true"
                        >
                          {item.topic === "Java" ? "{ }" : ">_"}
                        </span>
                        <div class="cc-card-content">
                          <h3>{item.title}</h3>
                          <p class="cc-card-summary">{item.summary}</p>
                          <p class="cc-card-meta">
                            <span>{item.topic}</span>
                            {item.kind}
                            <span aria-hidden="true">↗</span>
                          </p>
                        </div>
                      </a>
                                          ))}
                  </div>

                  {filtered.value.length === 0 && (
                    <div class="cc-empty">
                      <h3>No matching posts yet.</h3>
                      <p>Try another search or clear the filters.</p>

                      <button
                        onClick={() => {
                          query.value = ""
                          topic.value = "All topics"
                          kind.value = "All posts"
                        }}
                      >
                        Clear filters →
                      </button>
                    </div>
                  )}
                </div>
              </section>

              <GlassTransition />
            </>
          )}
        </main>

        <footer class="cc-footer cc-container">
          <NuxtLink to="/">Technovation Ventures</NuxtLink>

          <nav aria-label="Footer navigation">
            <NuxtLink to="/">Home</NuxtLink>
            <NuxtLink to="/about">Our team</NuxtLink>
            <NuxtLink to="/services">Our services</NuxtLink>
          </nav>

          <span>© 2026 Technovation Ventures</span>
        </footer>
      </div>
    )
  },
  {
    name: "CodeCentrePage",
    props: [],
  },
)
