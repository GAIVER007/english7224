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
import { validateTutorSearch } from "@/lib/tutor";
import { currentStreak } from "@/lib/learning";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/account")({
  validateSearch: validateTutorSearch,
  head: () => ({
    meta: [
      { title: "Аккаунт — SpeakUp" },
      {
        name: "description",
        content: "Войдите, чтобы прогресс и рейтинг сохранялись на всех устройствах.",
      },
      { property: "og:title", content: "Аккаунт — SpeakUp" },
      { property: "og:description", content: "Прогресс и рейтинг на телефоне и компьютере." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
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

const statusDot: Record<SyncStatus, string> = {
  off: "bg-muted-foreground",
  loading: "bg-primary animate-pulse",
  saving: "bg-primary animate-pulse",
  saved: "bg-primary",
  error: "bg-destructive",
  conflict: "bg-destructive animate-pulse",
};

const perks = [
  { icon: "☁️", title: "Облако", text: "Рейтинг и результаты не пропадут" },
  { icon: "📱", title: "Телефон", text: "Продолжайте с любого устройства" },
  { icon: "🔥", title: "Серия", text: "Дни подряд считаются везде" },
];

function AccountPage() {
  const { state } = useAppState();
  const { tutor } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [conflict, setConflict] = useState(getSyncConflict);
  const [sync, setSync] = useState<SyncStatus>(getSyncStatus());
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [recovery, setRecovery] = useState(false);
  const [changing, setChanging] = useState(false);
  const [newPass, setNewPass] = useState("");

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
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      authChanged = true;
      if (event === "PASSWORD_RECOVERY") {
        setRecovery(true);
        setChanging(true);
      }
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
    setNotice(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      });
      if (error) setError("Не удалось войти. Проверь почту, пароль и подключение.");
      else if (tutor) await navigate({ to: "/tutor", search: { tutor }, replace: true });
    } catch {
      setError("Нет связи с аккаунтом. Проверь интернет и повтори вход.");
    } finally {
      setBusy(false);
    }
  }

  async function forgot() {
    setError(null);
    setNotice(null);
    if (!form.email.trim()) {
      setError("Введите почту, и мы пришлём ссылку для нового пароля.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(form.email.trim(), {
        redirectTo: `${window.location.origin}/account`,
      });
      if (error) setError("Не удалось отправить письмо. Попробуйте позже.");
      else setNotice("Письмо отправлено. Откройте ссылку из него на этом устройстве.");
    } catch {
      setError("Нет связи. Проверьте интернет.");
    } finally {
      setBusy(false);
    }
  }

  async function savePassword(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (newPass.length < 8) {
      setError("Пароль должен быть не короче 8 символов.");
      return;
    }
    if (email && newPass.toLowerCase() === email.toLowerCase()) {
      setError("Пароль не должен совпадать с почтой.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPass });
      if (error) setError("Не удалось сменить пароль. Попробуйте другой.");
      else {
        setNotice("Пароль изменён ✓");
        setNewPass("");
        setChanging(false);
        setRecovery(false);
      }
    } catch {
      setError("Нет связи. Проверьте интернет.");
    } finally {
      setBusy(false);
    }
  }

  const initial = email?.[0]?.toUpperCase() ?? "?";

  return (
    <main className="mx-auto max-w-md space-y-6 px-4 py-6">
      {tutor ? (
        <Link to="/tutor" search={{ tutor }} className="text-sm text-muted-foreground">
          ← К разговору с Mira
        </Link>
      ) : (
        <Link to="/" className="text-sm text-muted-foreground">
          ← На главную
        </Link>
      )}

      <section className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-lg">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-foreground/10" />
        <div className="absolute -bottom-10 -left-6 h-24 w-24 rounded-full bg-primary-foreground/10" />
        <p className="relative text-sm opacity-80">SpeakUp</p>
        <h1 className="relative mt-1 text-2xl font-bold">{email ? "Ваш аккаунт" : "Аккаунт"}</h1>
        <p className="relative mt-2 text-sm opacity-90">
          {email
            ? "Весь прогресс сохраняется в облаке автоматически."
            : "Войдите, и ваш английский будет с вами на любом устройстве."}
        </p>
      </section>

      {!checked ? (
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      ) : email ? (
        <section className="space-y-4 rounded-xl border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Вы вошли как</p>
              <p className="truncate font-semibold">{email}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <Stat value={state.xp} label="очков" />
            <Stat value={currentStreak(state)} label="дней подряд" />
            <Stat value={state.resultHistory?.length ?? 0} label="результатов" />
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-muted p-3 text-sm" role="status">
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${statusDot[sync]}`} />
            <span>{statusText[sync]}</span>
          </div>
          {sync === "error" && (
            <button className="btn-secondary w-full" onClick={() => void retrySync()}>
              Повторить синхронизацию
            </button>
          )}
          {conflict && <SyncConflictPanel conflict={conflict} onResolve={resolveSyncConflict} />}

          {notice && <p className="text-sm text-primary">{notice}</p>}
          {changing ? (
            <form onSubmit={savePassword} className="space-y-2 rounded-lg border p-3">
              <label htmlFor="new-password" className="block text-sm font-medium">
                {recovery ? "Придумайте новый пароль" : "Новый пароль"}
              </label>
              <input
                id="new-password"
                className="w-full rounded-md border bg-background p-3"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <div className="flex gap-2">
                <button className="btn-primary flex-1" disabled={busy}>
                  {busy ? "Сохраняю…" : "Сохранить"}
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => {
                    setChanging(false);
                    setError(null);
                  }}
                >
                  Отмена
                </button>
              </div>
            </form>
          ) : (
            <button className="btn-secondary w-full" onClick={() => setChanging(true)}>
              🔒 Сменить пароль
            </button>
          )}

          <p className="text-xs text-muted-foreground">
            На телефоне войдите с той же почтой — прогресс загрузится сам.
          </p>
          <button className="btn-ghost w-full" onClick={() => void supabase.auth.signOut()}>
            Выйти
          </button>
        </section>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            {perks.map((p) => (
              <div key={p.title} className="rounded-xl border bg-card p-3 text-center">
                <div className="text-2xl">{p.icon}</div>
                <p className="mt-1 text-xs font-semibold">{p.title}</p>
                <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
          <form onSubmit={signIn} className="space-y-3 rounded-xl border bg-card p-5 shadow-sm">
            <label htmlFor="account-email" className="block text-sm font-medium">
              Почта
            </label>
            <input
              id="account-email"
              className="w-full rounded-md border bg-background p-3"
              type="email"
              inputMode="email"
              placeholder="you@mail.ru"
              autoComplete="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <label htmlFor="account-password" className="block text-sm font-medium">
              Пароль
            </label>
            <div className="relative">
              <input
                id="account-password"
                className="w-full rounded-md border bg-background p-3 pr-12"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                aria-label={showPass ? "Скрыть пароль" : "Показать пароль"}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground"
                onClick={() => setShowPass((v) => !v)}
              >
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            {notice && <p className="text-sm text-primary">{notice}</p>}
            <button className="btn-primary w-full" disabled={busy}>
              {busy ? "Вхожу…" : "Войти"}
            </button>
            <button
              type="button"
              className="w-full text-center text-sm text-muted-foreground underline"
              onClick={() => void forgot()}
              disabled={busy}
            >
              Забыли пароль?
            </button>
          </form>
          <p className="text-center text-xs text-muted-foreground">
            Курс доступен без входа. Аккаунт нужен для звонков Mira и синхронизации прогресса.
          </p>
        </>
      )}
    </main>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-lg bg-muted p-2">
      <p className="text-xl font-bold">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
