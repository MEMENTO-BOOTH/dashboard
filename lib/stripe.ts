import "server-only";

import { env } from "@/lib/env";

type StripeCharge = {
  amount: number;
  paid: boolean;
  refunded: boolean;
  currency: string;
  created: number;
  metadata?: { order_id?: string };
  payment_method_details?: { card?: { brand?: string; last4?: string } };
};

export type OrderCard = { brand: string; last4: string };

export type StripeRevenue = {
  totalEuros: number;
  count: number;
  daily: { day: string; amount: number }[];
};

const DAYS = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];

export async function getStripeRevenue(): Promise<StripeRevenue> {
  const empty: StripeRevenue = { totalEuros: 0, count: 0, daily: lastSevenDays() };
  if (!env.STRIPE_SECRET_KEY) return empty;

  const res = await fetch("https://api.stripe.com/v1/charges?limit=100", {
    headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` },
    cache: "no-store",
  });
  if (!res.ok) return empty;

  const json = (await res.json()) as { data?: StripeCharge[] };
  const paid = (json.data ?? []).filter((charge) => charge.paid && !charge.refunded);

  const totalCents = paid.reduce((sum, charge) => sum + charge.amount, 0);
  const daily = lastSevenDays();
  for (const charge of paid) {
    const date = new Date(charge.created * 1000);
    const key = date.toISOString().slice(0, 10);
    const slot = daily.find((d) => d.key === key);
    if (slot) slot.amount += charge.amount / 100;
  }

  return {
    totalEuros: Math.round(totalCents / 100),
    count: paid.length,
    daily: daily.map(({ day, amount }) => ({ day, amount: Math.round(amount) })),
  };
}

export async function getOrderCards(): Promise<Record<string, OrderCard>> {
  if (!env.STRIPE_SECRET_KEY) return {};

  const res = await fetch("https://api.stripe.com/v1/charges?limit=100", {
    headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` },
    cache: "no-store",
  });
  if (!res.ok) return {};

  const json = (await res.json()) as { data?: StripeCharge[] };
  const cards: Record<string, OrderCard> = {};
  for (const charge of json.data ?? []) {
    const orderId = charge.metadata?.order_id;
    const card = charge.payment_method_details?.card;
    if (!(orderId && card?.brand && card.last4 && charge.paid) || charge.refunded) continue;
    if (!cards[orderId]) cards[orderId] = { brand: card.brand, last4: card.last4 };
  }
  return cards;
}

function lastSevenDays(): { key: string; day: string; amount: number }[] {
  const today = new Date();
  const out: { key: string; day: string; amount: number }[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    out.push({ key: date.toISOString().slice(0, 10), day: DAYS[date.getDay()] ?? "", amount: 0 });
  }
  return out;
}
