import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SERVICE_ICONS, type ThemeIconSources } from "@/lib/theme/siteIcons";
import { SectionTitle } from "./SectionTitle";
import { ThemeIcon } from "./ThemeIcon";
import { useLocale } from "@/lib/i18n/LocaleProvider";

function ServiceCard({
  title,
  body,
  icon,
}: {
  title: string;
  body: string;
  icon: ThemeIconSources;
}) {
  return (
    <article className="relative mx-2 flex h-full min-h-[360px] flex-col items-center rounded-2xl border border-white/20 bg-surface-raised px-6 py-10 text-center shadow-[0_18px_50px_-28px_rgba(0,0,0,0.45)] md:px-8 md:py-12">
      <span
        aria-hidden
        className="absolute -top-px left-1/2 -translate-x-1/2"
        style={{
          width: 0,
          height: 0,
          borderLeft: "26px solid transparent",
          borderRight: "26px solid transparent",
          borderTop: "30px solid var(--brand-red)",
        }}
      />
      <ThemeIcon dark={icon.dark} light={icon.light} className="mt-8 h-20 w-20" />
      <h3 className="mt-6 text-lg font-medium uppercase tracking-[0.08em] text-foreground md:text-xl">{title}</h3>
      <p className="mt-4 text-[15px] leading-7 text-foreground/90 md:text-base">{body}</p>
    </article>
  );
}

function usePerView() {
  const [n, setN] = useState(3);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setN(w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return n;
}

export function MoreServices() {
  const { t } = useLocale();
  const [start, setStart] = useState(0);
  const perView = usePerView();
  const items = useMemo(
    () => t.moreServices.items.map((item, i) => ({ ...item, icon: SERVICE_ICONS[i] })),
    [t],
  );
  const max = Math.max(0, items.length - perView);
  const go = (d: number) => setStart((s) => Math.max(0, Math.min(max, s + d)));

  return (
    <section className="bg-surface pt-4 pb-20 md:pb-28">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <SectionTitle>{t.moreServices.title}</SectionTitle>
        <div className="relative mt-12 md:mt-16">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={start === 0}
            aria-label={t.moreServices.prev}
            className="absolute -left-1 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-foreground transition-colors hover:text-primary disabled:opacity-30 md:-left-6"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${(start * 100) / perView}%)` }}
            >
              {items.map((it) => (
                <div key={it.title} className="shrink-0 px-1" style={{ width: `${100 / perView}%` }}>
                  <ServiceCard title={it.title} body={it.body} icon={it.icon} />
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={start >= max}
            aria-label={t.moreServices.next}
            className="absolute -right-1 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-foreground transition-colors hover:text-primary disabled:opacity-30 md:-right-6"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>
      </div>
    </section>
  );
}
