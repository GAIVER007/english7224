import { validateAppStateForImport, type AppState } from "./store";

export const MAX_BACKUP_BYTES = 1_048_576;
const BACKUP_KIND = "speakup-progress";
const BACKUP_VERSION = 1;

interface BackupEnvelope {
  kind: typeof BACKUP_KIND;
  version: typeof BACKUP_VERSION;
  exportedAt: string;
  state: AppState;
}

export interface BackupPreview {
  state: AppState;
  exportedAt: string;
}

function byteLength(value: string): number {
  return new TextEncoder().encode(value).byteLength;
}

function assertSize(value: string) {
  if (byteLength(value) > MAX_BACKUP_BYTES) {
    throw new Error("Файл резервной копии слишком большой. Максимальный размер — 1 МБ.");
  }
}

export function createBackup(state: AppState, now: number | Date = Date.now()): string {
  const exportDate = new Date(now);
  if (!Number.isFinite(exportDate.getTime())) {
    throw new Error("Не удалось создать резервную копию: указана некорректная дата.");
  }
  const exportedAt = exportDate.toISOString();
  const envelope: BackupEnvelope = {
    kind: BACKUP_KIND,
    version: BACKUP_VERSION,
    exportedAt,
    state: validateAppStateForImport(state),
  };
  const backup = JSON.stringify(envelope, null, 2);
  assertSize(backup);
  return backup;
}

export function parseBackup(text: string): BackupPreview {
  assertSize(text);
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error("Файл резервной копии повреждён или имеет неверный формат.");
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Файл резервной копии повреждён: ожидался объект JSON.");
  }
  const source = value as Record<string, unknown>;
  if (source["kind"] !== BACKUP_KIND) {
    throw new Error("Выбранный файл не является резервной копией SpeakUp.");
  }
  if (source["version"] !== BACKUP_VERSION) {
    throw new Error("Эта версия резервной копии не поддерживается.");
  }
  if (
    typeof source["exportedAt"] !== "string" ||
    !Number.isFinite(Date.parse(source["exportedAt"]))
  ) {
    throw new Error("В резервной копии указана некорректная дата создания.");
  }

  try {
    return {
      state: validateAppStateForImport(source["state"]),
      exportedAt: source["exportedAt"],
    };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Неизвестная ошибка проверки.";
    throw new Error(`Резервная копия содержит некорректный прогресс. ${detail}`);
  }
}
