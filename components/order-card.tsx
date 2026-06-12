import Link from "next/link";
import { formatCurrency, statusLabel } from "@/lib/utils";
import type { Order } from "@/types";

export function OrderCard({ order, href }: { order: Order; href?: string }) {
  const content = (
    <article className="rounded-lg border border-orange-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-3xl font-black text-ink">{order.queue_number}</p>
          <p className="font-semibold">{order.customer_name}</p>
        </div>
        <div className="text-right">
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-brand">{statusLabel(order.status)}</span>
          <p className="mt-2 text-sm font-semibold">{order.payment_status === "paid" ? "Sudah bayar" : "Belum bayar"}</p>
        </div>
      </div>
      <ul className="mt-3 space-y-1 text-sm text-stone-700">
        {order.items.map((item) => (
          <li key={item.id}>
            {item.quantity}x {item.menu_name}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex justify-between border-t border-orange-100 pt-3 font-bold">
        <span>Total</span>
        <span>{formatCurrency(order.total_amount)}</span>
      </div>
    </article>
  );

  if (!href) return content;
  return <Link href={href}>{content}</Link>;
}
