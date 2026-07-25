import type { JSX } from "react";

import { PERSONAL_INFO } from "./personal-info";
import { SITE_CONFIG } from "./site";

type MetaTag = JSX.IntrinsicElements["meta"];

const ogTag = (property: string, content: string): MetaTag =>
  ({ content, property }) as MetaTag;

export const buildSeoMeta = (
  locale: string,
  canonicalUrl: string
): MetaTag[] => [
  {
    charSet: "utf8",
  },
  {
    content: "width=device-width, initial-scale=1, viewport-fit=cover",
    name: "viewport",
  },
  {
    title: SITE_CONFIG.title,
  },
  {
    content: SITE_CONFIG.description,
    name: "description",
  },
  {
    content: SITE_CONFIG.meta.author,
    name: "author",
  },
  {
    content: SITE_CONFIG.meta.keywords.join(", "),
    name: "keywords",
  },
  ogTag("og:type", SITE_CONFIG.meta.ogType),
  ogTag("og:url", canonicalUrl),
  ogTag("og:title", SITE_CONFIG.title),
  ogTag("og:description", SITE_CONFIG.description),
  ogTag("og:image", SITE_CONFIG.meta.ogImage),
  ogTag("og:image:width", SITE_CONFIG.meta.ogImageWidth),
  ogTag("og:image:height", SITE_CONFIG.meta.ogImageHeight),
  ogTag("og:image:alt", `${PERSONAL_INFO.name} - ${PERSONAL_INFO.role}`),
  ogTag("og:locale", locale === "vi" ? "vi_VN" : "en_US"),
  ogTag("og:site_name", SITE_CONFIG.title),
  {
    content: SITE_CONFIG.meta.twitterCard,
    name: "twitter:card",
  },
  {
    content: SITE_CONFIG.title,
    name: "twitter:title",
  },
  {
    content: SITE_CONFIG.description,
    name: "twitter:description",
  },
  {
    content: SITE_CONFIG.meta.ogImage,
    name: "twitter:image",
  },
  {
    content: `${PERSONAL_INFO.name} - ${PERSONAL_INFO.role}`,
    name: "twitter:image:alt",
  },
];

export const buildCanonicalLink = (canonicalUrl: string) => [
  {
    href: canonicalUrl,
    rel: "canonical",
  },
];

export const buildStructuredData = () => [
  {
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      address: {
        "@type": "PostalAddress",
        addressLocality: PERSONAL_INFO.location,
      },
      alternateName: PERSONAL_INFO.nickname,
      description: SITE_CONFIG.description,
      email: PERSONAL_INFO.contact.email,
      image: PERSONAL_INFO.avatar,
      jobTitle: PERSONAL_INFO.role,
      name: PERSONAL_INFO.name,
      sameAs: [
        PERSONAL_INFO.contact.github,
        PERSONAL_INFO.contact.linkedin,
        PERSONAL_INFO.contact.gitlab,
      ],
      url: SITE_CONFIG.url,
    }),
    type: "application/ld+json",
  },
  {
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      author: {
        "@type": "Person",
        name: PERSONAL_INFO.name,
      },
      description: SITE_CONFIG.description,
      inLanguage: ["en", "vi"],
      name: SITE_CONFIG.title,
      url: SITE_CONFIG.url,
    }),
    type: "application/ld+json",
  },
];
