import {
  defineComponent,
  shallowRef,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue"

import { useRoute } from "#imports"

import { NuxtLink } from "#components"

import logoImage from "./assets/images/brand/technovation-logo.png"

const navLinks = [
  { label: "Home", to: "/", section: "hero" },

  { label: "About", to: "/about", section: "about" },

  { label: "Services", to: "/#services", section: "services" },

  { label: "Projects", to: "/projects", section: "recent-work" },

  { label: "Products", to: "/products", section: "products" },

  { label: "Code Centre", to: "/code-centre", section: "code-centre" },
]

const Arrow = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M2 8h11M9 4l4 4-4 4"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
)

const MenuIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    aria-hidden="true"
  >
    <line
      x1="2"
      y1="6"
      x2="20"
      y2="6"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
    <line
      x1="2"
      y1="11"
      x2="20"
      y2="11"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
    <line
      x1="2"
      y1="16"
      x2="20"
      y2="16"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
)

const CloseIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    aria-hidden="true"
  >
    <line
      x1="3"
      y1="3"
      x2="19"
      y2="19"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
    <line
      x1="19"
      y1="3"
      x2="3"
      y2="19"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
)

export default defineComponent({
  name: "Navbar",

  props: {
    tone: { type: String, default: "dark" },

    scrolled: Boolean,

    activeSection: { type: String, default: "" },

    homeIcons: Boolean,

    visionLayout: Boolean,
  },

  setup(props) {
    const route = useRoute()

    const open = shallowRef(false)

    const toggle = shallowRef<HTMLButtonElement | null>(null)

    const close = () => {
      open.value = false
    }

    watch(() => route.fullPath, close)

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open.value) {
        close()

        toggle.value?.focus()
      }
    }

    let desktop: MediaQueryList | undefined

    const onResize = () => {
      if (desktop?.matches) close()
    }

    onMounted(() => {
      desktop = window.matchMedia("(min-width: 1024px)")

      desktop.addEventListener("change", onResize)

      window.addEventListener("keydown", onKey)
    })

    onBeforeUnmount(() => {
      desktop?.removeEventListener("change", onResize)

      window.removeEventListener("keydown", onKey)
    })

    const links = (mobile = false) => (
      <>
        {(props.visionLayout
          ? [
              { label: "Home", to: "/#hero", section: "hero" },

              { label: "Services", to: "/#services", section: "services" },

              { label: "AI & Agents", to: "/#ai", section: "ai" },

              { label: "Our Work", to: "/#work", section: "work" },

              { label: "Our Journey", to: "/#journey", section: "journey" },

              { label: "About", to: "/#about", section: "about" },
            ]
          : navLinks
        ).map((item) => (
          <NuxtLink
            key={item.to}
            to={item.to}
            class="nav-link"
            onClick={close}
            aria-current={
              props.activeSection
                ? props.activeSection === item.section
                  ? "location"
                  : undefined
                : route.path === item.to
                  ? "page"
                  : undefined
            }
          >
            {item.label}
            {mobile && props.homeIcons && <Arrow />}
          </NuxtLink>
        ))}
        {!mobile && <span class="nav-divider" aria-hidden="true" />}
        <NuxtLink to="/contact" class="nav-contact" onClick={close}>
          Let’s talk <Arrow />
        </NuxtLink>
      </>
    )

    return () => (
      <header
        class={`site-nav site-nav-${props.tone} ${
          props.scrolled ? "site-nav-scrolled" : ""
        } ${open.value ? "site-nav-open" : ""}`}
      >
        <div class="nav-inner">
          <NuxtLink
            to="/"
            class="nav-brand"
            aria-label="Technovation Ventures — home"
            onClick={close}
          >
            <span class="nav-logo">
              <img
                src={logoImage}
                width="34"
                height="34"
                alt=""
                class={
                  props.homeIcons
                    ? "shrink-0 object-contain bg-white rounded-sm"
                    : undefined
                }
              />
            </span>
            <span class="nav-wordmark font-display">
              Technovation<span>Ventures</span>
            </span>
          </NuxtLink>
          <nav class="nav-desktop" aria-label="Primary navigation">
            {links()}
          </nav>
          <button
            ref={toggle}
            class="nav-toggle"
            aria-expanded={open.value}
            aria-controls="mobile-navigation"
            aria-label={open.value ? "Close menu" : "Open menu"}
            onClick={() => {
              open.value = !open.value
            }}
          >
            {props.homeIcons ? (
              open.value ? (
                <CloseIcon />
              ) : (
                <MenuIcon />
              )
            ) : open.value ? (
              "✕"
            ) : (
              "☰"
            )}
          </button>
        </div>
        {open.value && (
          <nav
            id="mobile-navigation"
            class="nav-mobile"
            aria-label="Mobile navigation"
          >
            {links(true)}
          </nav>
        )}
      </header>
    )
  },
})
