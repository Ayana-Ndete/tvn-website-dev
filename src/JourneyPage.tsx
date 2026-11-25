import Navbar from "./Navbar"
import HistoryPage from "./HistoryPage"
import "./journey-blue.css"
import { defineComponent, shallowRef } from "vue"
import { useClientEffect } from "./useClientEffect"

export default defineComponent(() => {
  const scrolled = shallowRef(false)
  useClientEffect(() => {
    document.title = "Our Journey — Technovation Ventures"
    const update = () => { scrolled.value = window.scrollY > 32 }
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, () => [])

  return () => <div class="journey-page">
    <Navbar tone="archive" scrolled={scrolled.value} activeSection="journey" />
    <main><HistoryPage /></main>
  </div>
}, { name: "JourneyPage" })
