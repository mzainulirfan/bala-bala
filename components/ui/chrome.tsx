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
    <main className="min-h-screen bg-cream">
      <header className="border-b border-orange-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink">{title}</h1>
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
          className={`rounded-md px-3 py-2 text-sm font-medium ${
            active === link.key ? "bg-brand text-white" : "bg-orange-50 text-stone-700"
          }`}
        >
          {link.label}
        </Link>
      ))}
      <form action={logoutAction}>
        <button className="rounded-md border border-orange-200 bg-white px-3 py-2 text-sm font-medium text-stone-700">
          Keluar
        </button>
      </form>
    </div>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border border-dashed border-orange-300 bg-white p-8 text-center text-stone-600">{children}</div>;
}
