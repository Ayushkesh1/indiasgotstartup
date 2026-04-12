import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const APP_BUILD_ID = __APP_BUILD_ID__;
const BUILD_STORAGE_KEY = "app_build_id";
const RESET_MARKER_KEY = "sw_reset_done";
const BUILD_QUERY_KEY = "__build";

function isPreviewHost() {
  const { hostname } = window.location;
  return hostname.includes("id-preview--") || hostname.includes("lovableproject.com");
}

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
  const isPreview = isPreviewHost();
  const forceReset = params.get("no-sw") === "1";
  const previousBuildId = window.localStorage.getItem(BUILD_STORAGE_KEY);
  const hadController = Boolean(navigator.serviceWorker?.controller);
  const hadCachedArtifacts = await unregisterAllServiceWorkersAndClearCaches();

  window.localStorage.setItem(BUILD_STORAGE_KEY, APP_BUILD_ID);

  const shouldReloadOnce =
    (
      forceReset ||
      hadController ||
      hadCachedArtifacts ||
      (previousBuildId !== null && previousBuildId !== APP_BUILD_ID) ||
      (isPreview && params.get(BUILD_QUERY_KEY) !== APP_BUILD_ID)
    ) &&
    window.sessionStorage.getItem(RESET_MARKER_KEY) !== APP_BUILD_ID;

  if (shouldReloadOnce) {
    window.sessionStorage.setItem(RESET_MARKER_KEY, APP_BUILD_ID);
    params.delete("no-sw");
    if (isPreview) {
      params.set(BUILD_QUERY_KEY, APP_BUILD_ID);
    }
    const nextSearch = params.toString();
    const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}${window.location.hash}`;
    window.location.replace(nextUrl);
    return;
  }

  createRoot(document.getElementById("root")!).render(<App />);
}

void bootstrap();
