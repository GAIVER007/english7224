import { expect, it, vi } from "vitest";

import { activateOfflineUpdate } from "@/components/offline-app";

it("activates a waiting offline update only after an explicit request", () => {
  const postMessage = vi.fn();
  const registration = {
    waiting: { postMessage },
  } as unknown as ServiceWorkerRegistration;

  expect(activateOfflineUpdate(registration)).toBe(true);
  expect(postMessage).toHaveBeenCalledOnce();
  expect(postMessage).toHaveBeenCalledWith({ type: "SKIP_WAITING" });
});

it("does not claim an update when no worker is waiting", () => {
  const registration = { waiting: null } as unknown as ServiceWorkerRegistration;

  expect(activateOfflineUpdate(registration)).toBe(false);
});
