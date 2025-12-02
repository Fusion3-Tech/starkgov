import { blo } from 'blo';

export function getBlockieDataUrl(seed?: string): string {
  const normalized = seed?.trim().toLowerCase();
  if (!normalized) return '';

  const address = (normalized.startsWith('0x') ? normalized : `0x${normalized}`) as `0x${string}`;

  try {
    // blo returns a data URI directly
    return blo(address, 8) || '';
  } catch (err) {
    console.error('Identicon generation failed', err);
    return '';
  }
}
