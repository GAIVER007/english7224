import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Download, RefreshCw, WifiOff, X } from "lucide-react";

import { activateOfflineUpdate, prepareOfflineApp } from "@/components/offline-app";

type OfflineStatus = "idle" | "preparing" | "ready" | "offline" | "update" | "error";

function nextReadyStatus(): OfflineStatus {
  return navigator.onLine ? "ready" : "offline";
}

export function OfflineApp() {
  const [status, setStatus] = useState<OfflineStatus>("idle");
  const [dismissed, setDismissed] = useState(false);
  const registration = useRef<ServiceWorkerRegistration | null>(null);
  const reloadForUpdate = useRef(false);

  const prepare = useCallback(async () => {
    setDismissed(false);
    setStatus("preparing");
    try {
      const result = await prepareOfflineApp();
      if (!result) {
        setStatus("idle");
        return;
      }
      registration.current = result;
      if (result.waiting && navigator.serviceWorker.controller) {
        setStatus("update");
        return;
      }
      if (result.active) setStatus(nextReadyStatus());

      const watchWorker = (worker: ServiceWorker | null) => {
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "redundant") setStatus("error");
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            setStatus("update");
          }
          if (worker.state === "activated") setStatus(nextReadyStatus());
        });
      };

      watchWorker(result.installing);
      result.addEventListener("updatefound", () => watchWorker(result.installing));
      void navigator.serviceWorker.ready.then(() => {
        setStatus((current) => (current === "update" ? current : nextReadyStatus()));
      });
    } catch (error) {
      console.error("[SpeakUp offline] Service worker registration failed.", error);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
    const start = () => void prepare();
    const goOffline = () => {
      if (navigator.serviceWorker.controller) setStatus("offline");
    };
    const goOnline = () => {
      if (navigator.serviceWorker.controller) setStatus("ready");
    };
    const handleControllerChange = () => {
      if (reloadForUpdate.current) window.location.reload();
      else setStatus(nextReadyStatus());
    };

    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);
    return () => {
      window.removeEventListener("load", start);
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
    };
  }, [prepare]);

  if (status === "idle" || dismissed) return null;

  const content = {
    preparing: {
      icon: <Download size={20} aria-hidden="true" />,
      title: "Готовим офлайн-режим…",
      detail: "Сохраняем основные разделы на этом устройстве.",
    },
    ready: {
      icon: <Check size={20} aria-hidden="true" />,
      title: "Можно заниматься без интернета",
      detail: "Основные разделы SpeakUp сохранены на этом устройстве.",
    },
    offline: {
      icon: <WifiOff size={20} aria-hidden="true" />,
      title: "Вы сейчас без сети",
      detail: "Сохранённые уроки и прогресс по-прежнему доступны.",
    },
    update: {
      icon: <RefreshCw size={20} aria-hidden="true" />,
      title: "Доступно обновление",
      detail: "Установите его, когда закончите текущую тренировку.",
    },
    error: {
      icon: <WifiOff size={20} aria-hidden="true" />,
      title: "Не удалось подготовить офлайн-режим",
      detail: "Проверьте соединение и попробуйте ещё раз.",
    },
  }[status];

  return (
    <aside
      className="fixed inset-x-4 bottom-20 z-50 mx-auto max-w-md rounded-2xl border border-border bg-card p-4 shadow-lg"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-start gap-3">
        <span className="mini-spark shrink-0">{content.icon}</span>
        <div className="min-w-0 flex-1">
          <p className="font-bold">{content.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{content.detail}</p>
        </div>
        {(status === "ready" || status === "offline") && (
          <button
            type="button"
            className="grid min-h-11 min-w-11 place-items-center rounded-full"
            aria-label="Закрыть сообщение"
            onClick={() => setDismissed(true)}
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>
      {status === "update" && (
        <button
          type="button"
          className="btn-primary mt-4 w-full"
          onClick={() => {
            const current = registration.current;
            reloadForUpdate.current = true;
            if (!current || !activateOfflineUpdate(current)) {
              reloadForUpdate.current = false;
              setStatus("error");
            } else {
              setStatus("preparing");
            }
          }}
        >
          Обновить приложение
        </button>
      )}
      {status === "error" && (
        <button type="button" className="btn-ghost mt-4 w-full" onClick={() => void prepare()}>
          Попробовать снова
        </button>
      )}
    </aside>
  );
}
