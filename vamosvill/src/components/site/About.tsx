import { SectionTitle } from "./SectionTitle";
import { useReveal } from "@/lib/use-reveal";
import { useLocale } from "@/lib/i18n/LocaleProvider";

function AboutCard() {
  const { t } = useLocale();
  const ref = useReveal<HTMLDivElement>();

  return (
    <article
      ref={ref}
      className="reveal in relative mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-surface-raised p-6 shadow-[0_14px_40px_-26px_rgba(0,0,0,0.45)] md:p-10"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-16 w-16 bg-primary md:h-20 md:w-20"
        style={{ borderBottomLeftRadius: "100%" }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-12 w-12 bg-primary/85 md:h-14 md:w-14"
        style={{ borderTopRightRadius: "100%" }}
      />

      <div className="relative space-y-8 md:space-y-10">
        {t.about.blocks.map((block, index) => (
          <section key={block.title}>
            <h3 className="text-center text-base font-light uppercase tracking-display text-foreground md:text-lg">
              {block.title}
            </h3>
            <p className="mx-auto mt-4 max-w-[76ch] text-center text-[14px] leading-7 tracking-[0.035em] text-foreground/90 md:text-[15px]">
              {block.body}
            </p>
            {index < t.about.blocks.length - 1 ? (
              <div className="mx-auto mt-7 h-px w-20 bg-white/20" />
            ) : null}
          </section>
        ))}
      </div>
    </article>
  );
}

export function About() {
  const { t } = useLocale();

  return (
    <section id="rolunk" className="relative bg-surface py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/10" />

      <div className="relative mx-auto max-w-[1100px] px-5 md:px-8">
        <SectionTitle>{t.about.title}</SectionTitle>

        <div className="mt-12 md:mt-16">
          <AboutCard />
        </div>
      </div>
    </section>
  );
}
