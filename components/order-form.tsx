"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
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
    <div className="app-shell mx-auto min-h-screen max-w-xl pb-36">
      <header className="sticky top-0 z-10 border-b border-orange-200/70 bg-white/90 px-4 py-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-brand text-white shadow-sm">
            <ShoppingBag size={22} />
          </div>
          <div>
            <p className="section-title">Bala Bala Anget</p>
            <h1 className="text-2xl font-black text-ink">Pesan gorengan dari HP</h1>
          </div>
        </div>
        <p className="mt-3 text-sm text-stone-600">Pilih menu, isi nama, lalu ambil nomor antrean otomatis.</p>
      </header>

      <section className="space-y-3 px-4 py-5">
        {menus.map((menu) => {
          const quantity = quantities[menu.id] ?? 0;
          return (
            <article key={menu.id} className={`surface p-4 ${quantity > 0 ? "ring-2 ring-brand/30" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-black">{menu.name}</h2>
                    {menu.is_sold_out ? (
                      <span className="rounded-full bg-stone-200 px-2 py-1 text-xs font-bold text-stone-700">Habis</span>
                    ) : null}
                  </div>
                  {menu.description ? <p className="mt-1 text-sm text-stone-600">{menu.description}</p> : null}
                  <p className="mt-3 text-lg font-black text-brand">{formatCurrency(menu.price)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2 rounded-full bg-orange-50 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(menu, quantity - 1)}
                    className="grid h-10 w-10 place-items-center rounded-full border border-orange-200 bg-white text-brand disabled:opacity-40"
                    disabled={quantity === 0 || menu.is_sold_out}
                    aria-label={`Kurangi ${menu.name}`}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-8 text-center text-lg font-black">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(menu, quantity + 1)}
                    className="grid h-10 w-10 place-items-center rounded-full bg-brand text-white shadow-sm disabled:bg-stone-300"
                    disabled={menu.is_sold_out}
                    aria-label={`Tambah ${menu.name}`}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="space-y-3 px-4">
        <label className="surface block p-4">
          <span className="text-sm font-semibold">Nama Kamu</span>
          <input
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            maxLength={50}
            className="field"
            placeholder="Contoh: Budi"
          />
        </label>
        <label className="surface block p-4">
          <span className="text-sm font-semibold">Catatan opsional</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value.slice(0, 200))}
            rows={3}
            className="field"
            placeholder="Contoh: jangan terlalu matang"
          />
        </label>
        {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p> : null}
      </section>

      <footer className="fixed inset-x-0 bottom-0 border-t border-orange-200/70 bg-white/95 p-4 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-stone-500">{itemCount} item dipilih</p>
            <p className="text-2xl font-black text-ink">{formatCurrency(total)}</p>
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className="btn-primary px-5"
          >
            {isPending ? "Membuat..." : "Buat Pesanan"}
          </button>
        </div>
      </footer>
    </div>
  );
}
