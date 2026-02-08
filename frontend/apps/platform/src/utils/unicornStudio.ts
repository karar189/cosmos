const UNICORN_SDK_SRC =
  'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.4/dist/unicornStudio.umd.js';

let loadPromise: Promise<void> | null = null;

declare global {
  interface Window {
    UnicornStudio?: { init: () => void };
  }
}

function hasSdkScript(): boolean {
  return Boolean(
    typeof document !== 'undefined' &&
      document.querySelector(`script[src="${UNICORN_SDK_SRC}"]`)
  );
}

export function loadUnicornStudio(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  if (window.UnicornStudio?.init) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve, reject) => {
    if (hasSdkScript()) {
      const start = Date.now();
      const timer = window.setInterval(() => {
        if (window.UnicornStudio?.init) {
          window.clearInterval(timer);
          resolve();
          return;
        }
        if (Date.now() - start > 10_000) {
          window.clearInterval(timer);
          reject(new Error('UnicornStudio SDK did not initialize in time.'));
        }
      }, 50);
      return;
    }

    const script = document.createElement('script');
    script.src = UNICORN_SDK_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error('Failed to load UnicornStudio SDK.'));
    (document.head || document.body).appendChild(script);
  });

  return loadPromise;
}

export async function initUnicornStudio(): Promise<void> {
  await loadUnicornStudio();
  window.UnicornStudio?.init?.();
}
