"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { listDisplayOrdersAction } from "@/actions/staff";
import type { Order } from "@/types";

export function DisplayBoard({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const interval = window.setInterval(() => {
      startTransition(async () => setOrders(await listDisplayOrdersAction()));
    }, 5000);
    return () => window.clearInterval(interval);
  }, []);

  const processing = useMemo(() => orders.filter((order) => order.status === "processing"), [orders]);
  const ready = useMemo(() => orders.filter((order) => order.status === "ready"), [orders]);

  return (
    <main className="min-h-screen bg-stone-950 p-6 text-white">
      <header className="mb-6 text-center">
        <p className="text-xl font-semibold uppercase tracking-widest text-orange-300">Gorengan Viral</p>
        <h1 className="text-5xl font-black">Display Antrean</h1>
      </header>
      <section className="grid min-h-[70vh] gap-6 lg:grid-cols-2">
        <QueueColumn title="Sedang Diproses" orders={processing} accent="text-orange-300" />
        <QueueColumn title="Siap Diambil" orders={ready} accent="text-green-300" />
      </section>
    </main>
  );
}

function QueueColumn({ title, orders, accent }: { title: string; orders: Order[]; accent: string }) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/5 p-6">
      <h2 className={`text-center text-4xl font-black ${accent}`}>{title}</h2>
      <div className="mt-8 grid gap-5">
        {orders.length ? (
          orders.map((order) => (
            <div key={order.id} className="rounded-lg bg-white p-5 text-center text-stone-950">
              <p className="text-7xl font-black">{order.queue_number}</p>
              <p className="mt-2 text-2xl font-bold">{order.customer_name}</p>
            </div>
          ))
        ) : (
          <p className="py-16 text-center text-3xl font-bold text-white/60">Belum ada</p>
        )}
      </div>
    </div>
  );
}
