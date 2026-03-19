import {
  DEFAULT_THEME,
  THEME_ATTRIBUTE,
  THEME_STORAGE_KEY,
} from "@/config/theme";

export function ThemeInitScript() {
  const scriptContent = `
    (function() {
      try {
        const stored = localStorage.getItem('${THEME_STORAGE_KEY}');
        if (stored) {
          const parsed = JSON.parse(stored);
          const theme = parsed?.state?.theme || '${DEFAULT_THEME}';
          document.documentElement.setAttribute('${THEME_ATTRIBUTE}', theme);
        } else {
          document.documentElement.setAttribute('${THEME_ATTRIBUTE}', '${DEFAULT_THEME}');
        }
      } catch (e) {
        document.documentElement.setAttribute('${THEME_ATTRIBUTE}', '${DEFAULT_THEME}');
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: scriptContent }} />;
}
