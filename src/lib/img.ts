// Responsive image URLs for the two CDNs this site uses. Both resize and convert on the fly:
//   ImageKit  (ik.imagekit.io)                → ?tr=w-800,q-70,f-auto   (AVIF/WebP by Accept header)
//   Sardius / Umbraco (jhm-cms.images.sardius) → ?width=800&format=webp&quality=70
// Other hosts are returned unchanged.

const QUALITY = 70;

export function img(url: string, width: number, opts: { height?: number; cover?: boolean } = {}): string {
  const u = new URL(url);

  if (u.hostname === 'ik.imagekit.io') {
    const tr = [`w-${width}`, opts.height && `h-${opts.height}`, `q-${QUALITY}`, 'f-auto'].filter(Boolean).join(',');
    u.searchParams.set('tr', tr);
    return u.toString();
  }

  if (u.hostname.endsWith('images.sardius.media')) {
    u.searchParams.set('width', String(width));
    if (opts.height) u.searchParams.set('height', String(opts.height));
    else u.searchParams.delete('height');
    if (opts.cover || opts.height) u.searchParams.set('fit', 'cover');
    u.searchParams.set('format', 'webp');
    u.searchParams.set('quality', String(QUALITY));
    return u.toString();
  }

  return url;
}

/** srcset across widths; for square/fixed-ratio crops pass `ratio` (height / width). */
export function srcset(url: string, widths: number[], ratio?: number): string {
  return widths
    .map((w) => `${img(url, w, ratio ? { height: Math.round(w * ratio) } : {})} ${w}w`)
    .join(', ');
}
