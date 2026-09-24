import { Link } from "react-router-dom";
import { Logo } from "../components/ui/Logo";
function AuthForm({ register = false }: { register?: boolean }) {
  return (
    <div className="rounded-3xl border border-line bg-white p-7 shadow-[0_10px_35px_rgba(31,67,48,.06)] sm:p-9">
      <Logo />
      <h1 className="mt-9 font-display text-2xl font-extrabold text-ink">
        {register ? "Create your account" : "Welcome back"}
      </h1>
      <p className="mt-2 text-[13px] text-muted">
        {register
          ? "Start building healthier money habits today."
          : "Sign in to continue to your dashboard."}
      </p>
      <form
        className="mt-7 space-y-4"
        onSubmit={(event) => event.preventDefault()}
      >
        {register && (
          <label className="block text-[12px] font-bold text-ink">
            Full name
            <input
              className="mt-1.5 h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-forest"
              placeholder="Jordan Davis"
            />
          </label>
        )}
        <label className="block text-[12px] font-bold text-ink">
          Email address
          <input
            type="email"
            className="mt-1.5 h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-forest"
            placeholder="you@example.com"
          />
        </label>
        <label className="block text-[12px] font-bold text-ink">
          Password
          <input
            type="password"
            className="mt-1.5 h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-forest"
            placeholder="••••••••"
          />
        </label>
        <button className="mt-2 h-11 w-full rounded-xl bg-forest text-sm font-bold text-white">
          {register ? "Create account" : "Sign in"}
        </button>
      </form>
      <p className="mt-7 text-center text-[12px] text-muted">
        {register ? "Already have an account? " : "New to Pennywise? "}
        <Link
          className="font-bold text-forest"
          to={register ? "/login" : "/register"}
        >
          {register ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </div>
  );
}
export const Login = () => <AuthForm />;
export const Register = () => <AuthForm register />;
