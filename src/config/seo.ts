import type { MetaDescriptor } from "@tanstack/react-router";

import { PERSONAL_INFO } from "./personal-info";
import { SITE_CONFIG } from "./site";

export const buildSeoMeta = (
  locale: string,
  canonicalUrl: string
): MetaDescriptor[] => [
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
  {
    content: SITE_CONFIG.meta.ogType,
    property: "og:type",
  },
  {
    content: canonicalUrl,
    property: "og:url",
  },
  {
    content: SITE_CONFIG.title,
    property: "og:title",
  },
  {
    content: SITE_CONFIG.description,
    property: "og:description",
  },
  {
    content: SITE_CONFIG.meta.ogImage,
    property: "og:image",
  },
  {
    content: SITE_CONFIG.meta.ogImageWidth,
    property: "og:image:width",
  },
  {
    content: SITE_CONFIG.meta.ogImageHeight,
    property: "og:image:height",
  },
  {
    content: `${PERSONAL_INFO.name} - ${PERSONAL_INFO.role}`,
    property: "og:image:alt",
  },
  {
    content: locale === "vi" ? "vi_VN" : "en_US",
    property: "og:locale",
  },
  {
    content: SITE_CONFIG.title,
    property: "og:site_name",
  },
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
