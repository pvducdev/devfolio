import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { FontLoaderScript } from "@/components/theme/font-loader-script";
import { ThemeInitScript } from "@/components/theme/theme-init-script";
import { buildSeoMeta, buildStructuredData } from "@/config/seo";
import { SITE_CONFIG } from "@/config/site";
import { DEFAULT_THEME, THEME_FONT_URLS } from "@/config/theme";
import { getLocale } from "@/paraglide/runtime.js";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => {
    const locale = getLocale();

    return {
      links: [
        {
          href: "/favicon.svg",
          rel: "icon",
          type: "image/svg+xml",
        },
        {
          href: "/favicon.ico",
          rel: "icon",
          type: "image/x-icon",
        },
        {
          href: "/logo192.png",
          rel: "apple-touch-icon",
        },
        {
          href: "/manifest.json",
          rel: "manifest",
        },
        {
          href: "https://fonts.googleapis.com",
          rel: "preconnect",
        },
        {
          crossOrigin: "anonymous",
          href: "https://fonts.gstatic.com",
          rel: "preconnect",
        },
        {
          as: "style",
          href: THEME_FONT_URLS[DEFAULT_THEME],
          rel: "preload",
        },
        {
          href: appCss,
          rel: "stylesheet",
        },
      ],
      meta: buildSeoMeta(locale, SITE_CONFIG.url),
      scripts: buildStructuredData(),
    };
  },

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
