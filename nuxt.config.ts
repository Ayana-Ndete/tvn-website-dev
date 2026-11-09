import tailwindcss from "@tailwindcss/vite";

const baseURL = (
  process.env.NUXT_APP_BASE_URL ||
  process.env.CONTEXT_PATH ||
  "/website/"
).replace(/\/?$/, "/");

export default defineNuxtConfig({
  compatibilityDate: "2026-10-04",
  // Keep the established public SPA behaviour while rendering the protected
  // administration area on the server.
  ssr: true,
  devtools: { enabled: false },
  css: [
    "~~/src/navbar.css",
    "~~/src/hero.css",
    "~~/src/services.css",
    "~~/src/projects.css",
    "~~/src/about.css",
    "~~/src/history.css",
    "~~/src/code-centre.css",
    "~~/src/contact.css",
    "~~/src/index.css",
  ],
    runtimeConfig: {
    keycloakIssuer: "",
    keycloakClientId: "",
    keycloakClientSecret: "",
    keycloakAdminRole: "dashboard-admin",
  },
  app: {
    rootId: "root",
    head: {
      htmlAttrs: { lang: "en" },
      title: "Technovation Ventures",
      meta: [
        {
          name: "description",
          content:
            "Software engineering and ICT consulting across East Africa.",
        },
      ],
      link: [
        {
          rel: "icon",
          href: `${baseURL.replace(/\/$/, "")}/brand/technovation-logo.png`,
        },
      ],
    },
    baseURL,
  },
  vite: { plugins: [tailwindcss()] },
  nitro: {
    prerender: {
      routes: [
        "/",
        "/about",
        "/history",
        "/projects",
        "/portfolio",
        "/products",
        "/code-centre",
        "/contact",
        "/thank-you",
      ],
    },
  },
  routeRules: {
    "/**": { ssr: false },
    "/admin/**": { ssr: true },
  },
});
