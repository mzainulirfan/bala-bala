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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(217,72,15,0.32),transparent_32rem),linear-gradient(135deg,#170b06_0%,#2a1208_55%,#0f0a07_100%)] p-6 text-white">
      <header className="mb-6 rounded-lg border border-white/10 bg-white/5 p-5 text-center backdrop-blur">
        <p className="text-xl font-black uppercase tracking-[0.2em] text-orange-300">Bala Bala Anget</p>
        <h1 className="mt-1 text-6xl font-black leading-none">Display Antrean</h1>
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
    <div className="rounded-lg border border-white/15 bg-white/10 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur">
      <h2 className={`text-center text-4xl font-black ${accent}`}>{title}</h2>
      <div className="mt-8 grid gap-5">
        {orders.length ? (
          orders.map((order) => (
            <div key={order.id} className="rounded-lg bg-white p-6 text-center text-stone-950 shadow-xl">
              <p className="text-8xl font-black leading-none">{order.queue_number}</p>
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
