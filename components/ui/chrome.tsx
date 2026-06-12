import Link from "next/link";
import { logoutAction } from "@/actions/auth";

export function PageShell({
  title,
  subtitle,
  children,
  nav
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  nav?: React.ReactNode;
}) {
  return (
    <main className="app-shell">
      <header className="border-b border-orange-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="section-title">Bala Bala Anget</p>
            <h1 className="mt-1 text-3xl font-black text-ink">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-stone-600">{subtitle}</p> : null}
          </div>
          {nav}
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
    </main>
  );
}

export function StaffNav({ active }: { active: "cashier" | "kitchen" | "admin" }) {
  const links = [
    { href: "/cashier", label: "Kasir", key: "cashier" },
    { href: "/kitchen", label: "Dapur", key: "kitchen" },
    { href: "/admin", label: "Admin", key: "admin" },
    { href: "/display", label: "Display", key: "display" }
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`rounded-full px-4 py-2 text-sm font-bold transition ${
            active === link.key ? "bg-ink text-white shadow-sm" : "bg-white text-stone-700 hover:bg-orange-50"
          }`}
        >
          {link.label}
        </Link>
      ))}
      <form action={logoutAction}>
        <button className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-bold text-stone-700 hover:bg-orange-50">
          Keluar
        </button>
      </form>
    </div>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className="surface border-dashed p-10 text-center font-medium text-stone-600">{children}</div>;
}
