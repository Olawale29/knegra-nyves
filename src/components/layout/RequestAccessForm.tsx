"use client";

import { useId, useState } from "react";
import { ArrowRight } from "lucide-react";

/** Newsletter UI. Demo only: the address is validated locally and never sent anywhere. */
export function RequestAccessForm({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  const line = tone === "dark" ? "border-ivory/50 focus-within:border-ivory" : "border-line-strong focus-within:border-ink";

  if (state === "done") {
    return (
      <p role="status" className="mt-8 max-w-md text-[14px] leading-relaxed opacity-85">
        Thank you — you are on the list. <span className="opacity-70">(Demo: nothing was sent; the address stays in this browser tab only.)</span>
      </p>
    );
  }

  return (
    <form
      noValidate
      className="mt-8 max-w-md"
      onSubmit={(e) => {
        e.preventDefault();
        setState(valid ? "done" : "error");
      }}
    >
      <label htmlFor={id} className="eyebrow opacity-70">
        Email address
      </label>
      <div className={`mt-2 flex items-center border-b ${line} transition-colors`}>
        <input
          id={id}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          aria-invalid={state === "error"}
          aria-describedby={state === "error" ? `${id}-err` : undefined}
          placeholder="you@example.com"
          className="min-h-12 min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:opacity-45"
        />
        <button type="submit" className="grid size-12 place-items-center" aria-label="Request access">
          <ArrowRight className="size-4" strokeWidth={1.25} />
        </button>
      </div>
      {state === "error" && (
        <p id={`${id}-err`} className="mt-2 text-[12.5px] text-camel">
          Please enter a valid email address.
        </p>
      )}
      <p className="mt-3 text-[11.5px] opacity-55">Demo form — no data is collected.</p>
    </form>
  );
}
