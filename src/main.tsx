import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Prevent "old version" issues in preview/dev caused by a previously installed PWA service worker.
if (import.meta.env.DEV && "serviceWorker" in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((regs) => Promise.all(regs.map((r) => r.unregister())))
    .then(async () => {
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    })
    .catch(() => {
      // ignore
    });
}

createRoot(document.getElementById("root")!).render(<App />);
