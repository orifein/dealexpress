const ilsFormatter = new Intl.NumberFormat("he-IL", {
  style: "currency",
  currency: "ILS",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function formatIls(amount: number): string {
  return ilsFormatter.format(amount);
}

export function formatApproxIls(amount: number): string {
  const n = new Intl.NumberFormat("he-IL", { maximumFractionDigits: 0 }).format(
    amount,
  );
  return `≈ ₪${n}`;
}

export function formatUsd(amount: number): string {
  return usdFormatter.format(amount);
}

export function formatOriginalPrice(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

export function formatDateHe(iso: string): string {
  return new Intl.DateTimeFormat("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
