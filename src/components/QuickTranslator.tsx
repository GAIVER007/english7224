import { useEffect, useRef, useState } from "react";
import { ArrowRightLeft, Check, Copy, Languages, LoaderCircle, Volume2, X } from "lucide-react";
import { OfflineModels } from "./OfflineModels";
import { speak } from "@/lib/store";
import {
  detectTranslationLanguage,
  oppositeLanguage,
  requestTranslation,
  translationInputError,
  TRANSLATION_MAX_CHARS,
  type TranslationMode,
  type TranslationResult,
} from "@/lib/translation";

const labels = { ru: "Русский", en: "Английский" };
export function QuickTranslator() {
  const [modelsReady, setModelsReady] = useState(false);
  const [modelCheck, setModelCheck] = useState(0);
  const [text, setText] = useState("");
  const [mode, setMode] = useState<TranslationMode>("auto");
  const [result, setResult] = useState<{ key: string; value: TranslationResult } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [composing, setComposing] = useState(false);
  const cache = useRef(new Map<string, TranslationResult>());
  const textarea = useRef<HTMLTextAreaElement>(null);
  const trimmed = text.trim();
  const source = mode === "auto" ? detectTranslationLanguage(trimmed) : mode;
  const target = oppositeLanguage(source);
  const key = `${source}:${trimmed}`;
  const inputError = translationInputError(text);
  const current = result?.key === key && !inputError && !composing ? result.value : null;

  useEffect(() => {
    const controller = new AbortController();
    let live = true;
    setError("");
    setCopied(false);
    setCopyError("");
    if (!modelsReady || !trimmed || inputError || composing) {
      setLoading(false);
      return () => controller.abort();
    }
    const cached = cache.current.get(key);
    if (cached) {
      setResult({ key, value: cached });
      setLoading(false);
      return () => controller.abort();
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const value = await requestTranslation(trimmed, source, controller.signal);
        if (!live) return;
        cache.current.set(key, value);
        if (cache.current.size > 50) cache.current.delete(cache.current.keys().next().value!);
        setResult({ key, value });
      } catch (failure) {
        if (!live) return;
        if (
          failure &&
          typeof failure === "object" &&
          "code" in failure &&
          failure.code === "not-installed"
        ) {
          setModelsReady(false);
          setModelCheck((value) => value + 1);
        }
        setError(
          failure instanceof Error && failure.message !== "Failed to fetch"
            ? failure.message
            : "Локальная модель не смогла завершить перевод. Попробуй более короткую фразу.",
        );
      } finally {
        if (live) setLoading(false);
      }
    }, 650);
    return () => {
      live = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed, source, key, inputError, attempt, composing, modelsReady]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <>
      <OfflineModels key={modelCheck} onReady={setModelsReady} />
      <div className="flex items-center gap-3 mb-4">
        <label className="flex-1 text-sm font-bold" htmlFor="translation-mode">
          С какого языка
          <select
            id="translation-mode"
            className="input-field w-full mt-2"
            value={mode}
            onChange={(event) => setMode(event.target.value as TranslationMode)}
          >
            <option value="auto">Определить автоматически</option>
            <option value="ru">Русский</option>
            <option value="en">Английский</option>
          </select>
        </label>
        <button
          className="icon-button mt-7 shrink-0"
          aria-label="Поменять языки местами"
          onClick={() => {
            setMode(target);
            if (current) setText(current.translation);
            textarea.current?.focus();
          }}
        >
          <ArrowRightLeft size={20} aria-hidden="true" />
        </button>
      </div>
      <section className="card-soft p-5" aria-labelledby="source-title">
        <div className="flex justify-between items-center gap-2">
          <label id="source-title" htmlFor="translation-text" className="font-bold">
            {trimmed ? labels[source] : "Твой текст"}
          </label>
          <button
            className="icon-button"
            aria-label="Очистить текст"
            disabled={!text}
            onClick={() => {
              setText("");
              setResult(null);
              textarea.current?.focus();
            }}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <textarea
          ref={textarea}
          id="translation-text"
          className="translation-input"
          rows={4}
          value={text}
          maxLength={TRANSLATION_MAX_CHARS}
          placeholder="Например: Где ближайшая станция?"
          onChange={(event) => setText(event.target.value)}
          onCompositionStart={() => setComposing(true)}
          onCompositionEnd={() => setComposing(false)}
          aria-describedby="translation-hint translation-count"
          aria-invalid={Boolean(inputError)}
        />
        <div className="flex justify-between gap-3 items-center">
          <button
            className="btn-ghost text-sm"
            disabled={!trimmed || Boolean(inputError)}
            aria-label="Озвучить исходный текст"
            onClick={() => speak(trimmed, 1, source === "ru" ? "ru-RU" : "en-US")}
          >
            <Volume2 size={18} aria-hidden="true" />
            Слушать
          </button>
          <span id="translation-count" className="text-xs text-muted-foreground">
            {text.length}/{TRANSLATION_MAX_CHARS}
          </span>
        </div>
      </section>
      <p id="translation-hint" className="text-xs text-muted-foreground mt-3">
        Без суточного лимита. До 5 000 символов за один текст. Перевод появится после короткой паузы
        ввода. Смешанную фразу лучше перевести с выбранного языка.
      </p>
      <section
        className="card-soft translation-result p-5 mt-5"
        aria-labelledby="translation-title"
        aria-busy={loading}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id="translation-title" className="text-base">
            {trimmed ? labels[target] : "Перевод"}
          </h2>
          <Languages size={20} className="text-primary" aria-hidden="true" />
        </div>
        <div aria-live="polite" aria-atomic="true">
          {inputError ? (
            <p className="text-destructive mt-4">{inputError}</p>
          ) : error ? (
            <div className="mt-4">
              <p role="alert">{error}</p>
              <button
                className="btn-ghost w-full mt-3"
                onClick={() => setAttempt((value) => value + 1)}
              >
                Попробовать снова
              </button>
            </div>
          ) : current ? (
            <p className="translation-output" lang={target}>
              {current.translation}
            </p>
          ) : loading ? (
            <p className="subcopy mt-5 flex items-center gap-2">
              <LoaderCircle className="animate-spin" size={18} aria-hidden="true" />
              Переводим…
            </p>
          ) : (
            <p className="subcopy mt-5">
              {modelsReady
                ? "Напиши по-русски или по-английски — и здесь появится перевод."
                : "Сначала скачай языковые пакеты. После этого интернет для перевода не понадобится."}
            </p>
          )}
        </div>
        {current && (
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className="btn-ghost"
              onClick={() => speak(current.translation, 1, target === "ru" ? "ru-RU" : "en-US")}
              aria-label="Озвучить перевод"
            >
              <Volume2 size={18} aria-hidden="true" />
              Слушать
            </button>
            <button
              className="btn-ghost"
              onClick={async () => {
                const copyingKey = key;
                try {
                  await navigator.clipboard.writeText(current.translation);
                  if (textarea.current?.value.trim() === copyingKey.slice(3)) {
                    setCopied(true);
                    setCopyError("");
                  }
                } catch {
                  setCopyError("Не удалось скопировать. Выдели перевод и скопируй вручную.");
                }
              }}
            >
              {copied ? (
                <Check size={18} aria-hidden="true" />
              ) : (
                <Copy size={18} aria-hidden="true" />
              )}
              {copied ? "Скопировано" : "Копировать"}
            </button>
          </div>
        )}
        {copyError && (
          <p role="status" className="text-sm mt-3">
            {copyError}
          </p>
        )}
      </section>
      <p className="text-xs text-muted-foreground mt-5 leading-relaxed">
        Локальные модели OPUS-MT (CC BY 4.0). Перевод вычисляется на устройстве; скорость и качество
        зависят от модели и телефона. Озвучка без сети доступна, если в системе установлен нужный
        голос. История текста не сохраняется.
        <a className="underline ml-1" href="/model-licenses.txt" target="_blank" rel="noreferrer">
          О моделях
        </a>
      </p>
    </>
  );
}
