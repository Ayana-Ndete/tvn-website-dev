import Navbar from "./Navbar"
import { defineComponent, nextTick, onMounted, onUnmounted, shallowRef, watch } from "vue"
import { useRoute } from "#imports"
import { useClientEffect } from "./useClientEffect"
import { NuxtLink } from "#components"
import { projects, type Project } from "./projectData"

const priorityProjectIds = ["sarit-belong", "dtic-ntb", "zfda-irmis", "eac-sps"]
const featuredProjects = priorityProjectIds.map((id) => projects.find((project) => project.id === id)).filter((project): project is Project => Boolean(project))
const otherProjects = projects.filter((project) => !priorityProjectIds.includes(project.id)).slice(0, 6)

const ProjectIcon = ({ category = "" }: { category?: string }) => {
  const stroke = { fill: "none", stroke: "currentColor", "stroke-width": "1.5", "stroke-linecap": "round" as const, "stroke-linejoin": "round" as const }
  if (category.includes("Regulatory")) return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...stroke} d="M12 3 20 7v5c0 5-3.4 7.8-8 9-4.6-1.2-8-4-8-9V7l8-4Z" /><path {...stroke} d="m8.5 12 2.2 2.2 4.7-4.7" /></svg>
  if (category.includes("Trade")) return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...stroke} d="M4 7h12M12 3l4 4-4 4M20 17H8m4 4-4-4 4-4" /></svg>
  if (category.includes("Customer")) return <svg viewBox="0 0 24 24" aria-hidden="true"><circle {...stroke} cx="12" cy="8" r="3" /><path {...stroke} d="M5 21c.7-4 3.1-6 7-6s6.3 2 7 6M19 4v5M21.5 6.5h-5" /></svg>
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect {...stroke} x="4" y="4" width="16" height="16" rx="3" /><path {...stroke} d="M8 9h8M8 13h5M8 17h3" /></svg>
}

const AnimatedLetters = ({ text, className = "" }: { text: string; className?: string }) => (
  <span class={`hero-letter-line ${className}`} aria-label={text}>{[...text].map((letter, index) => <span aria-hidden="true" class="hero-letter" style={{ "--letter-delay": `${index * 28}ms` }} key={`${letter}-${index}`}>{letter === " " ? "\u00a0" : letter}</span>)}</span>
)

export default defineComponent((props) => {
  const expanded = shallowRef<string | null>(null)
  const page = shallowRef<HTMLDivElement | null>(null)
  const route = useRoute()
  const openFromHash = (hash: string) => {
    const match = hash.match(/^#case-study-(.+)$/)
    const project = match && featuredProjects.find((item) => item.id === match[1])
    expanded.value = project ? project.id : null
    if (project) {
      void nextTick(() => {
        requestAnimationFrame(() => document.getElementById(`case-study-${project.id}`)?.scrollIntoView({ block: "start" }))
      })
    }
  }
  const openCaseStudy = (projectId: string) => {
    // This stays entirely in Vue state. Changing the location fragment here
    // can cause a route/navigation race in some browser deployments.
    expanded.value = projectId
    void nextTick(() => {
      requestAnimationFrame(() => document.getElementById(`case-study-${projectId}`)?.scrollIntoView({ block: "start" }))
    })
  }
  const closeCaseStudy = () => {
    expanded.value = null
  }
  const handlePopState = () => openFromHash(window.location.hash)
  const scrollToFeaturedWork = (event?: MouseEvent) => {
    event?.preventDefault()
    document.getElementById("featured-work")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }
  watch(() => route.hash, openFromHash, { immediate: true })
  onMounted(() => {
    window.addEventListener("popstate", handlePopState)
    if (route.hash === "#featured-work") {
      void nextTick(() => requestAnimationFrame(() => scrollToFeaturedWork()))
    }
  })
  onUnmounted(() => window.removeEventListener("popstate", handlePopState))
  useClientEffect(() => {
    const targets = page.value?.querySelectorAll<HTMLElement>(".work-reveal")
    if (!targets?.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target) }
    }), { threshold: .16, rootMargin: "0px 0px -6% 0px" })
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, () => [])
  const renderProject = (project: Project, index: number) => {
    const open = expanded.value === project.id
    const caseStudyId = `case-study-${project.id}`
    const detailsId = `work-details-${project.id}`
    const hasCaseStudy = Boolean(project.overview || project.role || project.scope?.length || project.outputs?.length || project.screenshots?.length)
    return <article id={caseStudyId} class={{ "work-case": true, "work-case-reverse": index % 2 === 1, "work-reveal": true, "is-open": open }} key={project.id}>
      <div class="work-case-visual">{project.image && <img src={project.image} alt={project.imageAlt ?? project.title} loading={index > 1 ? "lazy" : undefined} />}<span class="work-case-index">0{index + 1}</span><span class="work-case-icon"><ProjectIcon category={project.category} /></span>{project.status && <span class="work-case-status"><i /> {project.status === "Live" ? "Live system" : project.status}</span>}</div>
      <div class="work-case-copy"><p class="work-case-meta">{[project.category, project.place, project.year].filter(Boolean).join(" / ")}</p><h3>{project.title}</h3><p>{project.description}</p>{project.tags && <div class="work-case-tags">{project.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>}{hasCaseStudy && (open ? <button type="button" class="work-case-toggle" aria-expanded="true" aria-controls={detailsId} onClick={closeCaseStudy}>Close case study<b>−</b></button> : <button type="button" class="work-case-toggle" aria-expanded="false" aria-controls={detailsId} onClick={() => openCaseStudy(project.id)}>View case study<b>↗</b></button>)}{open && <section class="work-case-details" id={detailsId} tabindex="-1"><div><p class="work-detail-label">The brief</p><p>{project.overview ?? project.description}</p></div>{project.role && <div><p class="work-detail-label">Our role</p><p>{project.role}</p></div>}{project.scope && <div><p class="work-detail-label">Scope</p><ul class="work-detail-list">{project.scope.map((item) => <li key={item}>{item}</li>)}</ul></div>}{project.outputs && <div><p class="work-detail-label">Outputs</p><ul class="work-detail-list">{project.outputs.map((item) => <li key={item}>{item}</li>)}</ul></div>}{project.screenshots && <div class="work-shots">{project.screenshots.map((shot) => <figure key={shot.label}><img src={shot.src} alt={`${project.title} — ${shot.label}`} /><figcaption>{shot.label}</figcaption></figure>)}</div>}<NuxtLink to="/contact" class="work-case-contact">Discuss a similar system <b>→</b></NuxtLink></section>}</div>
    </article>
  }
  return () => <div ref={page} class={{ "px-page": true, "px-portfolio-page": true, "work-page": true, "work-experience": true, "work-embedded": props.embedded }}>
    {!props.embedded && <Navbar scrolled activeSection="work" />}
    <main>
      {!props.embedded && <section class="work-hero" aria-labelledby="projects-title"><div class="work-hero-grid" aria-hidden="true" /><div class="work-hero-glow" aria-hidden="true" /><div class="px-wrap work-hero-layout"><div class="work-hero-inner"><p class="work-eyebrow">Our work / deployed systems</p><h1 id="projects-title"><AnimatedLetters text="Technology " className="is-white" /><AnimatedLetters text="that" className="is-deep-blue" /><br /><AnimatedLetters text="works" className="is-white" /><br /><AnimatedLetters text="where it matters." className="is-deep-blue" /></h1><p class="work-hero-summary">Built for Africa.</p><a class="hero-scroll-link" href="#featured-work" onClick={scrollToFeaturedWork}><span>Explore work</span><b aria-hidden="true">↓</b></a></div></div></section>}
      <section id="featured-work" class="work-collection" aria-label="Selected case studies"><div class="work-case-list">{featuredProjects.map((project, index) => renderProject(project, index))}</div></section>
      <section class="work-more" aria-labelledby="more-work-title"><div class="px-wrap"><header class="work-heading work-reveal"><div><p class="work-eyebrow">More delivery</p><h2 id="more-work-title">Built across<br /><span>the region.</span></h2></div></header><div class="work-mini-grid">{otherProjects.map((project, index) => <article class="work-reveal" style={{ "--reveal-delay": `${index * 75}ms` }} key={project.id}><span><ProjectIcon category={project.category} /></span><p>{project.category ?? "Digital platform"}</p><h3>{project.title}</h3><small>{project.place ?? project.group}</small></article>)}</div></div></section>
      {!props.embedded && <section class="work-cta"><div class="px-wrap"><p class="work-eyebrow">Your next system</p><h2>Have a complex process<br />worth <span>making simpler?</span></h2><NuxtLink to="/contact">Talk to our team <b>→</b></NuxtLink></div></section>}
    </main>
  </div>
}, { name: "ProjectsPage", props: { embedded: { type: Boolean, default: false } } })
