import { defineComponent, shallowRef } from "vue"
import { NuxtLink } from "#components"
import Navbar from "./Navbar"
import { useClientEffect } from "./useClientEffect"

const Checkmark = () => <svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="1.5" /><path d="m15.5 24.5 5.6 5.6 11.8-12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>

export default defineComponent({
  name: "ThankYouPage",
  setup() {
    const scrolled = shallowRef(false)
    useClientEffect(() => {
      document.title = "Enquiry received — Technovation Ventures"
      const update = () => { scrolled.value = window.scrollY > 32 }
      update()
      window.addEventListener("scroll", update, { passive: true })
      return () => window.removeEventListener("scroll", update)
    }, () => [])
    return () => <div class="thank-you-page">
      <Navbar scrolled={scrolled.value} homeIcons visionLayout />
      <main class="thank-you-main"><section class="thank-you-card" aria-labelledby="thank-you-title">
        <div class="thank-you-mark"><Checkmark /></div><p class="thank-you-eyebrow">Enquiry received</p>
        <h1 id="thank-you-title">Thanks for reaching out.</h1>
        <p class="thank-you-message">Your project details are safely with our team. We’ll review them and get back to you shortly.</p>
        <div class="thank-you-next"><span>What happens next</span><p>One of our specialists will be in touch to learn more about your goals and discuss the best way forward.</p></div>
        <div class="thank-you-actions"><NuxtLink to="/" class="thank-you-primary">Back to home <span aria-hidden="true">→</span></NuxtLink><NuxtLink to="/contact" class="thank-you-secondary">Send another enquiry</NuxtLink></div>
      </section></main>
      <footer class="thank-you-footer">© 2026 Technovation Ventures Ltd. All rights reserved.</footer>
    </div>
  },
})
