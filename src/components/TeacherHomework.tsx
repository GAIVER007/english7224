import { useState } from "react";
import { BookOpen, FilePlus2 } from "lucide-react";
import { useAppState } from "@/lib/store";
import {
  assignmentMaterial,
  assignmentTextLimit,
  assignmentTitleLimit,
  type AssignmentMaterial,
} from "@/lib/tutor";
import { homeworkFileLimitMb, readHomeworkFile } from "@/lib/read-homework";

function HomeworkDraft({
  onSave,
  onCancel,
}: {
  onSave: (material: AssignmentMaterial) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [reading, setReading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const material = assignmentMaterial.safeParse({ title, text });

  async function importFile(file: File) {
    setReading(true);
    setError("");
    setNotice("");
    try {
      const result = await readHomeworkFile(file);
      setTitle(file.name.replace(/\.[^.]+$/, "").slice(0, assignmentTitleLimit));
      setText(result.text);
      setNotice(result.notice);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось открыть файл.");
    } finally {
      setReading(false);
    }
  }

  return (
    <form
      className="space-y-3 rounded-xl border p-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!reading && material.success) onSave(material.data);
      }}
    >
      <fieldset disabled={reading} className="min-w-0 space-y-3">
        <label className="block font-medium">
          Файл от репетитора
          <span className="block text-sm font-normal text-muted-foreground">
            PDF с текстом, Word (.docx) или TXT до {homeworkFileLimitMb} МБ. Можно сразу вставить
            текст ниже.
          </span>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            className="mt-2 block w-full text-sm file:mr-3 file:rounded-lg file:border file:px-3 file:py-2"
            onChange={(e) => {
              const file = e.currentTarget.files?.[0];
              e.currentTarget.value = "";
              if (file) void importFile(file);
            }}
          />
        </label>
        <label className="block">
          Название задания
          <input
            className="mt-1 block w-full rounded-lg border p-2"
            value={title}
            maxLength={assignmentTitleLimit}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label className="block">
          Текст для разбора
          <textarea
            className="mt-1 block w-full rounded-lg border p-2"
            rows={6}
            value={text}
            aria-describedby="exercise-length"
            onChange={(e) => setText(e.target.value)}
          />
        </label>
        <p id="exercise-length" className="text-sm text-muted-foreground">
          {text.trim().length > assignmentTextLimit ? "Оставьте упражнения на одно занятие. " : ""}
          {text.trim().length} из {assignmentTextLimit} знаков
        </p>
      </fieldset>
      {reading && <p role="status">Читаем документ…</p>}
      {error && <p role="alert">{error}</p>}
      {notice && <p role="status">{notice}</p>}
      <div className="flex flex-wrap gap-2">
        <button className="btn-primary" type="submit" disabled={reading || !material.success}>
          Сохранить задание
        </button>
        <button className="btn-ghost" type="button" onClick={onCancel}>
          Отменить
        </button>
      </div>
    </form>
  );
}

export function TeacherHomework({
  selectedId,
  onSelect,
  disabled,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  disabled: boolean;
}) {
  const { state, update, ready } = useAppState();
  const [adding, setAdding] = useState(false);
  const entries = Object.entries(state.teacherAssignments ?? {}).sort(
    ([, a], [, b]) => b.createdAt - a.createdAt,
  );
  const selected = state.teacherAssignments?.[selectedId];

  function save(material: AssignmentMaterial) {
    const id = crypto.randomUUID();
    const assignment = { ...material, createdAt: Date.now(), done: false };
    update((s) => ({ ...s, teacherAssignments: { ...s.teacherAssignments, [id]: assignment } }));
    onSelect(id);
    setAdding(false);
  }

  return (
    <fieldset disabled={disabled || !ready} className="min-w-0 space-y-3 rounded-2xl border p-4">
      <legend className="px-1 font-semibold">Задания от репетитора</legend>
      {(entries.length > 0 || selectedId) && (
        <label className="block">
          Материал занятия
          <select
            className="mt-1 block w-full rounded-lg border p-2"
            value={selectedId}
            onChange={(e) => onSelect(e.target.value)}
          >
            <option value="">Разговор по теме</option>
            {selectedId && !selected && <option value={selectedId}>Задание недоступно</option>}
            {entries.map(([id, item]) => (
              <option key={id} value={id}>
                {item.title}
                {item.done && " · выполнено"}
              </option>
            ))}
          </select>
        </label>
      )}
      {selected && (
        <div className="space-y-3">
          <details key={selectedId} className="rounded-xl bg-muted p-3">
            <summary className="cursor-pointer">
              <BookOpen aria-hidden="true" size={16} className="mr-2 inline" />
              Текст задания
            </summary>
            <p className="mt-2 max-h-64 overflow-y-auto whitespace-pre-wrap break-words">
              {selected.text}
            </p>
          </details>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selected.done}
              onChange={(e) => {
                const done = e.target.checked;
                update((s) => {
                  const item = s.teacherAssignments?.[selectedId];
                  return item
                    ? {
                        ...s,
                        teacherAssignments: {
                          ...s.teacherAssignments,
                          [selectedId]: { ...item, done },
                        },
                      }
                    : s;
                });
              }}
            />{" "}
            Задание выполнено
          </label>
        </div>
      )}
      {adding ? (
        <HomeworkDraft onSave={save} onCancel={() => setAdding(false)} />
      ) : (
        <button className="btn-ghost" type="button" onClick={() => setAdding(true)}>
          <FilePlus2 aria-hidden="true" size={17} />
          Добавить задание
        </button>
      )}
    </fieldset>
  );
}
