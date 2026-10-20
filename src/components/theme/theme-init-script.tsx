import {
  DEFAULT_THEME,
  THEME_ATTRIBUTE,
  THEME_FONT_URLS,
  THEME_STORAGE_KEY,
} from "@/components/theme/themes";

const SCRIPT = `
  (function() {
    var FONT_URLS = ${JSON.stringify(THEME_FONT_URLS)};
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
        if (currentFontLink) currentFontLink.remove();
        currentFontLink = link;
      };
      document.head.appendChild(link);
    }

    window.__loadThemeFonts = loadFonts;

    var theme = '${DEFAULT_THEME}';
    try {
      var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
      theme = (stored && JSON.parse(stored)?.state?.theme) || '${DEFAULT_THEME}';
    } catch (e) {
      theme = '${DEFAULT_THEME}';
    }

    document.documentElement.setAttribute('${THEME_ATTRIBUTE}', theme);
    loadFonts(theme);
  })();
`;

export const ThemeInitScript = () => (
  <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
);
