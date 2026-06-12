import { requireRole } from "@/actions/auth";
import { listOrdersAction } from "@/actions/staff";
import { CashierDashboard } from "@/components/cashier-dashboard";
import { PageShell, StaffNav } from "@/components/ui/chrome";

export default async function CashierPage() {
  await requireRole(["cashier", "admin"]);
  const orders = await listOrdersAction("all");

  return (
    <PageShell title="Dashboard Kasir" subtitle="Pantau pesanan hari ini dan konfirmasi pembayaran." nav={<StaffNav active="cashier" />}>
      <CashierDashboard initialOrders={orders} />
    </PageShell>
  );
}
