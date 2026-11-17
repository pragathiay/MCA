export function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="grid min-h-screen place-items-center bg-paper p-5"><div className="w-full max-w-[440px]">{children}</div></div>;
}
