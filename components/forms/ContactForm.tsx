"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/config/site";
import { validateContact, type ContactErrors, type ContactInput } from "@/lib/validation/contact";

const field =
  "block h-[60px] w-full border bg-surface px-[18px] text-[13px] tracking-[0.05em] text-navy placeholder:text-muted focus:border-brand focus:outline-none";

/**
 * Formulario de contacto con los campos de la web original.
 * Fase 1: valida en el navegador pero todavía no envía (la integración con
 * Google Apps Script + Brevo es la Fase 2).
 */
export function ContactForm() {
  const [values, setValues] = useState<ContactInput>({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<"idle" | "pending-integration">("idle");

  const update = (k: keyof ContactInput) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    setStatus("pending-integration");
  };

  const error = (k: keyof ContactInput) =>
    errors[k] ? (
      <p id={`${k}-error`} className="mt-1 text-xs text-error">
        {errors[k]}
      </p>
    ) : null;
  const props = (k: keyof ContactInput) => ({
    id: `contact-${k}`,
    name: k,
    value: values[k],
    onChange: update(k),
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${k}-error` : undefined,
  });
  const border = (k: keyof ContactInput) => (errors[k] ? "border-error" : "border-border");

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-[15px]">
      <div>
        <label htmlFor="contact-name" className="sr-only">
          Nombre completo
        </label>
        <input
          {...props("name")}
          type="text"
          autoComplete="name"
          placeholder="Nombre completo"
          required
          className={`${field} ${border("name")}`}
        />
        {error("name")}
      </div>
      <div>
        <label htmlFor="contact-email" className="sr-only">
          Email
        </label>
        <input
          {...props("email")}
          type="email"
          autoComplete="email"
          placeholder="Email"
          required
          className={`${field} ${border("email")}`}
        />
        {error("email")}
      </div>
      <div>
        <label htmlFor="contact-phone" className="sr-only">
          Teléfono
        </label>
        <input
          {...props("phone")}
          type="tel"
          autoComplete="tel"
          placeholder="Teléfono"
          className={`${field} ${border("phone")}`}
        />
        {error("phone")}
      </div>
      <div>
        <label htmlFor="contact-message" className="sr-only">
          Tu pedido
        </label>
        <textarea
          {...props("message")}
          rows={5}
          placeholder="Tu pedido..."
          required
          className={`${field} h-[130px] resize-y py-[18px] ${border("message")}`}
        />
        {error("message")}
      </div>
      <button
        type="submit"
        className="mt-1 h-[60px] bg-brand px-11 text-xs font-medium tracking-[0.1em] text-white uppercase transition-colors hover:bg-brand-dark"
      >
        Enviar
      </button>
      {status === "pending-integration" ? (
        <p role="status" className="border border-brand/40 bg-brand/5 p-4 text-sm text-navy">
          Versión de preproducción: el envío del formulario se activará en la Fase 2. Mientras tanto puedes escribirnos
          a{" "}
          <a href={`mailto:${site.email}`} className="text-brand underline">
            {site.email}
          </a>
          .
        </p>
      ) : null}
    </form>
  );
}
