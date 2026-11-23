import { useClientEffect } from "./useClientEffect"
import { defineComponent, shallowRef, computed } from "vue"
import { animate, createScope, onScroll, stagger } from "animejs"
export const HeroArtwork = defineComponent(
  (props: { paused: boolean }) => {
    const ref = shallowRef<HTMLDivElement | null>(null)
    const floating = shallowRef<ReturnType<typeof animate>[]>([])
    const pausedRef = computed(() => props.paused)
    useClientEffect(
      () => {
        const scope = createScope({
          root: ref.value!,
          mediaQueries: {
            reduce: "(prefers-reduced-motion: reduce)",
            mobile: "(max-width: 767px)",
          },
        }).add((self) => {
          if (!self || self.matches.reduce) return
          const hero = ref.value!.closest<HTMLElement>("#hero")!
          const objects = Array.from(
            ref.value!.querySelectorAll<HTMLElement>(".hero-object"),
          )
          const drifts = [
            animate(".signal-packet", {
              strokeDashoffset: [240, 0],
              duration: 4500,
              delay: stagger(480),
              loop: true,
              ease: "linear",
            }),
            animate(".network-node", {
              opacity: [0.35, 1],
              duration: 2200,
              delay: stagger(190),
              alternate: true,
              loop: true,
              ease: "inOutSine",
            }),
            animate(".network-plane-back", {
              y: [-5, 7],
              duration: 6400,
              alternate: true,
              loop: true,
              ease: "inOutSine",
            }),
          ]
          floating.value = drifts
          const scroll = onScroll({
            target: hero,
            enter: "top top",
            leave: "top bottom",
            sync: true,
          })
          animate(ref.value!, {
            y: [0, self.matches.mobile ? 35 : 100],
            ease: "linear",
            autoplay: scroll,
          })
          const pointers = objects.map((object) =>
            animate(object, { x: 0, y: 0, duration: 1 }),
          )
          const move = (event: PointerEvent) => {
            if (
              event.pointerType !== "mouse" ||
              pausedRef.value ||
              self.matches.mobile
            )
              return
            const box = hero.getBoundingClientRect()
            objects.forEach((object, i) => {
              pointers[i]?.pause()
              const depth = (i % 2 ? -1 : 1) * (16 + i * 5)
              pointers[i] = animate(object, {
                x: ((event.clientX - box.left) / box.width - 0.5) * depth,
                y: ((event.clientY - box.top) / box.height - 0.5) * depth,
                rotateY: ((event.clientX - box.left) / box.width - 0.5) * 3,
                rotateX: ((event.clientY - box.top) / box.height - 0.5) * -2,
                duration: 900,
                ease: "out(3)",
              })
            })
          }
          const reset = () =>
            objects.forEach((object, i) => {
              pointers[i]?.pause()
              pointers[i] = animate(object, {
                x: 0,
                y: 0,
                rotateX: 0,
                rotateY: 0,
                duration: 700,
                ease: "out(3)",
              })
            })
          let visible = true
          const update = () =>
            drifts.forEach((animation) =>
              pausedRef.value || !visible || document.hidden
                ? animation.pause()
                : animation.resume(),
            )
          const observer = new IntersectionObserver(([entry]) => {
            visible = entry?.isIntersecting ?? false
            update()
          })
          observer.observe(hero)
          update()
          hero.addEventListener("pointermove", move)
          hero.addEventListener("pointerleave", reset)
          document.addEventListener("visibilitychange", update)
          return () => {
            pointers.forEach((animation) => animation.revert())
            floating.value = []
            observer.disconnect()
            hero.removeEventListener("pointermove", move)
            hero.removeEventListener("pointerleave", reset)
            document.removeEventListener("visibilitychange", update)
          }
        })
        return () => scope.revert()
      },
      () => [],
    )
    useClientEffect(
      () => {
        floating.value.forEach((animation) =>
          props.paused ? animation.pause() : animation.resume(),
        )
      },
      () => [props.paused],
    )
    return () => (
      <div
        ref={ref}
        class={`hero-artwork ${props.paused ? "is-paused" : ""}`}
        aria-hidden="true"
      >
        <div class="hero-object network-object">
          <svg class="network-drawing" viewBox="0 0 700 700" fill="none">
            <defs>
              <linearGradient id="cube-left" x1="0" y1="0" x2="1" y2="1">
                <stop stop-color="#123249" />
                <stop offset="1" stop-color="#0c253a" />
              </linearGradient>
              <linearGradient id="cube-right" x1="0" y1="0" x2="1" y2="1">
                <stop stop-color="#112f46" />
                <stop offset="1" stop-color="#0c253a" />
              </linearGradient>
              <linearGradient id="cube-top" x1="0" y1="0" x2="0" y2="1">
                <stop stop-color="#285ba0" />
                <stop offset="1" stop-color="#204c88" />
              </linearGradient>
              <filter
                id="cube-edge-glow"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feGaussianBlur stdDeviation="1.5" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <symbol id="cube-brand-mark" viewBox="0 0 48 52">
                <g
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3.5"
                  stroke-linejoin="miter"
                >
                  <path d="M28 3H3V23H14" />
                  <circle cx="19" cy="23" r="4.5" />
                  <path
                    class="cube-mark-secondary"
                    d="M35 3H45V23H33V36M35 3V15H27V27"
                  />
                  <path d="M14 32V47H29" />
                  <circle cx="34" cy="47" r="4.5" />
                </g>
              </symbol>
            </defs>
            <g class="network-plane-back" stroke="#477599" stroke-width="1">
              {[0, 1, 2, 3, 4].map((i) => (
                <path
                  key={i}
                  d={`M${90 + i * 28} ${275 - i * 16} 420 ${85 + i * 32} 655 ${220 + i * 32} 325 ${410 + i * 32}Z`}
                  opacity={0.15 + i * 0.08}
                />
              ))}
            </g>
            <g stroke="#6998bf" stroke-width="1" opacity=".4">
              <path d="m75 360 260-150 280 162-260 150Z" />
              <path d="m75 360 0 92 280 162 260-150v-92M355 522v92M335 210v-94" />
              <path d="m145 400 260-150m-190 190 260-150m-190 190 260-150M145 320l280 162m-210-202 280 162m-210-202 280 162" />
            </g>
            <g stroke="#5B9BFF" stroke-width="2">
              <path d="m145 320 140 81 120-69 140 81" opacity=".3" />
              <path
                class="signal-packet"
                d="m145 320 140 81 120-69 140 81"
                stroke-dasharray="30 210"
              />
              <path
                class="signal-packet"
                d="m215 280 140 81v161"
                stroke-dasharray="30 210"
              />
              <path
                class="signal-packet"
                d="m75 452 280 162 260-150"
                stroke-dasharray="30 210"
              />
            </g>
            <g
              class="cube-connections"
              fill="none"
              stroke="#8bb9ff"
              stroke-width="1.5"
              stroke-dasharray="5 8"
              opacity=".9"
            >
              <path d="M145 320 355 279" />
              <path d="M545 413 355 279" />
              <path d="M355 614 355 279" />
            </g>
            {[
              [145, 320],
              [285, 401],
              [405, 332],
              [545, 413],
              [355, 361],
              [355, 522],
              [75, 452],
              [355, 614],
              [615, 464],
            ].map(([x, y], i) => (
              <g class="network-node" key={i}>
                <circle cx={x} cy={y} r="9" fill="#5B9BFF" opacity=".12" />
                <circle
                  cx={x}
                  cy={y}
                  r="3"
                  fill={i % 2 ? "#d9e9f4" : "#5B9BFF"}
                />
              </g>
            ))}
            <g class="technovation-cube" stroke-linejoin="round">
              <ellipse
                cx="355"
                cy="435"
                rx="104"
                ry="26"
                fill="#020b17"
                opacity=".35"
              />
              <path
                d="m259 397 96 56 96-56"
                stroke="#3989ff"
                stroke-width="2"
                opacity=".3"
              />
              <g class="cube-face cube-face-left">
                <path
                  d="m273 302 82 48v94l-82-48Z"
                  fill="url(#cube-left)"
                  stroke="#0866ff"
                  stroke-width="1.5"
                />
                <g transform="matrix(.82 .48 0 .94 273 302)">
                  <path
                    d="M9 10H91V90H9Z"
                    fill="none"
                    stroke="#0866ff"
                    stroke-width="2"
                    filter="url(#cube-edge-glow)"
                  />
                  <use
                    href="#cube-brand-mark"
                    x="20"
                    y="17"
                    width="60"
                    height="66"
                    class="cube-mark cube-mark-dark"
                  />
                </g>
                <path
                  class="cube-edge-trail"
                  pathLength="100"
                  d="M273 302 273 396 355 444 355 350"
                  fill="none"
                  stroke="#80b8ff"
                  stroke-width="2"
                  stroke-linecap="round"
                  filter="url(#cube-edge-glow)"
                />
              </g>
              <g class="cube-face cube-face-right">
                <path
                  d="m355 350 82-48v94l-82 48Z"
                  fill="url(#cube-right)"
                  stroke="#0866ff"
                  stroke-width="1.5"
                />
                <g transform="matrix(.82 -.48 0 .94 355 350)">
                  <path
                    d="M9 10H91V90H9Z"
                    fill="none"
                    stroke="#0866ff"
                    stroke-width="2"
                    filter="url(#cube-edge-glow)"
                  />
                  <use
                    href="#cube-brand-mark"
                    x="20"
                    y="17"
                    width="60"
                    height="66"
                    class="cube-mark cube-mark-dark"
                  />
                </g>
                <path
                  class="cube-edge-trail"
                  pathLength="100"
                  d="M355 444 437 396 437 302 355 350"
                  fill="none"
                  stroke="#80b8ff"
                  stroke-width="2"
                  stroke-linecap="round"
                  filter="url(#cube-edge-glow)"
                />
              </g>
              <g class="cube-face cube-face-top">
                <path
                  d="m273 302 82-48 82 48-82 48Z"
                  fill="url(#cube-top)"
                  stroke="#3973bc"
                  stroke-width="1.8"
                />
                <g transform="matrix(.82 .48 -.82 .48 355 254)">
                  <path
                    d="M8 8H92V92H8Z"
                    fill="#ffffff"
                    stroke="#285ba0"
                    stroke-width="2.5"
                  />
                  <use
                    href="#cube-brand-mark"
                    x="20"
                    y="17"
                    width="60"
                    height="66"
                    class="cube-mark cube-mark-white"
                  />
                </g>
                <path
                  class="cube-edge-trail"
                  pathLength="100"
                  d="M437 302 355 254 273 302 355 350"
                  fill="none"
                  stroke="#80b8ff"
                  stroke-width="2"
                  stroke-linecap="round"
                  filter="url(#cube-edge-glow)"
                />
              </g>
            </g>
            <g class="cube-convergence" transform="translate(355 350)">
              <circle
                class="cube-burst-ring"
                r="8"
                fill="none"
                stroke="#80b8ff"
                stroke-width="1.5"
              />
              <circle
                class="cube-charge"
                r="5"
                fill="#b9dcff"
                filter="url(#cube-edge-glow)"
              />
            </g>
            <g stroke="#6b8ca5" opacity=".35">
              <path d="M70 170h22m-11-11v22M585 560h22m-11-11v22M560 125h22m-11-11v22" />
            </g>
          </svg>
        </div>
      </div>
    )
  },
  { name: "HeroArtwork", props: ["paused"] },
)
