import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderByCodeAction } from "@/actions/order";
import { formatCurrency, statusLabel } from "@/lib/utils";

export default async function OrderSuccessPage({ params }: { params: { orderCode: string } }) {
  const order = await getOrderByCodeAction(params.orderCode);
  if (!order) notFound();

  return (
    <main className="app-shell min-h-screen px-4 py-8">
      <section className="surface-strong mx-auto max-w-md p-6 text-center">
        <p className="section-title">Pesanan berhasil</p>
        <h1 className="mt-4 text-7xl font-black leading-none text-ink">{order.queue_number}</h1>
        <p className="mt-2 text-stone-600">Nomor antrean kamu</p>
        <div className="mt-6 rounded-md border border-orange-200 bg-orange-50 p-4 text-left">
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
          <div className="mt-3 flex justify-between border-t border-orange-200 pt-3 font-black">
            <span>Total</span>
            <span>{formatCurrency(order.total_amount)}</span>
          </div>
        </div>
        <Link
          href={`/track/${order.order_code}`}
          className="btn-primary mt-6 w-full"
        >
          Cek Status Pesanan
        </Link>
        <Link href="/order" className="btn-secondary mt-3 w-full">
          Buat Pesanan Lagi
        </Link>
      </section>
    </main>
  );
}
