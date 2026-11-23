import { defineComponent } from "vue"
import { NuxtLink } from "#components"
import Navbar from "./Navbar"
import { projects } from "./projectData"

const products = projects.filter(({ id }) => ["technovation-ticketing", "sms-tele", "tradeconnect"].includes(id))

export default defineComponent(() => () => <div class="px-page px-products-page">
  <a class="px-skip" href="#products-list">Skip to products</a>
  <Navbar scrolled />
  <main>
    <section class="px-hero px-wrap" aria-labelledby="products-title"><div><p class="px-kicker"><i /> TECHNOVATION PRODUCTS</p><h1 id="products-title">Tools that keep<br /><span>work moving.</span></h1></div><div class="px-intro"><p>Practical digital products shaped by the real workflows of teams across the region.</p></div></section>
    <section id="products-list" class="px-wrap px-products-overview" aria-labelledby="products-list-title">
      <div class="px-section-title"><div><p class="px-kicker">PRODUCTS</p><h2 id="products-list-title">Made for the work behind the work.</h2></div><p>Explore our growing collection of platforms for support, communication and trade.</p></div>
      <div class="px-product-showcase">{products.map((product, index) => <article key={product.id} class="px-product-showcase-card">
        <div class="px-product-showcase-number">0{index + 1}</div>
        <div class={`px-product-placeholder px-product-placeholder--${product.id}`} aria-label={`${product.title} preview placeholder`} role="img"><span>PRODUCT PREVIEW</span><strong>{product.title}</strong><i /><i /><i /></div>
        <div class="px-product-showcase-copy"><p class="px-kicker">{product.category ?? "Digital product"}</p><h3>{product.title}</h3><p>{product.description ?? "A Technovation product designed for dependable, everyday operations."}</p><NuxtLink to="/contact">Talk to us about this product <span>↗</span></NuxtLink></div>
      </article>)}</div>
    </section>
    <section class="px-wrap px-products-portfolio-link"><p class="px-kicker">LOOKING FOR CLIENT WORK?</p><h2>See our project work<br />across Africa.</h2><NuxtLink to="/projects" class="px-action">Explore the projects map <span>↗</span></NuxtLink></section>
  </main>
</div>, { name: "ProductsPage" })
