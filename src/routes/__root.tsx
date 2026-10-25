import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import { OfflineApp } from "@/components/OfflineApp";
import { useAppState } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Страница не найдена</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Проверьте адрес или вернитесь на главную.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Не удалось загрузить страницу
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Попробуйте ещё раз или вернитесь на главную.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Попробовать снова
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            На главную
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "SpeakUp" },
      { name: "theme-color", content: "#6350d6" },
      { name: "apple-mobile-web-app-title", content: "SpeakUp" },
      { name: "description", content: "Разговорный английский каждый день" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",
      },
      { rel: "icon", href: "/icons/icon-192.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/icons/icon-180.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function CloudSync() {
  useEffect(() => {
    let active = true;
    void import("@/lib/cloud-sync").then(({ startSync, stopSync }) => {
      if (!active) return;
      void supabase.auth.getUser().then(({ data }) => {
        if (data.user) void startSync(data.user.id);
      });
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_OUT") stopSync();
        else if (session?.user && (event === "SIGNED_IN" || event === "INITIAL_SESSION"))
          void startSync(session.user.id);
      });
      cleanup = () => data.subscription.unsubscribe();
    });
    let cleanup = () => {};
    return () => {
      active = false;
      cleanup();
    };
  }, []);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <CloudSync />
      <AppNotices />
      <OfflineApp />
      <Outlet />
    </QueryClientProvider>
  );
}

function AppNotices() {
  const { storageError } = useAppState();
  const [audioError, setAudioError] = useState(false);
  useEffect(() => {
    const showError = () => setAudioError(true);
    window.addEventListener("speakup-audio-error", showError);
    return () => window.removeEventListener("speakup-audio-error", showError);
  }, []);
  return (
    <>
      {storageError && (
        <p
          role="alert"
          className="mx-auto mt-4 max-w-3xl rounded-xl border border-destructive bg-card p-4 text-sm"
        >
          Не удалось прочитать или сохранить часть прогресса. Вы можете продолжить занятие, но
          проверьте разрешение браузера на сохранение данных: последние изменения могут потеряться
          после закрытия страницы.
        </p>
      )}
      {audioError && (
        <div
          role="status"
          className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center gap-3 rounded-xl bg-muted p-4 text-sm"
        >
          <p>
            Не удалось воспроизвести речь. Проверьте звук и доступность английского голоса в
            браузере. Текст упражнений остаётся доступен.
          </p>
          <button className="btn-ghost" onClick={() => setAudioError(false)}>
            Закрыть
          </button>
        </div>
      )}
    </>
  );
}
