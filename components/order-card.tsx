import Link from "next/link";
import { formatCurrency, statusLabel } from "@/lib/utils";
import type { Order } from "@/types";

export function OrderCard({ order, href }: { order: Order; href?: string }) {
  const content = (
    <article className="surface p-4 transition hover:-translate-y-0.5 hover:shadow-[0_18px_48px_rgba(120,53,15,0.14)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-4xl font-black text-ink">{order.queue_number}</p>
          <p className="font-semibold">{order.customer_name}</p>
        </div>
        <div className="text-right">
          <span className="pill">{statusLabel(order.status)}</span>
          <p className={`mt-2 text-sm font-black ${order.payment_status === "paid" ? "text-green-700" : "text-red-700"}`}>
            {order.payment_status === "paid" ? "Sudah bayar" : "Belum bayar"}
          </p>
        </div>
      </div>
      <ul className="mt-3 space-y-1 text-sm text-stone-700">
        {order.items.map((item) => (
          <li key={item.id}>
            {item.quantity}x {item.menu_name}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex justify-between border-t border-orange-100 pt-3 font-black">
        <span>Total</span>
        <span>{formatCurrency(order.total_amount)}</span>
      </div>
    </article>
  );

  if (!href) return content;
  return <Link href={href}>{content}</Link>;
}
