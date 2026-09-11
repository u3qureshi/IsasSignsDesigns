import { ClipboardList, PackageOpen, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../auth/auth-context";

export default function AccountPageShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <main className="flex min-h-[65vh] items-center justify-center bg-[hsl(var(--theme-kids-bg))] text-stone-500">Loading your account…</main>;
  }

  if (!user) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-[hsl(var(--theme-kids-bg))] px-5 py-14 text-center">
        <section className="max-w-lg rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_hsl(var(--theme-brown-900)/0.1)]">
          <UserRound className="mx-auto h-12 w-12 text-[#711f3d]" />
          <h1 className="mt-4 font-aoki text-4xl text-[hsl(var(--theme-brown-900))]">Sign in to continue</h1>
          <p className="mt-3 leading-7 text-stone-500">Use the verified email connected to your orders and custom requests.</p>
          <Link to="/login" className="mt-6 inline-flex rounded-full bg-[hsl(var(--theme-green-900))] px-6 py-3 text-sm font-bold text-white">Log in or sign up</Link>
        </section>
      </main>
    );
  }

  const tabClass = ({ isActive }: { isActive: boolean }) => `inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition ${isActive ? "bg-[hsl(var(--theme-green-900))] text-white" : "bg-white text-[hsl(var(--theme-green-900))] hover:bg-[hsl(var(--theme-sage-100)/0.45)]"}`;

  return (
    <main className="min-h-[65vh] bg-[hsl(var(--theme-kids-bg))] px-5 py-10 text-[hsl(var(--theme-brown-900))] sm:py-14">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-600))]">{user.firstName}’s account</p>
        <h1 className="mt-2 font-aoki text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl font-medium leading-7 text-[hsl(var(--theme-brown-700))]">{description}</p>
        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Account history">
          <NavLink to="/account/orders" className={tabClass}><PackageOpen className="h-4 w-4" /> My orders</NavLink>
          <NavLink to="/account/custom-requests" className={tabClass}><ClipboardList className="h-4 w-4" /> My custom requests</NavLink>
        </nav>
        <div className="mt-7">{children}</div>
      </div>
    </main>
  );
}
