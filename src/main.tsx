import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const APP_BUILD_ID = __APP_BUILD_ID__;

async function unregisterAllServiceWorkersAndClearCaches() {
  if (!("serviceWorker" in navigator)) return;

  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map((r) => r.unregister()));
  } catch {
    // ignore
  }

  if ("caches" in window) {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch {
      // ignore
    }
  }
}

// Prevent "old version" issues in preview/dev caused by a previously installed PWA service worker.
if (import.meta.env.DEV) {
  void unregisterAllServiceWorkersAndClearCaches();
}

// Always expose the current build marker for easy verification.
console.info(`[app] build=${APP_BUILD_ID} mode=${import.meta.env.MODE}`);
try {
  document.documentElement.dataset.build = APP_BUILD_ID;
} catch {
  // ignore
}

// If the build changed since the last visit, force-clear caches/SW once and reload.
// This prevents users from staying stuck on an older app shell.
let pendingHardRefresh = false;
if (import.meta.env.PROD) {
  const disableSWParam = new URLSearchParams(window.location.search).get("no-sw") === "1";
  if (!disableSWParam) {
    const key = "app_build_id";
    const prev = window.localStorage.getItem(key);
    if (prev && prev !== APP_BUILD_ID && window.sessionStorage.getItem("build_refresh_done") !== APP_BUILD_ID) {
      pendingHardRefresh = true;
      window.sessionStorage.setItem("build_refresh_done", APP_BUILD_ID);
      void unregisterAllServiceWorkersAndClearCaches().then(() => {
        window.localStorage.setItem(key, APP_BUILD_ID);
        window.location.reload();
      });
    } else {
      window.localStorage.setItem(key, APP_BUILD_ID);
    }
  }
}

// Production: register the PWA service worker with an aggressive update strategy.
// If you ever get stuck on an old build, open /?no-sw=1 once to force-remove SW + caches.
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  const params = new URLSearchParams(window.location.search);
  const disableSW = params.get("no-sw") === "1";

  if (disableSW) {
    void unregisterAllServiceWorkersAndClearCaches().then(() => {
      params.delete("no-sw");
      const newSearch = params.toString();
      const url = `${window.location.pathname}${newSearch ? `?${newSearch}` : ""}${window.location.hash}`;
      window.location.replace(url);
    });
  } else {
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    void import("virtual:pwa-register")
      .then(({ registerSW }) => {
        const updateSW = registerSW({
          immediate: true,
          onNeedRefresh() {
            void updateSW(true);
          },
          onRegistered(registration) {
            void registration?.update();
          },
          onRegisterError(error) {
            console.warn("Service worker registration failed:", error);
          },
        });

        // Extra nudge to avoid getting stuck on an old service worker.
        window.setTimeout(() => {
          void updateSW();
        }, 3000);
      })
      .catch(() => {
        // ignore
      });
  }
}

if (!pendingHardRefresh) {
  createRoot(document.getElementById("root")!).render(<App />);
}
