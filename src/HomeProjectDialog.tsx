import { defineComponent, shallowRef, type PropType } from "vue"
import { useClientEffect } from "./useClientEffect"
import type { HomeProject } from "./homeProjectData"

export default defineComponent({
  props: {
    project: Object as PropType<HomeProject | null>,
    onDismiss: { type: Function as PropType<() => void>, required: true },
  },
  setup(props) {
    const dialog = shallowRef<HTMLDialogElement | null>(null)
    useClientEffect(
      () => {
        if (!props.project) {
          dialog.value?.close()
          return
        }
        dialog.value?.showModal()
        const previous = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => {
          document.body.style.overflow = previous
        }
      },
      () => [props.project],
    )
    return () => (
      <dialog
        ref={dialog}
        class="px-dialog home-project-dialog"
        aria-labelledby="home-project-title"
        onCancel={() => props.onDismiss()}
        onClose={() => props.onDismiss()}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return
          const box = event.currentTarget.getBoundingClientRect()
          if (
            event.clientX < box.left ||
            event.clientX > box.right ||
            event.clientY < box.top ||
            event.clientY > box.bottom
          )
            props.onDismiss()
        }}
      >
        {props.project && (
          <>
            <button
              class="px-dialog-close"
              aria-label="Close project details"
              onClick={() => props.onDismiss()}
              autofocus
            >
              ✕
            </button>
            <div class="px-dialog-copy">
              <p class="px-kicker">
                {[props.project.year, props.project.category]
                  .filter(Boolean)
                  .join(" / ")}
              </p>
              <h2 id="home-project-title">{props.project.name}</h2>
              <p>{props.project.description}</p>
              {props.project.images.length > 0 && (
                <div class="home-project-images">
                  {props.project.images.map((image) => (
                    <figure key={image.src}>
                      <img src={image.src} alt={image.alt} />
                      <figcaption>{image.alt}</figcaption>
                    </figure>
                  ))}
                </div>
              )}
              <h3>Overview</h3>
              <p>{props.project.overview}</p>
              <h3>Key capabilities / focus areas</h3>
              <ul>
                {props.project.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              {props.project.value && (
                <>
                  <h3>The value</h3>
                  <p>{props.project.value}</p>
                </>
              )}
              <a
                class="px-action"
                href={`mailto:info@technovation.co.ke?subject=${encodeURIComponent(`Project enquiry: ${props.project.name}`)}`}
              >
                Discuss a similar project ↗
              </a>
            </div>
          </>
        )}
      </dialog>
    )
  },
})
