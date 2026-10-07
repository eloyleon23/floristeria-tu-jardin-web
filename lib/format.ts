/**
 * Precio tal y como lo muestra la web original: "95.00€".
 * (El formato español sería "95,00 €"; el cambio queda para la fase de mejoras.)
 */
export function formatPrice(price: number | null): string {
  if (price === null) return "Consultar precio";
  return `${price.toFixed(2)}€`;
}

/** "Mostrando 1–20 de 126 resultados", con los casos singulares de WooCommerce. */
export function resultCountText(total: number, from: number, to: number): string {
  if (total === 0) return "No se han encontrado productos";
  if (total === 1) return "Mostrando el único resultado";
  if (from === 1 && to === total) return `Mostrando los ${total} resultados`;
  return `Mostrando ${from}–${to} de ${total} resultados`;
}
