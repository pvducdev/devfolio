import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { FontLoaderScript } from "@/components/theme/font-loader-script.tsx";
import { ThemeInitScript } from "@/components/theme/theme-init-script.tsx";
import { buildSeoMeta, buildStructuredData } from "@/config/seo.ts";
import { SITE_CONFIG } from "@/config/site.ts";
import { DEFAULT_THEME, THEME_FONT_URLS } from "@/config/theme.ts";
import { getLocale } from "@/paraglide/runtime.js";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => {
    const locale = getLocale();

    return {
      meta: buildSeoMeta(locale, SITE_CONFIG.url),
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
