import { useState } from "react";
import img1 from "@/assets/site/profile-1-epitoanyag.jpg";
import img2 from "@/assets/site/profile-2-general.jpg";
import img3 from "@/assets/site/profile-3-felujitas.jpg";
import img4 from "@/assets/site/profile-4-villany.jpg";
import { SectionTitle } from "./SectionTitle";
import { useReveal } from "@/lib/use-reveal";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const PROFILE_IMAGES = [img1, img2, img3, img4];

type ProfileItem = {
  img: string;
  title: string;
  body: string;
  backBody: string;
};

function Card({ item, idx }: { item: ProfileItem; idx: number }) {
  const { t } = useLocale();
  const ref = useReveal<HTMLElement>();
  const [flipped, setFlipped] = useState(false);
  const toggleFlip = () => setFlipped((v) => !v);

  return (
    <article
      ref={ref}
      className="reveal in mx-auto w-full max-w-[1100px]"
      style={{ transitionDelay: `${idx * 90}ms` }}
    >
      <div className="h-[520px] cursor-pointer [perspective:1400px] md:h-[540px]" onClick={toggleFlip}>
        <div
          className={`relative h-full w-full rounded-2xl transition-transform duration-700 [transform-style:preserve-3d] ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          <div className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-surface-raised shadow-[0_18px_45px_-28px_rgba(0,0,0,0.45)] [backface-visibility:hidden]">
            <div className="grid h-full md:grid-cols-[1.05fr_1fr]">
              <div className="relative h-full min-h-[220px] overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-black/10 to-transparent" />
              </div>

              <div className="relative flex flex-col px-6 py-7 md:px-10 md:py-10">
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-0 top-0 h-16 w-16 bg-primary md:h-20 md:w-20"
                  style={{ borderBottomLeftRadius: "100%" }}
                />

                <h3 className="text-center text-lg font-light uppercase tracking-display text-foreground md:text-xl">
                  {item.title}
                </h3>

                <p className="mx-auto mt-5 max-w-[38ch] flex-1 text-center text-[15px] leading-7 text-foreground/92">
                  {item.body}
                </p>
                <p className="mt-auto pt-6 text-center text-sm uppercase tracking-display text-foreground/80">
                  {t.profile.flipHint}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-surface-raised px-6 py-8 shadow-[0_18px_45px_-28px_rgba(0,0,0,0.45)] [backface-visibility:hidden] [transform:rotateY(180deg)] md:px-10 md:py-10">
            <span
              aria-hidden
              className="pointer-events-none absolute right-0 top-0 h-16 w-16 bg-primary md:h-20 md:w-20"
              style={{ borderBottomLeftRadius: "100%" }}
            />

            <div className="flex h-full flex-col items-center justify-center text-center">
              <h3 className="text-xl font-light uppercase tracking-display text-foreground md:text-2xl">
                {item.title}
              </h3>
              <p className="mt-5 max-w-[70ch] text-[15px] leading-7 text-foreground/92">{item.backBody}</p>
              <p className="mt-6 text-xs uppercase tracking-display text-foreground/65">{t.profile.flipBack}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function Profilunk() {
  const { t } = useLocale();
  const items: ProfileItem[] = t.profile.items.map((item, i) => ({
    ...item,
    img: PROFILE_IMAGES[i],
  }));

  return (
    <section id="profilunk" className="relative overflow-hidden bg-surface py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(780px_380px_at_50%_25%,white_0%,transparent_72%)] opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/10" />

      <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
        <SectionTitle>{t.profile.title}</SectionTitle>

        <div className="mt-12 flex flex-col gap-8 md:mt-16 md:gap-10">
          {items.map((it, i) => (
            <Card key={it.title} item={it} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
