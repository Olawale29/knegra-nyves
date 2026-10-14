"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";
import type { VideoAsset } from "@/lib/types";
import { cx } from "@/lib/format";

/**
 * Muted, looping ambient video with a poster image. It only plays while on
 * screen, never autoplays for reduced-motion users, and always offers a
 * visible pause control (WCAG 2.2.2).
 */
export function AmbientVideo({
  video,
  className,
  sizes = "100vw",
  preloadPoster = false,
  objectPosition,
  controlPosition = "bottom-right",
}: {
  video: VideoAsset;
  className?: string;
  sizes?: string;
  preloadPoster?: boolean;
  objectPosition?: string;
  controlPosition?: "bottom-right" | "bottom-left" | "top-right" | "below-header";
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const allowed = useMotionAllowed();

  useEffect(() => {
    const el = ref.current;
    if (!el || !allowed || userPaused) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => setPlaying(false));
        else el.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [allowed, userPaused]);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      setUserPaused(false);
      el.play().catch(() => undefined);
    } else {
      setUserPaused(true);
      el.pause();
    }
  };

  const pos = objectPosition ?? video.poster.focus ?? "50% 50%";
  const controlPos = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "below-header": "right-4 top-4 lg:top-[calc(var(--announce-h)+var(--header-h)+16px)]",
  }[controlPosition];

  return (
    <div className={cx("overflow-hidden bg-ink", !/\b(absolute|fixed)\b/.test(className ?? "") && "relative", className)}>
      <Image
        src={video.poster.src}
        alt={video.poster.alt}
        fill
        sizes={sizes}
        quality={80}
        preload={preloadPoster}
        className="object-cover"
        style={{ objectPosition: pos }}
      />
      {allowed && (
        <video
          ref={ref}
          className={cx("absolute inset-0 h-full w-full object-cover transition-opacity duration-1000", ready ? "opacity-100" : "opacity-0")}
          style={{ objectPosition: pos }}
          src={video.src}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          onCanPlay={() => setReady(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      )}
      {allowed && (
        <button
          type="button"
          onClick={toggle}
          className={cx("on-dark absolute z-10 grid size-10 place-items-center rounded-full bg-ink/35 text-ivory backdrop-blur-sm transition-colors hover:bg-ink/60", controlPos)}
          aria-label={playing ? `Pause video: ${video.label}` : `Play video: ${video.label}`}
        >
          {playing ? <Pause className="size-3.5" strokeWidth={1.5} /> : <Play className="size-3.5 translate-x-px" strokeWidth={1.5} />}
        </button>
      )}
    </div>
  );
}

const REDUCE = "(prefers-reduced-motion: reduce)";

/** False on the server and for reduced-motion users; true otherwise. */
function useMotionAllowed() {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(REDUCE);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    () => !window.matchMedia(REDUCE).matches,
    () => false,
  );
}
