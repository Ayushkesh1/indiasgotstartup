import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Build marker used to prove which deployment is currently running.
  // This changes on every build, helping detect/flush stale SW/browser caches.
  define: {
    __APP_BUILD_ID__: JSON.stringify(new Date().toISOString()),
  },
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      // Self-destroy mode: this ships a one-time SW that unregisters itself and
      // clears all caches. Once all users have received the new version, remove
      // this option (or set selfDestroying: false) and publish again to re-enable PWA.
      selfDestroying: true,
      injectRegister: null,
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "favicon.png", "logo.png"],
      manifest: {
        name: "Pulse of Startups",
        short_name: "Pulse",
        description: "Stay updated with the latest startup news and trends",
        theme_color: "#a855f7",
        background_color: "#faf5ff",
        display: "standalone",
        icons: [
          {
            src: "/logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logo.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        // Avoid precaching HTML so users don't get stuck on an old app shell.
        // JS/CSS are hashed and safe to cache; HTML freshness is more important.
        globPatterns: ["**/*.{js,css,ico,png,svg,woff,woff2}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
