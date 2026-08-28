export function makeId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function toNumber(value: unknown, fallback = 0): number {
  if (value == null) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function toIso(value: Date | string | null | undefined): string {
  if (!value) return new Date().toISOString();
  if (typeof value === 'string') return value;
  return value.toISOString();
}
