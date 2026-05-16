import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { REFERENCE_SLIDES } from "@/lib/referenceImages";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 4500;
const IDLE_RESUME_MS = 5000;

export function References() {
  const { t } = useLocale();
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [zoom, setZoom] = useState(1);

  const pauseAutoplay = useCallback(() => {
    setAutoplayPaused(true);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => setAutoplayPaused(false), IDLE_RESUME_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setSelected(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || autoplayPaused || lightboxOpen) return;

    const id = window.setInterval(() => api.scrollNext(), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [api, autoplayPaused, lightboxOpen]);

  const openLightbox = (i: number) => {
    pauseAutoplay();
    setLightboxIdx(i);
    setZoom(1);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setZoom(1);
  };

  const nextLightbox = () => {
    setLightboxIdx((i) => (i + 1) % REFERENCE_SLIDES.length);
    setZoom(1);
  };

  const prevLightbox = () => {
    setLightboxIdx((i) => (i - 1 + REFERENCE_SLIDES.length) % REFERENCE_SLIDES.length);
    setZoom(1);
  };

  const zoomIn = () => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)));
  const zoomOut = () => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)));
  const resetZoom = () => setZoom(1);

  const goPrev = () => {
    pauseAutoplay();
    api?.scrollPrev();
  };

  const goNext = () => {
    pauseAutoplay();
    api?.scrollNext();
  };

  const goTo = (index: number) => {
    pauseAutoplay();
    api?.scrollTo(index);
  };

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextLightbox();
      if (e.key === "ArrowLeft") prevLightbox();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
      if (e.key === "0") resetZoom();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen]);

  return (
    <section id="referenciak" className="bg-surface py-20 md:py-28">
      <SectionTitle>{t.references.title}</SectionTitle>

      <div className="mx-auto mt-10 max-w-[1200px] px-5 md:mt-14 md:px-8">
        <Carousel
          setApi={setApi}
          opts={{ loop: true, align: "center" }}
          className="w-full"
          onPointerDown={pauseAutoplay}
        >
          <div className="relative">
            <button
              type="button"
              onClick={goPrev}
              aria-label={t.moreServices.prev}
              className="absolute -left-1 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-foreground transition-colors hover:text-primary md:-left-6"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>

            <CarouselContent className="-ml-3 md:-ml-4">
              {REFERENCE_SLIDES.map((src, i) => (
                <CarouselItem key={src} className="pl-3 md:pl-4">
                  <button
                    type="button"
                    onClick={() => openLightbox(i)}
                    className="group relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-white/15 bg-black"
                    aria-label={t.references.open(i + 1)}
                  >
                    <img
                      src={src}
                      alt={t.references.open(i + 1)}
                      loading={i === 0 ? "eager" : "lazy"}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>

            <button
              type="button"
              onClick={goNext}
              aria-label={t.moreServices.next}
              className="absolute -right-1 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-foreground transition-colors hover:text-primary md:-right-6"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          </div>

          <div
            className="mt-5 flex flex-wrap items-center justify-center gap-2"
            role="tablist"
            aria-label={t.references.title}
          >
            {REFERENCE_SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={selected === i}
                aria-label={t.references.open(i + 1)}
                onClick={() => goTo(i)}
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-colors",
                  selected === i
                    ? "bg-primary scale-110"
                    : "bg-foreground/25 hover:bg-foreground/45",
                )}
              />
            ))}
          </div>
        </Carousel>
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90" role="dialog" aria-modal="true">
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-[101] grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label={t.references.close}
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={prevLightbox}
            className="absolute left-4 top-1/2 z-[101] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label={t.moreServices.prev}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={nextLightbox}
            className="absolute right-4 top-1/2 z-[101] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label={t.moreServices.next}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute left-1/2 top-4 z-[101] flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/10 px-3 py-2">
            <button type="button" onClick={zoomOut} className="text-white hover:text-white/80" aria-label={t.references.zoomOut}>
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="min-w-[52px] text-center text-xs text-white">{Math.round(zoom * 100)}%</span>
            <button type="button" onClick={zoomIn} className="text-white hover:text-white/80" aria-label={t.references.zoomIn}>
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

          <div className="flex h-full w-full items-center justify-center overflow-auto p-6 md:p-10">
            <img
              src={REFERENCE_SLIDES[lightboxIdx]}
              alt={t.references.open(lightboxIdx + 1)}
              className="max-h-full max-w-full select-none object-contain transition-transform duration-200"
              style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
              draggable={false}
            />
          </div>
        </div>
      )}
    </section>
  );
}
