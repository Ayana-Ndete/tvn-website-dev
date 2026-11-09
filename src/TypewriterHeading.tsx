import { useClientEffect } from "./useClientEffect"

import { defineComponent, shallowRef, computed } from "vue"

import { animate, createScope, createTimeline, stagger } from "animejs"

const messages = [
  {
    lines: ["Systems Africa runs on.", "AI that makes them smarter."],
    hold: 8200,
  },

  { lines: ["Build what’s next.", "Software that delivers."], hold: 5800 },

  { lines: ["Technovation Ventures.", "Your technology partner."], hold: 5800 },
]

export const TypewriterHeading = defineComponent(
  (props: { paused?: boolean }) => {
    const ref = shallowRef<HTMLHeadingElement | null>(null)

    const timelineRef =
      shallowRef<ReturnType<typeof createTimeline> | null | null>(null)

    const pausedRef = computed(() => props.paused ?? false)

    useClientEffect(
      () => {
        const scope = createScope({
          root: ref.value!,

          mediaQueries: { reduce: "(prefers-reduced-motion: reduce)" },
        }).add((self) => {
          if (!self || self.matches.reduce) return

          const panels =
            ref.value!.querySelectorAll<HTMLElement>(".headline-panel")

          const timeline = createTimeline({ loop: true })

          timelineRef.value = timeline

          const overlap = 220

          const exitDur = 300

          let cursor = 0

          panels.forEach((panel, i) => {
            const start = cursor

            const hold = messages[i]!.hold

            cursor += hold

            animate(panel, { opacity: 0, duration: 0 })

            const enter = i === 0 ? start : start - overlap

            timeline

              .add(
                panel,

                {
                  opacity: [0, 1],

                  x: [0, 0],

                  y: [0, 0],

                  duration: exitDur,

                  ease: "out(2)",
                },

                enter,
              )

              .add(
                panel.querySelectorAll(".typing-char"),

                {
                  opacity: [0, 1],

                  y: [10, 0],

                  duration: 180,

                  delay: stagger(14),

                  ease: "out(4)",
                },

                enter + 40,
              )

              .add(
                panel,

                {
                  opacity: [1, 0],

                  x: [0, -18],

                  duration: exitDur,

                  ease: "in(2)",
                },

                start + hold - exitDur,
              )
          })

          let visible = true

          const update = () => {
            if (pausedRef.value || !visible || document.hidden) timeline.pause()
            else timeline.resume()
          }

          const observer = new IntersectionObserver(([entry]) => {
            visible = entry?.isIntersecting ?? false

            update()
          })

          observer.observe(ref.value!)

          document.addEventListener("visibilitychange", update)

          update()

          return () => {
            observer.disconnect()

            document.removeEventListener("visibilitychange", update)

            timelineRef.value = null
          }
        })

        return () => scope.revert()
      },

      () => [],
    )

    useClientEffect(
      () => {
        if (props.paused ?? false) timelineRef.value?.pause()
        else timelineRef.value?.resume()
      },

      () => [props.paused ?? false],
    )

    return () => (
      <h1 ref={ref} class="hero-headline font-display">
        <span class="sr-only">
          We build the systems regulators and enterprises across Africa run on,
          and the AI that makes them smarter.
        </span>
        <span aria-hidden="true" class="headline-stage">
          {messages.map(({ lines: [title, subtitle] }, i) => (
            <span key={title} class={`headline-panel headline-panel-${i}`}>
              {[title!, subtitle!].map((line, j) => (
                <span
                  key={line}
                  class={j === 0 ? "headline-primary" : "headline-secondary"}
                >
                  {line.split(/( )/).map((word, k) =>
                    word === " " ? (
                      <span class="typing-char" key={k}>
                        {" "}
                      </span>
                    ) : (
                      <span class="typing-word" key={k}>
                        {Array.from(word).map((char, n) => (
                          <span class="typing-char" key={n}>
                            {char}
                          </span>
                        ))}
                      </span>
                    ),
                  )}
                </span>
              ))}
            </span>
          ))}
        </span>
      </h1>
    )
  },

  { name: "TypewriterHeading", props: ["paused"] },
)
