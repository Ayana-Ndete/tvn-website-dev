import { useClientEffect } from "./useClientEffect"

import { type Ref } from "vue"

import { animate, createScope, onScroll, stagger } from "animejs"

export function usePageMotion(root: Ref<HTMLDivElement | null>) {
  useClientEffect(
    () => {
      if (!root.value) return

      const scope = createScope({
        root: root.value,

        mediaQueries: {
          reduce: "(prefers-reduced-motion: reduce)",

          mobile: "(max-width: 767px)",
        },
      }).add((self) => {
        if (!self || self.matches.reduce) return

        const element = root.value!

        const observers: ReturnType<typeof onScroll>[] = []

        element

          .querySelectorAll<HTMLElement>("[data-reveal]")

          .forEach((card) => {
            const index = Array.from(card.parentElement!.children).indexOf(card)

            const observer = onScroll({
              target: card,

              enter: "92% top",

              leave: "top bottom",

              sync: "play none play reverse",
            })

            observers.push(observer)

            animate(card, {
              opacity: [0, 1],

              y: [self.matches.mobile ? 30 : 55, 0],

              duration: 900,

              delay: (index % (self.matches.mobile ? 2 : 3)) * 90,

              ease: "out(4)",

              autoplay: observer,
            })
          })

        const engineeringPreview = element.querySelector<HTMLElement>(
          ".engineering-preview",
        )

        if (engineeringPreview) {
          const reveal = onScroll({
            target: engineeringPreview,

            enter: "bottom top",

            leave: "55% top",

            sync: true,
          })

          observers.push(reveal)

          animate(".engineering-preview-inner", {
            scale: [self.matches.mobile ? 0.95 : 0.9, 1],

            y: [55, 0],

            opacity: [0.3, 1],

            ease: "out(3)",

            autoplay: reveal,
          })
        }

        animate(".hero-intro", {
          opacity: [0, 1],

          y: [20, 0],

          duration: 900,

          delay: stagger(140),

          ease: "out(4)",
        })

        element

          .querySelectorAll<HTMLElement>(".stat-reel")

          .forEach((reel, i) => {
            const digit = Number(reel.dataset.digit)

            const observer = onScroll({
              target: reel.closest(".stat-card") as HTMLElement,

              enter: "90% top",

              leave: "top bottom",

              sync: "play none play reverse",
            })

            observers.push(observer)

            animate(reel, {
              translateY: ["0%", `-${(10 + digit) * 5}%`],

              duration: 2100,

              delay: i * 90,

              ease: "out(5)",

              autoplay: observer,
            })
          })

        const portfolio = element.querySelector<HTMLElement>("#recent-work")!

        if (portfolio) {
          const backgroundScroll = onScroll({
            target: portfolio,

            enter: "bottom top",

            leave: "top bottom",

            sync: true,
          })

          observers.push(backgroundScroll)

          animate(".portfolio-glow", {
            x: ["-18%", "20%"],

            y: ["-12%", "18%"],

            rotate: [-15, 18],

            scale: [0.95, 1.2],

            ease: "linear",

            autoplay: backgroundScroll,
          })

          const lineScroll = onScroll({
            target: portfolio,

            enter: "bottom top",

            leave: "top bottom",

            sync: true,
          })

          observers.push(lineScroll)

          animate(".portfolio-lines", {
            y: [-80, 100],

            rotate: [-8, 5],

            ease: "linear",

            autoplay: lineScroll,
          })
        }

        element

          .querySelectorAll<HTMLElement>(".project-photo")

          .forEach((photo) => {
            const observer = onScroll({
              target: photo,

              enter: "bottom top",

              leave: "top bottom",

              sync: true,
            })

            observers.push(observer)

            animate(photo.querySelector(".project-image")!, {
              y: ["-6%", "6%"],

              scale: [1.12, 1.2],

              ease: "linear",

              autoplay: observer,
            })
          })

        if (element.querySelector(".partner-track")) {
          const partnerScroll = onScroll({
            target: element.querySelector<HTMLElement>("#at-a-glance, #about")!,

            enter: "bottom top",

            leave: "top bottom",

            sync: true,
          })

          observers.push(partnerScroll)

          animate(".partner-track", {
            translateX: ["-50%", "0%"],

            ease: "linear",

            autoplay: partnerScroll,
          })
        }

        element

          .querySelectorAll<HTMLElement>(".service-icon")

          .forEach((icon) => {
            const observer = onScroll({
              target: icon,

              enter: "90% top",

              leave: "top bottom",

              sync: "play none play reverse",
            })

            observers.push(observer)

            animate(icon.querySelector("svg")!, {
              opacity: [0, 1],

              scale: [0.75, 1],

              rotate: [-12, 0],

              duration: 900,

              ease: "out(4)",

              autoplay: observer,
            })
          })

        // Hover/touch response animates inner assets so it never fights the card's scroll transform.

        const cleanups: Array<() => void> = []

        element

          .querySelectorAll<HTMLElement>(
            ".partner-card, button:not(.hero-button)",
          )

          .forEach((card) => {
            const target = card.querySelector<HTMLElement>(".partner-logo, svg")

            if (!target) return

            let animation: ReturnType<typeof animate> | undefined

            const move = (active: boolean) => {
              animation?.pause()

              animation = animate(target, {
                scale: active ? 1.08 : 1,

                rotate:
                  active && card.classList.contains("partner-card") ? -3 : 0,

                duration: 400,

                ease: "out(3)",
              })
            }

            const enter = () => move(true)

            const leave = () => move(false)

            card.addEventListener("pointerenter", enter)

            card.addEventListener("pointerleave", leave)

            card.addEventListener("pointerdown", enter)

            card.addEventListener("pointerup", leave)

            card.addEventListener("pointercancel", leave)

            card.addEventListener("focusin", enter)

            card.addEventListener("focusout", leave)

            cleanups.push(() => {
              animation?.revert()

              card.removeEventListener("pointerenter", enter)

              card.removeEventListener("pointerleave", leave)

              card.removeEventListener("pointerdown", enter)

              card.removeEventListener("pointerup", leave)

              card.removeEventListener("pointercancel", leave)

              card.removeEventListener("focusin", enter)

              card.removeEventListener("focusout", leave)
            })
          })

        element

          .querySelectorAll<HTMLElement>(".hero-button")

          .forEach((button) => {
            let motion: ReturnType<typeof animate> | undefined

            const original = button.getAttribute("style")

            const move = (x: number, y: number, scale: number) => {
              motion?.pause()

              motion = animate(button, {
                x,

                y,

                scale,

                duration: 350,

                ease: "out(4)",
              })
            }

            const hover = (event: PointerEvent) => {
              if (event.pointerType !== "mouse") return

              const box = button.getBoundingClientRect()

              move(
                (event.clientX - box.left - box.width / 2) * 0.07,

                (event.clientY - box.top - box.height / 2) * 0.15 - 3,

                1.025,
              )
            }

            const reset = () => move(0, 0, 1)

            const press = () => move(0, 1, 0.96)

            const focus = () => move(0, -3, 1.025)

            button.addEventListener("pointermove", hover)

            button.addEventListener("pointerleave", reset)

            button.addEventListener("pointerdown", press)

            button.addEventListener("pointerup", reset)

            button.addEventListener("pointercancel", reset)

            button.addEventListener("focus", focus)

            button.addEventListener("blur", reset)

            cleanups.push(() => {
              motion?.revert()

              if (original === null) button.removeAttribute("style")
              else button.setAttribute("style", original)

              button.removeEventListener("pointermove", hover)

              button.removeEventListener("pointerleave", reset)

              button.removeEventListener("pointerdown", press)

              button.removeEventListener("pointerup", reset)

              button.removeEventListener("pointercancel", reset)

              button.removeEventListener("focus", focus)

              button.removeEventListener("blur", reset)
            })
          })

        let cancelled = false

        void document.fonts.ready.then(() => {
          if (!cancelled)
            observers.forEach((observer) => {
              if (observer.target && !observer.reverted) observer.refresh()
            })
        })

        return () => {
          cancelled = true

          cleanups.forEach((cleanup) => cleanup())
        }
      })

      return () => scope.revert()
    },

    () => [root],
  )
}
