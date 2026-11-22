/** Delivery and payment options. Keep prices in sync with the backend's model/Shipping.java. */

export const FREE_SHIPPING_FROM = 250;

export type DeliveryMethod = "courier" | "locker";
export type PaymentMethod = "cash" | "card_on_delivery";

export const DELIVERY_OPTIONS: { id: DeliveryMethod; label: string; description: string; price: number }[] = [
  { id: "courier", label: "Curier la adresă", description: "Livrare în 1–2 zile lucrătoare", price: 19.99 },
  { id: "locker", label: "Easybox / locker", description: "Ridici când vrei, în 1–3 zile", price: 12.99 },
];

export const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; description: string }[] = [
  { id: "cash", label: "Numerar la livrare", description: "Plătești curierului când primești coletul" },
  { id: "card_on_delivery", label: "Card la livrare", description: "Plătești cu cardul, la curier sau la locker" },
];

export function shippingCost(method: DeliveryMethod, subtotal: number) {
  if (subtotal === 0 || subtotal >= FREE_SHIPPING_FROM) return 0;
  return DELIVERY_OPTIONS.find((o) => o.id === method)!.price;
}

export const DELIVERY_LABEL: Record<string, string> = Object.fromEntries(DELIVERY_OPTIONS.map((o) => [o.id, o.label]));
export const PAYMENT_LABEL: Record<string, string> = Object.fromEntries(PAYMENT_OPTIONS.map((o) => [o.id, o.label]));
