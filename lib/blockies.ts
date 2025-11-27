import blockies from 'ethereum-blockies';

export function getBlockieDataUrl(seed?: string): string {
  const normalized = seed?.trim().toLowerCase();
  if (!normalized) return '';

  try {
    const icon = blockies.create({
      seed: normalized,
      size: 8,
      scale: 8,
    });

    return icon?.toDataURL?.() ?? '';
  } catch (err) {
    console.error('Blockies generation failed', err);
    return '';
  }
}
