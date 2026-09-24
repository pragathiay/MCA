import { Outlet } from "react-router-dom";
export function AuthLayout() {
  return (
    <div className="grid min-h-screen place-items-center bg-paper p-5">
      <div className="w-full max-w-[440px]">
        <Outlet />
      </div>
    </div>
  );
}
