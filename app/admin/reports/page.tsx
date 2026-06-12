import { requireRole } from "@/actions/auth";
import { getDailyReportAction } from "@/actions/staff";
import { PageShell, StaffNav } from "@/components/ui/chrome";
import { formatCurrency } from "@/lib/utils";

export default async function ReportsPage() {
  await requireRole(["admin"]);
  const report = await getDailyReportAction();

  return (
    <PageShell title="Laporan Harian" subtitle="Ringkasan pesanan dan penjualan hari ini." nav={<StaffNav active="admin" />}>
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Total Pesanan" value={String(report.totalOrders)} />
        <Metric label="Total Omzet" value={formatCurrency(report.revenue)} />
        <Metric label="Selesai" value={String(report.completedOrders)} />
        <Metric label="Dibatalkan" value={String(report.cancelledOrders)} />
      </div>
      <section className="surface mt-6 p-4">
        <p className="section-title">Penjualan</p>
        <h2 className="mt-1 text-xl font-black">Menu Terlaris</h2>
        <div className="mt-3 divide-y divide-orange-100">
          {report.bestSellers.length ? (
            report.bestSellers.map((item) => (
              <div key={item.menu_name} className="flex justify-between py-3">
                <span>{item.menu_name}</span>
                <span className="font-bold">{item.quantity} terjual</span>
              </div>
            ))
          ) : (
            <p className="py-6 text-stone-600">Belum ada data penjualan.</p>
          )}
        </div>
      </section>
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
