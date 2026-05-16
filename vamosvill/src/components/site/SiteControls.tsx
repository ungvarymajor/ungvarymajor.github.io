import { Moon, Sun } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n/types";
import { useTheme } from "@/lib/theme/ThemeProvider";

const LANGS: { code: Locale; label: string }[] = [
  { code: "hu", label: "HU" },
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
];

export function SiteControls({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      role="group"
      aria-label={t.a11y.language}
    >
      <button
        type="button"
        onClick={toggleTheme}
        className="grid h-9 w-9 place-items-center rounded-full border border-foreground/25 text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
        aria-label={theme === "dark" ? t.a11y.themeLight : t.a11y.themeDark}
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <div className="flex overflow-hidden rounded-full border border-foreground/25">
        {LANGS.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLocale(lang.code)}
            className={`px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wide transition-colors ${
              locale === lang.code
                ? "bg-primary text-primary-foreground"
                : "text-foreground/80 hover:bg-foreground/10"
            }`}
            aria-pressed={locale === lang.code}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
}
