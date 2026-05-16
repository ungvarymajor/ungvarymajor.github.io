import hero from "@/assets/site/hero.jpg";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function Hero() {
  const { t } = useLocale();

  return (
    <section id="top" className="relative isolate overflow-hidden bg-surface">
      <div className="absolute inset-0 -z-30">
        <img
          src={hero}
          alt=""
          aria-hidden
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
      </div>

      <div className="absolute inset-0 -z-20 bg-[radial-gradient(1100px_560px_at_12%_8%,oklch(0.6_0.2_28_/_0.18),transparent_60%),radial-gradient(800px_480px_at_88%_18%,oklch(0.78_0.02_250_/_0.12),transparent_65%),linear-gradient(180deg,oklch(0.2_0_0_/_0.35),oklch(0.23_0_0_/_0.72))]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-surface-deep/70 via-surface-deep/35 to-surface-deep/65" />

      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />

      <div className="mx-auto flex min-h-[660px] max-w-[1280px] items-center px-5 pb-20 pt-40 md:min-h-[740px] md:px-8 md:pt-52 lg:px-16">
        <div className="w-full max-w-2xl">
          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-[0_24px_70px_-25px_rgba(0,0,0,0.55)] backdrop-blur-xl md:p-10">
            <h1 className="text-center text-2xl font-light uppercase leading-tight tracking-display text-foreground md:text-3xl lg:text-[34px]">
              {t.hero.title}
            </h1>

            <p className="mx-auto mt-7 max-w-[60ch] text-center text-[14px] leading-7 tracking-[0.03em] text-foreground/90 md:text-[15px]">
              {t.hero.body}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#kapcsolat"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 text-sm font-medium uppercase tracking-display text-primary-foreground shadow-lg shadow-primary/35 transition-all hover:-translate-y-0.5 hover:bg-[oklch(0.55_0.24_28)]"
              >
                {t.hero.ctaContact}
              </a>
              <a
                href="#referenciak"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 py-3 text-sm font-medium uppercase tracking-display text-white/90 backdrop-blur-md transition-all hover:bg-white/20"
              >
                {t.hero.ctaReferences}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
