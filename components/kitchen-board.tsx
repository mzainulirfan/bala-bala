"use client";

import { useEffect, useState, useTransition } from "react";
import { listKitchenOrdersAction, updateOrderStatusAction } from "@/actions/staff";
import { EmptyState } from "@/components/ui/chrome";
import { statusLabel } from "@/lib/utils";
import type { Order } from "@/types";

export function KitchenBoard({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function refresh() {
    startTransition(async () => setOrders(await listKitchenOrdersAction()));
  }

  function update(id: string, status: "processing" | "ready") {
    setError("");
    startTransition(async () => {
      try {
        await updateOrderStatusAction(id, status);
        setOrders(await listKitchenOrdersAction());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Aksi gagal");
      }
    });
  }

  useEffect(() => {
    const interval = window.setInterval(refresh, 5000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-stone-600">Pesanan aktif diurutkan dari nomor antrean terkecil.</p>
        <button onClick={refresh} className="rounded-md border border-orange-200 bg-white px-3 py-2 text-sm font-bold">
          {isPending ? "Refresh..." : "Refresh"}
        </button>
      </div>
      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p> : null}
      {orders.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {orders.map((order) => (
            <article key={order.id} className="rounded-lg border border-orange-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-6xl font-black">{order.queue_number}</p>
                  <h2 className="text-xl font-bold">{order.customer_name}</h2>
                </div>
                <span className="rounded-full bg-orange-100 px-3 py-2 text-sm font-bold text-brand">{statusLabel(order.status)}</span>
              </div>
              <ul className="mt-5 space-y-2 text-lg font-semibold">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.quantity}x {item.menu_name}
                  </li>
                ))}
              </ul>
              {order.notes ? <p className="mt-4 rounded-md bg-orange-50 p-3 text-sm">Catatan: {order.notes}</p> : null}
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  disabled={isPending || order.status !== "waiting"}
                  onClick={() => update(order.id, "processing")}
                  className="rounded-md bg-brand px-4 py-3 font-bold text-white disabled:bg-stone-300"
                >
                  Proses
                </button>
                <button
                  disabled={isPending || order.status !== "processing"}
                  onClick={() => update(order.id, "ready")}
                  className="rounded-md bg-green-700 px-4 py-3 font-bold text-white disabled:bg-stone-300"
                >
                  Siap Diambil
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState>Tidak ada antrean aktif.</EmptyState>
      )}
    </div>
  );
}
