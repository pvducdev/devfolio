import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { FontLoaderScript } from "@/components/theme/font-loader-script.tsx";
import { ThemeInitScript } from "@/components/theme/theme-init-script.tsx";
import { PERSONAL_INFO } from "@/config/personal-info.ts";
import { SITE_CONFIG } from "@/config/site.ts";
import { DEFAULT_THEME, THEME_FONT_URLS } from "@/config/theme.ts";
import { getLocale } from "@/paraglide/runtime.js";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
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
      // Open Graph Protocol
      {
        property: "og:type",
        content: SITE_CONFIG.meta.ogType,
      },
      {
        property: "og:url",
        content: SITE_CONFIG.url,
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
    ],
    links: [
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg",
      },
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico",
      },
      {
        rel: "apple-touch-icon",
        href: "/logo192.png",
      },
      {
        rel: "manifest",
        href: "/manifest.json",
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: THEME_FONT_URLS[DEFAULT_THEME],
        as: "style",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang={getLocale()} suppressHydrationWarning>
      <head>
        <ThemeInitScript />
        <FontLoaderScript />
        <HeadContent />
        <title />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: "bottom-left",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
