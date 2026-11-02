import { LOGO_URL } from '../data/products';

// Injects the web-app manifest and iOS standalone metadata so the storefront
// can be added to the home screen. In the deployed build these live in
// /manifest.webmanifest and index.html alongside the service worker.
export function injectPwaMeta(): void {
  if (document.querySelector('link[rel="manifest"]')) return;

  const manifest = {
    name: 'House of Zichael',
    short_name: 'HOZ',
    description: 'Premium fashion, bespoke clothing and digital showroom by House of Zichael.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#111111',
    icons: [
    { src: LOGO_URL, sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: LOGO_URL, sizes: '512x512', type: 'image/png', purpose: 'any' }]

  };

  const add = (tag: string, attrs: Record<string, string>) => {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  };

  const blob = new Blob([JSON.stringify(manifest)], { type: 'application/manifest+json' });
  add('link', { rel: 'manifest', href: URL.createObjectURL(blob) });
  add('link', { rel: 'apple-touch-icon', href: LOGO_URL });
  add('meta', { name: 'theme-color', content: '#111111' });
  add('meta', { name: 'apple-mobile-web-app-capable', content: 'yes' });
  add('meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' });
  add('meta', { name: 'apple-mobile-web-app-title', content: 'HOZ' });
}

export function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & {standalone?: boolean;}).standalone === true);

}

export function isIOS(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}