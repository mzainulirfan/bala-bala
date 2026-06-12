import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderByCodeAction } from "@/actions/order";
import { formatCurrency, statusLabel } from "@/lib/utils";

const statusSteps = ["waiting", "processing", "ready", "completed"] as const;

export default async function TrackOrderPage({ params }: { params: { orderCode: string } }) {
  const order = await getOrderByCodeAction(params.orderCode);
  if (!order) notFound();
  const activeIndex = statusSteps.indexOf(order.status as any);

  return (
    <main className="min-h-screen bg-cream px-4 py-8">
      <section className="mx-auto max-w-md rounded-lg border border-orange-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Status Pesanan</p>
        <div className="mt-3 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-5xl font-black">{order.queue_number}</h1>
            <p className="text-stone-600">{order.customer_name}</p>
          </div>
          <span className="rounded-full bg-orange-100 px-3 py-2 text-sm font-bold text-brand">{statusLabel(order.status)}</span>
        </div>

        <div className="mt-6 space-y-3">
          {statusSteps.map((step, index) => (
            <div key={step} className="flex items-center gap-3">
              <div className={`h-4 w-4 rounded-full ${index <= activeIndex ? "bg-brand" : "bg-stone-200"}`} />
              <span className={index <= activeIndex ? "font-semibold text-ink" : "text-stone-500"}>{statusLabel(step)}</span>
            </div>
          ))}
          {order.status === "cancelled" ? <p className="rounded-md bg-red-50 p-3 font-semibold text-red-700">Pesanan dibatalkan.</p> : null}
        </div>

        <div className="mt-6 rounded-md bg-orange-50 p-4">
          <ul className="space-y-1 text-sm">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3">
                <span>
                  {item.quantity}x {item.menu_name}
                </span>
                <span>{formatCurrency(item.subtotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-orange-200 pt-3 font-bold">
            <span>Total</span>
            <span>{formatCurrency(order.total_amount)}</span>
          </div>
        </div>

        <Link href="/order" className="mt-6 inline-flex w-full justify-center rounded-md border border-orange-200 px-4 py-3 font-bold">
          Kembali ke Order
        </Link>
      </section>
    </main>
  );
}
