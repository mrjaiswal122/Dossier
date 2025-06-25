export const siteConfig = {
  name: "Dossier",
  url: process.env.HOME_URL!,
  ogImage: `${process.env.HOME_URL}/og.webp`,
  description:
    "Create stunning portfolio websites without coding. Showcase your work professionally with our intuitive builder.",
  links: {
    twitter: "https://x.com/obviouslyanku",
    github: "https://github.com/mrjaiswal122/dossier",
  },
}

export type SiteConfig = typeof siteConfig