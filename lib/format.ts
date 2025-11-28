export function formatCompactNumber(value: number | string | undefined | null): string {
  const num = Number(value ?? 0);
  if (!Number.isFinite(num)) return '0';
  const abs = Math.abs(num);
  if (abs >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function formatDate(timestamp?: number) {
  return timestamp
    ? new Date(timestamp * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
    : '—';
}
