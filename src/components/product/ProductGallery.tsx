"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, Play, X, ZoomIn, ZoomOut } from "lucide-react";
import { cx } from "@/lib/format";
import type { MediaAsset, VideoAsset } from "@/lib/types";
import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { Dialog } from "@/components/ui/Dialog";

type Slide = { kind: "image"; media: MediaAsset } | { kind: "video"; video: VideoAsset };

/**
 * Product gallery: main viewer with thumbnails (desktop: vertical rail,
 * mobile: swipeable track with counter) and a full-screen lightbox that
 * supports arrow keys, swipe and click-to-zoom with pointer panning.
 */
export function ProductGallery({ images, video, productName }: { images: MediaAsset[]; video?: VideoAsset; productName: string }) {
  const slides: Slide[] = [...images.map((m) => ({ kind: "image" as const, media: m })), ...(video ? [{ kind: "video" as const, video }] : [])];
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const imagesKey = images.map((m) => m.src).join("|");

  // Reset to the first image when the variant (image set) changes.
  const [shownKey, setShownKey] = useState(imagesKey);
  if (shownKey !== imagesKey) {
    setShownKey(imagesKey);
    setIndex(0);
  }
  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 });
  }, [imagesKey]);

  const go = useCallback(
    (i: number) => {
      const n = (i + slides.length) % slides.length;
      setIndex(n);
      const track = trackRef.current;
      if (track) track.scrollTo({ left: n * track.clientWidth, behavior: "smooth" });
    },
    [slides.length],
  );

  const onTrackScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const n = Math.round(track.scrollLeft / track.clientWidth);
    if (n !== index) setIndex(n);
  };

  const current = slides[index] ?? slides[0];

  return (
    <div className="lg:grid lg:grid-cols-[88px_1fr] lg:gap-5">
      {/* Thumbnails — desktop */}
      <ul className="no-scrollbar hidden max-h-[calc(100dvh-180px)] flex-col gap-3 overflow-y-auto lg:flex" aria-label="Product images">
        {slides.map((s, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => go(i)}
              aria-label={s.kind === "video" ? `Play film of ${productName}` : `View image ${i + 1} of ${slides.length}`}
              aria-current={i === index}
              className={cx("relative block aspect-[4/5] w-full overflow-hidden bg-cream transition-opacity", i === index ? "opacity-100 ring-1 ring-ink ring-offset-2 ring-offset-ivory" : "opacity-55 hover:opacity-100")}
            >
              <Image src={s.kind === "image" ? s.media.src : s.video.poster.src} alt="" fill sizes="88px" quality={70} className="object-cover" />
              {s.kind === "video" && (
                <span className="absolute inset-0 grid place-items-center bg-ink/25 text-ivory">
                  <Play className="size-4" strokeWidth={1.5} />
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {/* Main viewer */}
      <div className="relative">
        <div
          ref={trackRef}
          onScroll={onTrackScroll}
          className="no-scrollbar flex aspect-[4/5] snap-x snap-mandatory overflow-x-auto bg-cream lg:overflow-hidden"
          aria-roledescription="carousel"
          aria-label={`${productName} images`}
        >
          {slides.map((s, i) => (
            <div key={i} className="relative h-full w-full shrink-0 snap-center" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`} inert={i !== index}>
              {s.kind === "image" ? (
                <button type="button" onClick={() => setLightbox(true)} className="group relative block h-full w-full cursor-zoom-in" aria-label={`Enlarge: ${s.media.alt}`}>
                  <Image
                    src={s.media.src}
                    alt={s.media.alt}
                    fill
                    preload={i === 0}
                    sizes="(min-width:1024px) 50vw, 100vw"
                    quality={85}
                    className="object-cover transition-opacity duration-500"
                    style={{ objectPosition: s.media.focus ?? "50% 50%" }}
                  />
                </button>
              ) : (
                <AmbientVideo video={s.video} className="h-full w-full" sizes="(min-width:1024px) 50vw, 100vw" />
              )}
            </div>
          ))}
        </div>

        {slides.length > 1 && (
          <>
            <button type="button" onClick={() => go(index - 1)} className="absolute left-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center bg-ivory/80 backdrop-blur-sm transition-colors hover:bg-ivory lg:grid" aria-label="Previous image">
              <ChevronLeft className="size-4" strokeWidth={1.25} />
            </button>
            <button type="button" onClick={() => go(index + 1)} className="absolute right-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center bg-ivory/80 backdrop-blur-sm transition-colors hover:bg-ivory lg:grid" aria-label="Next image">
              <ChevronRight className="size-4" strokeWidth={1.25} />
            </button>
          </>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between p-3">
          <span className="rounded-full bg-ivory/85 px-2.5 py-1 text-[11px] tabular-nums backdrop-blur-sm" aria-live="polite">
            {index + 1} / {slides.length}
          </span>
          {current.kind === "image" && (
            <button type="button" onClick={() => setLightbox(true)} className="pointer-events-auto grid size-10 place-items-center rounded-full bg-ivory/85 backdrop-blur-sm" aria-label="Open full-screen gallery">
              <Expand className="size-4" strokeWidth={1.25} />
            </button>
          )}
        </div>

        {/* Mobile progress */}
        {slides.length > 1 && (
          <div className="mt-3 flex gap-1 lg:hidden" aria-hidden>
            {slides.map((_, i) => (
              <span key={i} className={cx("h-px flex-1 transition-colors", i === index ? "bg-ink" : "bg-line-strong")} />
            ))}
          </div>
        )}
      </div>

      <Lightbox open={lightbox} onClose={() => setLightbox(false)} images={images} start={Math.min(index, images.length - 1)} productName={productName} />
    </div>
  );
}

function Lightbox({ open, onClose, images, start, productName }: { open: boolean; onClose: () => void; images: MediaAsset[]; start: number; productName: string }) {
  const [i, setI] = useState(start);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const touchX = useRef<number | null>(null);

  const [wasOpen, setWasOpen] = useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (open) {
      setI(start);
      setZoom(false);
    }
  }

  const go = useCallback((d: number) => {
    setZoom(false);
    setI((n) => (n + d + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  const m = images[i];
  if (!m) return null;

  return (
    <Dialog open={open} onClose={onClose} title={`${productName} — gallery`} side="center" hideTitle tone="dark" className="!inset-0 !left-0 !top-0 !h-dvh !max-h-none !w-full !max-w-none !translate-x-0 !translate-y-0">
      <div className="relative flex h-dvh flex-col">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <p className="text-[12px] tabular-nums text-ivory/70">
            {i + 1} / {images.length}
          </p>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setZoom((z) => !z)} className="grid size-11 place-items-center" aria-pressed={zoom} aria-label={zoom ? "Zoom out" : "Zoom in"}>
              {zoom ? <ZoomOut className="size-5" strokeWidth={1.25} /> : <ZoomIn className="size-5" strokeWidth={1.25} />}
            </button>
            <button type="button" onClick={onClose} className="grid size-11 place-items-center" aria-label="Close gallery">
              <X className="size-5" strokeWidth={1.25} />
            </button>
          </div>
        </div>

        <div
          className={cx("relative min-h-0 flex-1 overflow-hidden", zoom ? "cursor-zoom-out" : "cursor-zoom-in")}
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
            setZoom((z) => !z);
          }}
          onPointerMove={(e) => {
            if (!zoom || e.pointerType === "touch") return;
            const r = e.currentTarget.getBoundingClientRect();
            setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
          }}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null || zoom) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <Image
            key={m.src}
            src={m.src}
            alt={m.alt}
            fill
            sizes="100vw"
            quality={85}
            className="animate-[kn-fade_400ms_var(--ease-out)] object-contain transition-transform duration-500 ease-[var(--ease-out)]"
            style={{ transform: zoom ? "scale(2.2)" : "scale(1)", transformOrigin: origin }}
          />
        </div>

        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <button type="button" onClick={() => go(-1)} className="grid size-11 place-items-center" aria-label="Previous image">
            <ChevronLeft className="size-5" strokeWidth={1.25} />
          </button>
          <p className="line-clamp-1 text-center text-[12.5px] text-ivory/70">{m.alt}</p>
          <button type="button" onClick={() => go(1)} className="grid size-11 place-items-center" aria-label="Next image">
            <ChevronRight className="size-5" strokeWidth={1.25} />
          </button>
        </div>
      </div>
    </Dialog>
  );
}
