"use client";

import { useState } from "react";

/** Contact form UI — validated locally; nothing is sent in the demo. */
export function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof values, string>>>({});
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p role="status" className="mt-10 border-t border-line pt-8 text-[14px] leading-relaxed">
        Thank you, {values.name.split(" ")[0]}. <span className="text-taupe">Demo: your message was not sent anywhere — in the live store it would reach the house.</span>
      </p>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!values.name.trim()) next.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) next.email = "Enter a valid email address.";
    if (values.message.trim().length < 10) next.message = "Write a message of at least 10 characters.";
    setErrors(next);
    if (!Object.keys(next).length) setDone(true);
  };

  const field = (k: keyof typeof values, label: string, type = "text") => (
    <div>
      <label htmlFor={`cf-${k}`} className="mb-1.5 block text-[12.5px] text-ink-soft">
        {label}
      </label>
      {k === "message" ? (
        <textarea id={`cf-${k}`} rows={4} className="field resize-none" value={values[k]} onChange={(e) => setValues({ ...values, [k]: e.target.value })} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `cf-${k}-err` : undefined} />
      ) : (
        <input id={`cf-${k}`} type={type} autoComplete={k === "email" ? "email" : "name"} className="field" value={values[k]} onChange={(e) => setValues({ ...values, [k]: e.target.value })} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `cf-${k}-err` : undefined} />
      )}
      {errors[k] && (
        <p id={`cf-${k}-err`} className="mt-1.5 text-[12.5px] text-danger">
          {errors[k]}
        </p>
      )}
    </div>
  );

  return (
    <form noValidate onSubmit={submit} className="mt-10 space-y-5 border-t border-line pt-8">
      <p className="label">Write to us</p>
      {field("name", "Name")}
      {field("email", "Email", "email")}
      {field("message", "Message")}
      <button type="submit" className="btn btn-ink">
        Send message
      </button>
      <p className="text-[12px] text-taupe">Demo form — messages are not sent.</p>
    </form>
  );
}
