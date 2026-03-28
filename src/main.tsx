import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const APP_BUILD_ID = __APP_BUILD_ID__;

async function unregisterAllServiceWorkersAndClearCaches() {
  let foundCachedArtifacts = false;

  if ("serviceWorker" in navigator) {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      foundCachedArtifacts = foundCachedArtifacts || regs.length > 0;
      await Promise.all(regs.map((registration) => registration.unregister()));
    } catch {
      // ignore
    }
  }

  if ("caches" in window) {
    try {
      const keys = await caches.keys();
      foundCachedArtifacts = foundCachedArtifacts || keys.length > 0;
      await Promise.all(keys.map((key) => caches.delete(key)));
    } catch {
      // ignore
    }
  }

  return foundCachedArtifacts;
}

async function bootstrap() {
  console.info(`[app] build=${APP_BUILD_ID} mode=${import.meta.env.MODE}`);
  try {
    document.documentElement.dataset.build = APP_BUILD_ID;
  } catch {
    // ignore
  }

  const params = new URLSearchParams(window.location.search);
  const forceReset = params.get("no-sw") === "1";
  const buildStorageKey = "app_build_id";
  const resetMarkerKey = "sw_reset_done";
  const previousBuildId = window.localStorage.getItem(buildStorageKey);
  const hadController = Boolean(navigator.serviceWorker?.controller);
  const hadCachedArtifacts = await unregisterAllServiceWorkersAndClearCaches();

  window.localStorage.setItem(buildStorageKey, APP_BUILD_ID);

  const shouldReloadOnce =
    (forceReset || hadController || hadCachedArtifacts || (previousBuildId !== null && previousBuildId !== APP_BUILD_ID)) &&
    window.sessionStorage.getItem(resetMarkerKey) !== APP_BUILD_ID;

  if (shouldReloadOnce) {
    window.sessionStorage.setItem(resetMarkerKey, APP_BUILD_ID);
    params.delete("no-sw");
    const nextSearch = params.toString();
    const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}${window.location.hash}`;
    window.location.replace(nextUrl);
    return;
  }

  createRoot(document.getElementById("root")!).render(<App />);
}

void bootstrap();
