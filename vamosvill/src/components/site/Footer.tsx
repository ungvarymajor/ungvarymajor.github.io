import { useCallback, useEffect, useState } from "react";
import { MapPin, Home, Phone, Mail, ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import euBanner from "@/assets/site/szechenyi.png";
import { EMAILS, PHONES } from "@/lib/contact";
import { EU_SUPPORT_IMAGES } from "@/lib/euSupportImages";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

export function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [zoom, setZoom] = useState(1);

  const openLightbox = () => {
    setLightboxIdx(0);
    setZoom(1);
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setZoom(1);
  }, []);

  const nextSlide = useCallback(() => {
    setLightboxIdx((i) => (i + 1) % EU_SUPPORT_IMAGES.length);
    setZoom(1);
  }, []);

  const prevSlide = useCallback(() => {
    setLightboxIdx((i) => (i - 1 + EU_SUPPORT_IMAGES.length) % EU_SUPPORT_IMAGES.length);
    setZoom(1);
  }, []);

  const zoomIn = useCallback(() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2))), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2))), []);
  const resetZoom = useCallback(() => setZoom(1), []);

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
      if (e.key === "0") resetZoom();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen, closeLightbox, nextSlide, prevSlide, zoomIn, zoomOut, resetZoom]);

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-surface pt-16 pb-10 md:pt-20 md:pb-12">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/10" />

      <div className="relative mx-auto max-w-[1100px] px-5 md:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-surface-raised p-6 shadow-[0_14px_40px_-26px_rgba(0,0,0,0.45)] md:p-10">
          <span
            aria-hidden
            className="pointer-events-none absolute right-0 top-0 h-16 w-16 bg-primary md:h-20 md:w-20"
            style={{ borderBottomLeftRadius: "100%" }}
          />

          <div className="relative space-y-4 pb-[13.5rem] text-[14px] leading-7 text-foreground/88 sm:pb-[18rem] lg:pb-0 lg:pr-[min(35rem,48%)]">
            <p className="text-sm font-light uppercase tracking-display text-primary">{t.footer.contactsTitle}</p>

            <p className="uppercase tracking-[0.06em] text-foreground">{t.footer.managerLine}</p>

            <p>
              {t.footer.addressLine1} / {t.footer.addressLine2}
            </p>

            <div className="space-y-1">
              <p className="text-foreground/70">{t.footer.constructionDept}:</p>
              <p>
                {t.footer.telLabel}:{" "}
                <a
                  href={PHONES.construction.tel}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {PHONES.construction.display}
                </a>
              </p>
              <p>
                {t.footer.emailLabel}:{" "}
                <a
                  href={`mailto:${EMAILS.construction}`}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {EMAILS.construction}
                </a>
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-foreground/70">{t.footer.tradeDept}:</p>
              {PHONES.trade.map((phone) => (
                <p key={phone.tel}>
                  {t.footer.telLabel}:{" "}
                  <a
                    href={phone.tel}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {phone.display}
                  </a>
                </p>
              ))}
              <p className="grid grid-cols-[max-content_1fr] gap-x-1">
                <span>{t.footer.emailLabel}:</span>
                <a
                  href={`mailto:${EMAILS.office}`}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {EMAILS.office}
                </a>
                <a
                  href={`mailto:${EMAILS.trade}`}
                  className="col-start-2 row-start-2 text-foreground hover:text-primary transition-colors"
                >
                  {EMAILS.trade}
                </a>
              </p>
            </div>
          </div>

          <div
            className="footer-eu-corner absolute bottom-0 right-0 z-10 h-[12.5rem] w-[22.5rem] sm:h-64 sm:w-[26.5rem] md:h-72 md:w-[30rem] lg:h-[19rem] lg:w-[35rem]"
            role="group"
            aria-label={t.euBanner.label}
          >
            <button
              type="button"
              onClick={openLightbox}
              aria-label={t.euBanner.openLightbox}
              className="absolute inset-0 cursor-pointer overflow-hidden rounded-tl-[3rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <img
                src={euBanner}
                alt={t.euBanner.alt}
                loading="lazy"
                draggable={false}
                className="absolute bottom-0 right-0 block h-full w-full max-w-full object-contain object-right-bottom transition-opacity hover:opacity-90"
              />
            </button>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 border-t border-white/10 pt-10 md:justify-start">
          <a
            href="https://maps.app.goo.gl/oVe6iJVzd8XT9kNKA"
            target="_blank"
            rel="noreferrer"
            aria-label={t.a11y.map}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            <MapPin className="h-5 w-5" />
          </a>
          <a
            href="#top"
            aria-label={t.a11y.home}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Home className="h-5 w-5" />
          </a>
          <a
            href={PHONES.construction.tel}
            aria-label={t.a11y.phone}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Phone className="h-5 w-5" />
          </a>
          <a
            href={`mailto:${EMAILS.office}`}
            aria-label={t.a11y.email}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>

        <p className="mt-10 text-center text-xs uppercase tracking-[0.08em] text-foreground/55">
          {t.footer.rights(year)}
        </p>
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90"
          role="dialog"
          aria-modal="true"
          aria-label={t.euBanner.openLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-[101] grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label={t.euBanner.close}
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-4 top-1/2 z-[101] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label={t.moreServices.prev}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 z-[101] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label={t.moreServices.next}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute left-1/2 top-4 z-[102] flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/60 px-3 py-2 shadow-lg backdrop-blur-sm">
            <button
              type="button"
              onClick={zoomOut}
              className="text-white hover:text-white/80"
              aria-label={t.references.zoomOut}
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="min-w-[52px] text-center text-xs text-white">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={zoomIn}
              className="text-white hover:text-white/80"
              aria-label={t.references.zoomIn}
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={resetZoom}
              className="ml-1 rounded bg-white/15 px-2 py-0.5 text-xs text-white hover:bg-white/25"
            >
              {t.references.reset}
            </button>
          </div>

          <div className="relative z-[1] flex h-full w-full flex-col items-center justify-center overflow-auto p-6 pb-20 md:p-10 md:pb-24">
            <img
              src={EU_SUPPORT_IMAGES[lightboxIdx]}
              alt={t.euBanner.slideAlt(lightboxIdx + 1)}
              className="max-h-[min(90vh,900px)] w-full max-w-[min(96vw,1100px)] select-none object-contain transition-transform duration-200"
              style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
              draggable={false}
            />

            <div
              className="mt-6 flex items-center gap-2"
              role="tablist"
              aria-label={t.euBanner.label}
            >
              {EU_SUPPORT_IMAGES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={lightboxIdx === i}
                  aria-label={t.euBanner.slide(i + 1)}
                  onClick={() => {
                    setLightboxIdx(i);
                    setZoom(1);
                  }}
                  className={cn(
                    "h-2.5 w-2.5 rounded-full transition-colors",
                    lightboxIdx === i
                      ? "scale-110 bg-primary"
                      : "bg-white/30 hover:bg-white/50",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
