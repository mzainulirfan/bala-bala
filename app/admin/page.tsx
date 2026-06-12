import Link from "next/link";
import { requireRole } from "@/actions/auth";
import { getDailyReportAction } from "@/actions/staff";
import { PageShell, StaffNav } from "@/components/ui/chrome";
import { formatCurrency } from "@/lib/utils";

export default async function AdminPage() {
  await requireRole(["admin"]);
  const report = await getDailyReportAction();

  return (
    <PageShell title="Dashboard Admin" subtitle="Ringkasan operasional hari ini." nav={<StaffNav active="admin" />}>
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Total Pesanan" value={String(report.totalOrders)} />
        <Metric label="Omzet Paid" value={formatCurrency(report.revenue)} />
        <Metric label="Selesai" value={String(report.completedOrders)} />
        <Metric label="Dibatalkan" value={String(report.cancelledOrders)} />
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <AdminLink href="/admin/menu" title="Kelola Menu" />
        <AdminLink href="/admin/reports" title="Laporan Harian" />
        <AdminLink href="/admin/users" title="Kelola User" />
      </div>
    </PageShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface p-4">
      <p className="text-sm text-stone-600">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function AdminLink({ href, title }: { href: string; title: string }) {
  return (
    <Link href={href} className="surface flex min-h-28 items-end p-5 text-lg font-black transition hover:-translate-y-0.5">
      {title}
    </Link>
  );
}
