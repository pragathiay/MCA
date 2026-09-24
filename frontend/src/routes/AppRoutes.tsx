import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { Dashboard } from "../pages/Dashboard";
import { Login, Register } from "../pages/AuthPages";
import { PlaceholderPage } from "../pages/PlaceholderPage";
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/income" element={<PlaceholderPage />} />
        <Route path="/expenses" element={<PlaceholderPage />} />
        <Route path="/budgets" element={<PlaceholderPage />} />
        <Route path="/categories" element={<PlaceholderPage />} />
        <Route path="/reports" element={<PlaceholderPage />} />
        <Route path="/savings-goals" element={<PlaceholderPage />} />
        <Route path="/profile" element={<PlaceholderPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
