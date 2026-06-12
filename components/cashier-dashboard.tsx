"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { listOrdersAction } from "@/actions/staff";
import { OrderCard } from "@/components/order-card";
import { EmptyState } from "@/components/ui/chrome";
import type { Order, OrderStatus } from "@/types";

const filters: Array<{ value: OrderStatus | "all"; label: string }> = [
  { value: "all", label: "Semua" },
  { value: "waiting", label: "Menunggu" },
  { value: "processing", label: "Diproses" },
  { value: "ready", label: "Siap" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Batal" }
];

export function CashierDashboard({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [isPending, startTransition] = useTransition();

  const refresh = useCallback((nextFilter = filter) => {
    startTransition(async () => {
      setOrders(await listOrdersAction(nextFilter));
    });
  }, [filter]);

  useEffect(() => {
    const interval = window.setInterval(() => refresh(filter), 5000);
    return () => window.clearInterval(interval);
  }, [filter, refresh]);

  return (
    <div className="space-y-4">
      <div className="surface flex flex-wrap gap-2 p-2">
        {filters.map((item) => (
          <button
            key={item.value}
            onClick={() => {
              setFilter(item.value);
              refresh(item.value);
            }}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              filter === item.value ? "bg-ink text-white" : "bg-transparent text-stone-700 hover:bg-orange-50"
            }`}
          >
            {item.label}
          </button>
        ))}
        <button onClick={() => refresh()} className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-bold">
          {isPending ? "Refresh..." : "Refresh"}
        </button>
      </div>
      {orders.length ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} href={`/cashier/orders/${order.id}`} />
          ))}
        </div>
      ) : (
        <EmptyState>Belum ada pesanan untuk filter ini.</EmptyState>
      )}
    </div>
  );
}
