import { registerSW } from 'virtual:pwa-register'

/**
 * Explicit registration instead of the plugin's default injected script,
 * which only calls navigator.serviceWorker.register() with no update
 * handling. With registerType 'autoUpdate', calling registerSW with no
 * onNeedRefresh handler makes an update silently activate and reload —
 * important here since the app is mostly opened as a resumed, not freshly
 * loaded, home-screen icon, which otherwise never picks up new deploys.
 */
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return

  const updateSW = registerSW({ immediate: true })

  // The browser's own update check can be infrequent; also check whenever
  // the app is foregrounded, which is exactly when a stale resumed PWA
  // needs it most.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void updateSW()
  })
}
