import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "./ui/AppShell";
import { AuthPage } from "./ui/AuthPage";
import { Dashboard, Analytics, Customers, Deals, Leads, Notifications, Pipeline, Profile, Projects, Settings, Tasks, Team } from "./ui/pages";
import { useSelector } from "react-redux";
import type { ReactElement } from "react";
import type { RootState } from "./store/store";
const Guard = ({ children }: { children: ReactElement }) => useSelector((s: RootState) => s.auth.token) ? children : <Navigate to="/login" replace />;
export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "/login", element: <AuthPage mode="login" /> },
  { path: "/register", element: <AuthPage mode="register" /> },
  { path: "/", element: <Guard><AppShell /></Guard>, children: [
    { path: "dashboard", element: <Dashboard /> }, { path: "customers", element: <Customers /> }, { path: "customers/:id", element: <Customers /> },
    { path: "leads", element: <Leads /> }, { path: "leads/:id", element: <Leads /> }, { path: "deals", element: <Deals /> }, { path: "pipeline", element: <Pipeline /> },
    { path: "projects", element: <Projects /> }, { path: "projects/:id", element: <Projects /> }, { path: "tasks", element: <Tasks /> }, { path: "team", element: <Team /> },
    { path: "notifications", element: <Notifications /> }, { path: "analytics", element: <Analytics /> }, { path: "settings", element: <Settings /> }, { path: "profile", element: <Profile /> }
  ] }
]);
