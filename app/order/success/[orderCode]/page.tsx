import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderByCodeAction } from "@/actions/order";
import { formatCurrency, statusLabel } from "@/lib/utils";

export default async function OrderSuccessPage({ params }: { params: { orderCode: string } }) {
  const order = await getOrderByCodeAction(params.orderCode);
  if (!order) notFound();

  return (
    <main className="min-h-screen bg-cream px-4 py-8">
      <section className="mx-auto max-w-md rounded-lg border border-orange-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Pesanan berhasil</p>
        <h1 className="mt-3 text-6xl font-black text-ink">{order.queue_number}</h1>
        <p className="mt-2 text-stone-600">Nomor antrean kamu</p>
        <div className="mt-6 rounded-md bg-orange-50 p-4 text-left">
          <p className="font-bold">{order.customer_name}</p>
          <p className="text-sm text-stone-600">Status: {statusLabel(order.status)}</p>
          <ul className="mt-3 space-y-1 text-sm">
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
        <Link
          href={`/track/${order.order_code}`}
          className="mt-6 inline-flex w-full justify-center rounded-md bg-brand px-4 py-3 font-bold text-white"
        >
          Cek Status Pesanan
        </Link>
        <Link href="/order" className="mt-3 inline-flex w-full justify-center rounded-md border border-orange-200 px-4 py-3 font-bold">
          Buat Pesanan Lagi
        </Link>
      </section>
    </main>
  );
}
