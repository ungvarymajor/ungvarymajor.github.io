import { useMemo, useState } from "react";
import { Menu, MapPin, Phone, X } from "lucide-react";
import logo from "@/assets/site/logo.png";
import { PHONES } from "@/lib/contact";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { SiteControls } from "./SiteControls";

export function Header() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);

  const nav = useMemo(
    () => [
      { label: t.nav.about, href: "#rolunk" },
      { label: t.nav.profile, href: "#profilunk" },
      { label: t.nav.references, href: "#referenciak" },
    ],
    [t],
  );

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="hidden md:flex items-center justify-between pl-12 lg:pl-20 pr-16 lg:pr-32 pt-3 pb-1">
        <SiteControls />
        <div className="flex gap-8 text-xs text-foreground/85">
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-foreground/70" aria-hidden />
            <span className="leading-tight">
              {t.location.city}
              <br />
              {t.location.street}
            </span>
          </span>
          <span className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-foreground/70" aria-hidden />
            <a href={PHONES.construction.tel} className="hover:text-primary transition-colors">
              {PHONES.construction.display}
            </a>
          </span>
        </div>
      </div>

      <div className="md:hidden flex justify-between items-start px-5 pt-4 text-[11px] text-foreground/85">
        <span className="flex items-start gap-1.5">
          <MapPin className="h-3.5 w-3.5 mt-0.5 text-foreground/70" aria-hidden />
          <span className="leading-tight">
            {t.location.city}
            <br />
            {t.location.street}
          </span>
        </span>
        <div className="flex items-center gap-2">
          <SiteControls />
          <a href={PHONES.construction.tel} className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <Phone className="h-3.5 w-3.5 text-foreground/70" aria-hidden />
            {PHONES.construction.display}
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-5 md:px-8 lg:px-16 h-[110px] md:h-[120px] flex items-center justify-between">
        <a href="#top" className="block" aria-label={t.a11y.home}>
          <img
            src={logo}
            alt="Vámos Vill Kft."
            width={120}
            height={88}
            className="h-20 md:h-24 lg:h-28 w-auto"
            fetchPriority="high"
          />
        </a>

        <nav className="hidden md:flex items-center gap-10 text-[13px] uppercase tracking-display">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="text-foreground/90 hover:text-primary transition-colors">
              {n.label}
            </a>
          ))}
          <a
            href="#kapcsolat"
            className="px-7 py-3 rounded-full border border-foreground/90 text-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors"
          >
            {t.nav.contact}
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t.a11y.openMenu}
          className="md:hidden p-2 -mr-2 text-foreground"
        >
          <Menu className="h-7 w-7" />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={() => setOpen(false)} />

        <div
          className={`absolute right-0 top-0 h-full w-[78%] max-w-sm bg-surface-deep border-l border-white/10 shadow-[-24px_0_60px_-30px_rgba(0,0,0,0.8)] p-6 flex flex-col gap-2 transition-transform ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            onClick={() => setOpen(false)}
            aria-label={t.a11y.closeMenu}
            className="self-end p-2 -mr-2 text-foreground"
          >
            <X className="h-7 w-7" />
          </button>

          <nav className="mt-4 flex flex-col gap-1 text-base uppercase tracking-display">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="py-3 border-b border-white/10 text-foreground hover:text-primary transition-colors"
              >
                {n.label}
              </a>
            ))}
            <a
              href="#kapcsolat"
              onClick={() => setOpen(false)}
              className="mt-6 self-start px-7 py-3 rounded-full border border-foreground text-foreground hover:bg-primary hover:border-primary transition-colors"
            >
              {t.nav.contact}
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
