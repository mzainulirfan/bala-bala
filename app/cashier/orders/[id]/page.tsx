import { notFound } from "next/navigation";
import { requireRole } from "@/actions/auth";
import { getOrderAction } from "@/actions/staff";
import { CashierOrderDetail } from "@/components/cashier-order-detail";
import { PageShell, StaffNav } from "@/components/ui/chrome";

export default async function CashierOrderPage({ params }: { params: { id: string } }) {
  await requireRole(["cashier", "admin"]);
  const order = await getOrderAction(params.id);
  if (!order) notFound();

  return (
    <PageShell title="Detail Pesanan" subtitle="Konfirmasi pembayaran, batalkan, atau ubah status pesanan." nav={<StaffNav active="cashier" />}>
      <CashierOrderDetail initialOrder={order} />
    </PageShell>
  );
}
