import type { CapacitorConfig } from "@capacitor/cli";
const config: CapacitorConfig = { appId: "com.nexaflow.app", appName: "NexaFlow", webDir: "apps/web/dist", server: { androidScheme: "https" }, plugins: { SplashScreen: { launchShowDuration: 1200, backgroundColor: "#0f172a" } } };
export default config;