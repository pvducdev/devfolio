import type { HeadConfig } from "@tanstack/react-router";
import { PERSONAL_INFO } from "./personal-info";
import { SITE_CONFIG } from "./site";

export function buildSeoMeta(
  locale: string,
  canonicalUrl: string
): HeadConfig["meta"] {
  return [
    {
      charSet: "utf-8",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    {
      title: SITE_CONFIG.title,
    },
    {
      name: "description",
      content: SITE_CONFIG.description,
    },
    {
      name: "author",
      content: SITE_CONFIG.meta.author,
    },
    {
      name: "keywords",
      content: SITE_CONFIG.meta.keywords.join(", "),
    },
    {
      property: "og:type",
      content: SITE_CONFIG.meta.ogType,
    },
    {
      property: "og:url",
      content: canonicalUrl,
    },
    {
      property: "og:title",
      content: SITE_CONFIG.title,
    },
    {
      property: "og:description",
      content: SITE_CONFIG.description,
    },
    {
      property: "og:image",
      content: SITE_CONFIG.meta.ogImage,
    },
    {
      property: "og:image:width",
      content: SITE_CONFIG.meta.ogImageWidth,
    },
    {
      property: "og:image:height",
      content: SITE_CONFIG.meta.ogImageHeight,
    },
    {
      property: "og:image:alt",
      content: `${PERSONAL_INFO.name} - ${PERSONAL_INFO.role}`,
    },
    {
      property: "og:locale",
      content: locale === "vi" ? "vi_VN" : "en_US",
    },
    {
      property: "og:site_name",
      content: SITE_CONFIG.title,
    },
    {
      name: "twitter:card",
      content: SITE_CONFIG.meta.twitterCard,
    },
    {
      name: "twitter:title",
      content: SITE_CONFIG.title,
    },
    {
      name: "twitter:description",
      content: SITE_CONFIG.description,
    },
    {
      name: "twitter:image",
      content: SITE_CONFIG.meta.ogImage,
    },
    {
      name: "twitter:image:alt",
      content: `${PERSONAL_INFO.name} - ${PERSONAL_INFO.role}`,
    },
  ];
}

export function buildCanonicalLink(canonicalUrl: string): HeadConfig["links"] {
  return [
    {
      rel: "canonical",
      href: canonicalUrl,
    },
  ];
}

export function buildStructuredData(): HeadConfig["scripts"] {
  return [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: PERSONAL_INFO.name,
        alternateName: PERSONAL_INFO.nickname,
        jobTitle: PERSONAL_INFO.role,
        description: SITE_CONFIG.description,
        url: SITE_CONFIG.url,
        image: PERSONAL_INFO.avatar,
        email: PERSONAL_INFO.contact.email,
        address: {
          "@type": "PostalAddress",
          addressLocality: PERSONAL_INFO.location,
        },
        sameAs: [
          PERSONAL_INFO.contact.github,
          PERSONAL_INFO.contact.linkedin,
          PERSONAL_INFO.contact.gitlab,
        ],
      }),
    },
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_CONFIG.title,
        description: SITE_CONFIG.description,
        url: SITE_CONFIG.url,
        author: {
          "@type": "Person",
          name: PERSONAL_INFO.name,
        },
        inLanguage: ["en", "vi"],
      }),
    },
  ];
}
