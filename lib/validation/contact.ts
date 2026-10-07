/** Validación del formulario de contacto (compartida con el envío real de la Fase 2). */
export interface ContactInput {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\d\s.-]{9,20}$/;

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  if (input.name.trim().length < 2) errors.name = "Indica tu nombre.";
  if (!EMAIL.test(input.email.trim())) errors.email = "Introduce un email válido.";
  if (input.phone.trim() && !PHONE.test(input.phone.trim())) errors.phone = "Introduce un teléfono válido.";
  if (input.message.trim().length < 5) errors.message = "Cuéntanos qué necesitas.";
  return errors;
}
