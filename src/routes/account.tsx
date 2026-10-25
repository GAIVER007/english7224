import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  getSyncStatus,
  onSyncStatus,
  getSyncConflict,
  resolveSyncConflict,
  retrySync,
  type SyncStatus,
} from "@/lib/cloud-sync";
import { SyncConflictPanel } from "@/components/SyncConflictPanel";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Аккаунт — SpeakUp" },
      {
        name: "description",
        content: "Войдите, чтобы прогресс и рейтинг сохранялись на всех устройствах.",
      },
      { property: "og:title", content: "Аккаунт — SpeakUp" },
      { property: "og:description", content: "Прогресс и рейтинг на телефоне и компьютере." },
    ],
  }),
  component: AccountPage,
});

const statusText: Record<SyncStatus, string> = {
  off: "Не синхронизировано",
  loading: "Загружаю прогресс…",
  saving: "Сохраняю…",
  saved: "Прогресс сохранён в аккаунте ✓",
  error:
    "Синхронизация не завершена. Изменения остаются на этом устройстве. Проверьте интернет и повторите попытку.",
  conflict: "Нужно выбрать версию спорных изменений.",
};

function AccountPage() {
  const { state } = useAppState();
  const [email, setEmail] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [conflict, setConflict] = useState(getSyncConflict);
  const [sync, setSync] = useState<SyncStatus>(getSyncStatus());
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    let authChanged = false;
    void supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!active || authChanged) return;
        setEmail(data.user?.email ?? null);
        setChecked(true);
      })
      .catch(() => {
        if (!active || authChanged) return;
        setChecked(true);
        setError("Не удалось проверить аккаунт. Локальные занятия доступны без входа.");
      });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      authChanged = true;
      setEmail(session?.user.email ?? null);
      setChecked(true);
    });
    const off = onSyncStatus((status) => {
      setSync(status);
      setConflict(getSyncConflict());
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
      off();
    };
  }, []);

  async function signIn(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword(form);
      if (error) setError("Не удалось войти. Проверь почту, пароль и подключение.");
    } catch {
      setError("Нет связи с аккаунтом. Проверь интернет и повтори вход.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-md space-y-6 px-4 py-8">
      <Link to="/" className="text-sm text-muted-foreground">
        ← На главную
      </Link>
      <h1 className="text-2xl font-bold">Аккаунт</h1>
      {!checked ? null : email ? (
        <section className="space-y-4 rounded-xl border bg-card p-5">
          <p>
            Вы вошли как <b>{email}</b>
          </p>
          <p role="status" className="text-sm">
            {statusText[sync]}
          </p>
          {sync === "error" && (
            <button className="btn-secondary w-full" onClick={() => void retrySync()}>
              Повторить синхронизацию
            </button>
          )}
          {conflict && <SyncConflictPanel conflict={conflict} onResolve={resolveSyncConflict} />}
          <p className="text-sm text-muted-foreground">
            Очки: {state.xp} · Результатов: {state.resultHistory?.length ?? 0}. Для другого
            устройства используйте ту же почту. Если есть спорные изменения, приложение предложит
            выбрать версию.
          </p>
          <button className="btn-ghost" onClick={() => void supabase.auth.signOut()}>
            Выйти
          </button>
        </section>
      ) : (
        <form onSubmit={signIn} className="space-y-3 rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Войдите, чтобы рейтинг и результаты сохранялись в аккаунте и были на всех устройствах.
          </p>
          <label htmlFor="account-email" className="block text-sm font-medium">
            Почта
          </label>
          <input
            id="account-email"
            className="w-full rounded-md border bg-background p-3"
            type="email"
            placeholder="Почта"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <label htmlFor="account-password" className="block text-sm font-medium">
            Пароль
          </label>
          <input
            id="account-password"
            className="w-full rounded-md border bg-background p-3"
            type="password"
            placeholder="Пароль"
            autoComplete="current-password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <button className="btn-primary w-full" disabled={busy}>
            {busy ? "Вхожу…" : "Войти"}
          </button>
        </form>
      )}
    </main>
  );
}
