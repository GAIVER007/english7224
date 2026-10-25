import { useEffect, useState } from "react";
import { Check, Download, LoaderCircle } from "lucide-react";
import {
  getOfflineModelStatus,
  prepareOfflineModels,
  type OfflineModelProgress,
} from "@/lib/offline-translator";

export function OfflineModels({ onReady }: { onReady: (ready: boolean) => void }) {
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [progress, setProgress] = useState<OfflineModelProgress | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let live = true;
    getOfflineModelStatus()
      .then((value) => {
        if (live) {
          setReady(value);
          onReady(value);
        }
      })
      .catch(() => {
        if (live)
          setError(
            "Не удалось проверить языковые пакеты. Нужен браузер с поддержкой WebAssembly и хранилища Cache API.",
          );
      })
      .finally(() => {
        if (live) setChecking(false);
      });
    return () => {
      live = false;
    };
  }, [onReady]);
  async function install() {
    setBusy(true);
    setError("");
    try {
      await prepareOfflineModels(setProgress);
      const installed = await getOfflineModelStatus();
      if (!installed)
        throw new Error(
          "Не удалось сохранить все файлы. Проверь свободное место и повтори загрузку.",
        );
      setReady(true);
      onReady(true);
      // Ask the browser to protect the downloaded language packs from routine eviction.
      await navigator.storage?.persist?.().catch(() => false);
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Не удалось загрузить модели. Проверь интернет и свободное место.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="card-soft p-4 mb-5" aria-label="Офлайн-модели перевода">
      <h2 className="text-base flex items-center gap-2">
        {ready ? <Check size={19} aria-hidden="true" /> : <Download size={19} aria-hidden="true" />}
        {ready ? "Языковые пакеты сохранены" : "Перевод без интернета"}
      </h2>
      <p className="text-sm text-muted-foreground mt-2">
        {ready
          ? "RU ↔ EN готов на этом устройстве. Текст никуда не отправляется, суточного лимита нет."
          : "Один раз скачай две модели RU ↔ EN — несколько сотен МБ. После загрузки они переводят прямо на устройстве. Лучше использовать Wi-Fi."}
      </p>
      {!ready && (
        <button className="btn-primary w-full mt-4" disabled={busy || checking} onClick={install}>
          {busy ? <LoaderCircle className="animate-spin" size={18} aria-hidden="true" /> : null}
          {checking
            ? "Проверяем пакеты…"
            : busy
              ? "Загружаем и готовим…"
              : "Скачать языковые пакеты"}
        </button>
      )}
      {busy && (
        <div className="mt-3" role="status">
          <p className="text-sm">
            {progress
              ? `${progress.source === "ru" ? "Русский → English" : "English → Русский"} · ${progress.phase === "downloading" ? `текущий файл ${Math.round(progress.progress)}%` : "подготовка модели"}`
              : "Подготовка загрузки…"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Оставь страницу открытой. Первый запуск может занять несколько минут.
          </p>
        </div>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive mt-3">
          {error}
        </p>
      )}
      {ready && (
        <p className="text-xs text-muted-foreground mt-2">
          Пакеты сохранены в кэше браузера. Если браузер удалит данные сайта, их потребуется скачать
          заново.
        </p>
      )}
    </section>
  );
}
