"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { markPaidAction, updateOrderStatusAction } from "@/actions/staff";
import { formatCurrency, statusLabel } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

const statuses: OrderStatus[] = ["waiting", "processing", "ready", "completed", "cancelled"];

export function CashierOrderDetail({ initialOrder }: { initialOrder: Order }) {
  const [order, setOrder] = useState(initialOrder);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function run(action: () => Promise<Order>) {
    setError("");
    startTransition(async () => {
      try {
        setOrder(await action());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Aksi gagal");
      }
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link href="/cashier" className="btn-secondary px-3 py-2 text-sm">
        Kembali
      </Link>
      <section className="surface-strong p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-6xl font-black leading-none">{order.queue_number}</p>
            <h1 className="mt-1 text-2xl font-bold">{order.customer_name}</h1>
            <p className="text-sm text-stone-600">{new Date(order.created_at).toLocaleString("id-ID")}</p>
          </div>
          <div className="space-y-2 text-right">
            <p className="pill text-sm">{statusLabel(order.status)}</p>
            <p className={`text-sm font-black ${order.payment_status === "paid" ? "text-leaf" : "text-sambal"}`}>
              {order.payment_status === "paid" ? "Sudah bayar" : "Belum bayar"}
            </p>
          </div>
        </div>
        {order.notes ? <p className="mt-4 rounded-md border border-orange-200 bg-orange-50 p-3 text-sm">Catatan: {order.notes}</p> : null}
        <ul className="mt-5 divide-y divide-orange-100">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4 py-3">
              <span>
                {item.quantity}x {item.menu_name}
                <span className="block text-sm text-stone-500">{formatCurrency(item.price)} per item</span>
              </span>
              <span className="font-bold">{formatCurrency(item.subtotal)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-orange-200 pt-4 text-xl font-black">
          <span>Total</span>
          <span>{formatCurrency(order.total_amount)}</span>
        </div>
      </section>

      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p> : null}
      <section className="grid gap-3 sm:grid-cols-2">
        <button
          disabled={isPending || order.payment_status === "paid"}
          onClick={() => run(() => markPaidAction(order.id))}
          className="btn-primary"
        >
          Tandai Sudah Bayar
        </button>
        <button
          disabled={isPending}
          onClick={() => {
            if (window.confirm("Batalkan pesanan ini?")) run(() => updateOrderStatusAction(order.id, "cancelled"));
          }}
          className="inline-flex items-center justify-center rounded-md bg-sambal px-4 py-3 font-bold text-white transition hover:bg-red-800 disabled:bg-stone-300"
        >
          Batalkan
        </button>
      </section>
      <section className="surface p-4">
        <p className="mb-3 font-bold">Ubah status manual</p>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              disabled={isPending || order.status === status}
              onClick={() => run(() => updateOrderStatusAction(order.id, status))}
              className="rounded-full border border-orange-200 bg-white px-3 py-2 text-sm font-bold transition hover:bg-orange-50 disabled:bg-orange-100 disabled:text-brand"
            >
              {statusLabel(status)}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
