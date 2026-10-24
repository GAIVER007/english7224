export async function prepareOfflineApp(): Promise<ServiceWorkerRegistration | null> {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return null;
  return navigator.serviceWorker.register("/offline-worker.js", { scope: "/" });
}

export function activateOfflineUpdate(registration: ServiceWorkerRegistration): boolean {
  if (!registration.waiting) return false;
  registration.waiting.postMessage({ type: "SKIP_WAITING" });
  return true;
}
