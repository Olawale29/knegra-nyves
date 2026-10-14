"use client";

import { AnimatePresence, motion, useReducedMotion, type TargetAndTransition } from "motion/react";
import { useEffect, useEffectEvent, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cx } from "@/lib/format";

type Side = "right" | "left" | "top" | "center" | "bottom";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Visually hide the title (it is still announced). */
  hideTitle?: boolean;
  side?: Side;
  children: ReactNode;
  className?: string;
  /** Element to focus on open; defaults to the first focusable element. */
  initialFocus?: React.RefObject<HTMLElement | null>;
  footer?: ReactNode;
  tone?: "light" | "dark";
  showClose?: boolean;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const panelMotion: Record<Side, { initial: TargetAndTransition; animate: TargetAndTransition; exit: TargetAndTransition }> = {
  right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } },
  left: { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } },
  top: { initial: { y: "-100%" }, animate: { y: 0 }, exit: { y: "-100%" } },
  bottom: { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } },
  center: { initial: { opacity: 0, scale: 0.98 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.98 } },
};

const panelPosition: Record<Side, string> = {
  right: "right-0 top-0 h-dvh w-full max-w-[460px]",
  left: "left-0 top-0 h-dvh w-full max-w-[420px]",
  top: "inset-x-0 top-0 max-h-dvh",
  bottom: "inset-x-0 bottom-0 max-h-[88dvh]",
  center: "left-1/2 top-1/2 max-h-[90dvh] w-[calc(100%-32px)] max-w-[640px] -translate-x-1/2 -translate-y-1/2",
};

/**
 * Accessible modal dialog / drawer: focus trap, Escape to close, scroll lock,
 * focus restoration, and aria-modal semantics.
 */
export function Dialog({
  open,
  onClose,
  title,
  hideTitle,
  side = "right",
  children,
  className,
  initialFocus,
  footer,
  tone = "light",
  showClose = true,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const reduce = useReducedMotion();

  // Stable handlers so the effect runs only when `open` changes — otherwise a
  // re-render (e.g. typing in a field) would steal and restore focus.
  const requestClose = useEffectEvent(() => onClose());
  const focusInitial = useEffectEvent(() => {
    const target = initialFocus?.current ?? panelRef.current?.querySelector<HTMLElement>(FOCUSABLE) ?? panelRef.current;
    target?.focus();
  });

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const t = window.setTimeout(focusInitial, 40);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        requestClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((n) => n.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
      restoreRef.current?.focus?.({ preventScroll: true });
    };
  }, [open]);

  if (typeof document === "undefined") return null;

  const m = panelMotion[side];
  const transition = reduce ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            className="absolute inset-0 bg-ink/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.3 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={m.initial}
            animate={m.animate}
            exit={m.exit}
            transition={transition}
            className={cx(
              "absolute flex flex-col outline-none",
              tone === "dark" ? "on-dark bg-ink text-ivory" : "bg-ivory text-ink",
              panelPosition[side],
              className,
            )}
          >
            <div className={cx("flex items-center justify-between gap-4 border-b px-5 py-4 sm:px-7", tone === "dark" ? "border-white/15" : "border-line", hideTitle && "sr-only")}>
              <h2 id={titleId} className="label">
                {title}
              </h2>
              {showClose && !hideTitle && (
                <button type="button" onClick={onClose} className="-mr-2 grid size-11 place-items-center" aria-label={`Close ${title.toLowerCase()}`}>
                  <X className="size-5" strokeWidth={1.25} />
                </button>
              )}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
            {footer}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
