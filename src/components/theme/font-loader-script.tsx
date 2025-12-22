import {
  DEFAULT_THEME,
  THEME_FONT_URLS,
  THEME_STORAGE_KEY,
} from "@/config/theme.ts";

export function FontLoaderScript() {
  const fontUrlsJson = JSON.stringify(THEME_FONT_URLS);

  const scriptContent = `
    (function() {
      var FONT_URLS = ${fontUrlsJson};
      var currentFontLink = null;

      function loadFonts(theme) {
        var url = FONT_URLS[theme];
        if (!url) return;

        if (currentFontLink && currentFontLink.dataset.fontTheme === theme) return;

        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.dataset.fontTheme = theme;

        link.onload = function() {
          if (currentFontLink) {
            currentFontLink.remove();
          }
          currentFontLink = link;
        };

        document.head.appendChild(link);
      }

      window.__loadThemeFonts = loadFonts;

      try {
        var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
        var theme = '${DEFAULT_THEME}';
        if (stored) {
          var parsed = JSON.parse(stored);
          theme = parsed?.state?.theme || '${DEFAULT_THEME}';
        }
        loadFonts(theme);
      } catch (e) {
        loadFonts('${DEFAULT_THEME}');
      }
    })();
  `;

  // biome-ignore lint/security/noDangerouslySetInnerHtml: Safe - uses only static constants, no user input
  return <script dangerouslySetInnerHTML={{ __html: scriptContent }} />;
}
