"use client";

import { useMemo, useState, useTransition } from "react";
import { createOrderAction } from "@/actions/order";
import { formatCurrency } from "@/lib/utils";
import type { Menu } from "@/types";

export function OrderForm({ menus }: { menus: Menu[] }) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const total = useMemo(
    () => menus.reduce((sum, menu) => sum + menu.price * (quantities[menu.id] ?? 0), 0),
    [menus, quantities]
  );
  const itemCount = Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0);
  const canSubmit = customerName.trim().length >= 2 && itemCount > 0 && !isPending;

  function setQuantity(menu: Menu, next: number) {
    if (menu.is_sold_out) return;
    setQuantities((current) => ({ ...current, [menu.id]: Math.max(0, Math.min(99, next)) }));
  }

  function submit() {
    setError("");
    startTransition(async () => {
      try {
        await createOrderAction({
          customer_name: customerName,
          notes,
          items: Object.entries(quantities).map(([menu_id, quantity]) => ({ menu_id, quantity }))
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Pesanan gagal dibuat");
      }
    });
  }

  return (
    <div className="mx-auto min-h-screen max-w-xl bg-cream pb-36">
      <header className="sticky top-0 z-10 border-b border-orange-200 bg-white px-4 py-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Gorengan Viral</p>
        <h1 className="text-2xl font-bold text-ink">Pesan dari HP kamu</h1>
      </header>

      <section className="space-y-3 px-4 py-5">
        {menus.map((menu) => {
          const quantity = quantities[menu.id] ?? 0;
          return (
            <article key={menu.id} className="rounded-lg border border-orange-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold">{menu.name}</h2>
                    {menu.is_sold_out ? (
                      <span className="rounded-full bg-stone-200 px-2 py-1 text-xs font-semibold text-stone-700">Habis</span>
                    ) : null}
                  </div>
                  {menu.description ? <p className="mt-1 text-sm text-stone-600">{menu.description}</p> : null}
                  <p className="mt-2 font-semibold text-brand">{formatCurrency(menu.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(menu, quantity - 1)}
                    className="h-10 w-10 rounded-md border border-orange-200 text-xl font-bold disabled:opacity-40"
                    disabled={quantity === 0 || menu.is_sold_out}
                    aria-label={`Kurangi ${menu.name}`}
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-lg font-bold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(menu, quantity + 1)}
                    className="h-10 w-10 rounded-md bg-brand text-xl font-bold text-white disabled:bg-stone-300"
                    disabled={menu.is_sold_out}
                    aria-label={`Tambah ${menu.name}`}
                  >
                    +
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="space-y-3 px-4">
        <label className="block">
          <span className="text-sm font-semibold">Nama Kamu</span>
          <input
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            maxLength={50}
            className="mt-1 w-full rounded-md border border-orange-200 bg-white px-3 py-3 outline-none focus:border-brand"
            placeholder="Contoh: Budi"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Catatan opsional</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value.slice(0, 200))}
            rows={3}
            className="mt-1 w-full rounded-md border border-orange-200 bg-white px-3 py-3 outline-none focus:border-brand"
            placeholder="Contoh: jangan terlalu matang"
          />
        </label>
        {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p> : null}
      </section>

      <footer className="fixed inset-x-0 bottom-0 border-t border-orange-200 bg-white p-4">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
          <div>
            <p className="text-xs text-stone-500">Total</p>
            <p className="text-xl font-bold text-ink">{formatCurrency(total)}</p>
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className="rounded-md bg-brand px-5 py-3 font-bold text-white disabled:bg-stone-300"
          >
            {isPending ? "Membuat..." : "Buat Pesanan"}
          </button>
        </div>
      </footer>
    </div>
  );
}
