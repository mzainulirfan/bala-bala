import { requireRole } from "@/actions/auth";
import { listKitchenOrdersAction } from "@/actions/staff";
import { KitchenBoard } from "@/components/kitchen-board";
import { PageShell, StaffNav } from "@/components/ui/chrome";

export default async function KitchenPage() {
  await requireRole(["kitchen", "admin"]);
  const orders = await listKitchenOrdersAction();

  return (
    <PageShell title="Antrean Dapur" subtitle="Proses pesanan sesuai urutan antrean." nav={<StaffNav active="kitchen" />}>
      <KitchenBoard initialOrders={orders} />
    </PageShell>
  );
}
