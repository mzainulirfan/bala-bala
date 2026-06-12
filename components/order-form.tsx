"use client";

import { CheckCircle2, ChefHat, Minus, Plus, ReceiptText, ShoppingBag, Sparkles } from "lucide-react";
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
  const selectedMenus = menus.filter((menu) => (quantities[menu.id] ?? 0) > 0);
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
    <div className="min-h-screen bg-[#fff8ed] pb-40 text-ink">
      <div className="mx-auto max-w-xl">
        <header className="relative overflow-hidden bg-[#291207] px-4 pb-6 pt-5 text-white">
          <div className="absolute -right-16 -top-20 h-44 w-44 rounded-full bg-brand/40 blur-3xl" />
          <div className="absolute -bottom-24 left-8 h-48 w-48 rounded-full bg-orange-300/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-white text-brand shadow-lg">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-200">Bala Bala Anget</p>
                  <h1 className="text-2xl font-black leading-tight">Pesan gorengan tanpa antre kasir</h1>
                </div>
              </div>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-orange-100">QR Order</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-6 text-orange-50">
              Pilih menu favorit, isi nama, lalu sistem memberi nomor antrean otomatis.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              <Step icon={<Sparkles size={16} />} label="Pilih" />
              <Step icon={<ReceiptText size={16} />} label="Bayar" />
              <Step icon={<ChefHat size={16} />} label="Ambil" />
            </div>
          </div>
        </header>

        <main className="-mt-3 space-y-4 px-4">
          <section className="rounded-lg border border-orange-200 bg-white p-4 shadow-[0_18px_50px_rgba(120,53,15,0.12)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="section-title">Menu Hari Ini</p>
                <h2 className="mt-1 text-xl font-black">Gorengan siap dipilih</h2>
              </div>
              <div className="rounded-full bg-orange-50 px-3 py-2 text-sm font-black text-brand">{menus.length} menu</div>
            </div>

            <div className="mt-4 space-y-3">
              {menus.map((menu, index) => {
                const quantity = quantities[menu.id] ?? 0;
                return (
                  <article
                    key={menu.id}
                    className={`rounded-lg border p-3 transition ${
                      quantity > 0 ? "border-brand bg-orange-50 shadow-sm" : "border-orange-100 bg-white"
                    } ${menu.is_sold_out ? "opacity-70" : ""}`}
                  >
                    <div className="flex gap-3">
                      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-orange-100 to-amber-50 text-2xl font-black text-brand">
                        {menu.name.slice(0, 1)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-black">{menu.name}</h3>
                          {quantity > 0 ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-black text-green-700">
                              <CheckCircle2 size={12} />
                              Dipilih
                            </span>
                          ) : null}
                          {menu.is_sold_out ? (
                            <span className="rounded-full bg-stone-200 px-2 py-1 text-xs font-bold text-stone-700">Habis</span>
                          ) : null}
                        </div>
                        {menu.description ? <p className="mt-1 line-clamp-2 text-sm text-stone-600">{menu.description}</p> : null}
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <p className="font-black text-brand">{formatCurrency(menu.price)}</p>
                          <QuantityControl
                            menuName={menu.name}
                            quantity={quantity}
                            disabled={menu.is_sold_out}
                            onDecrease={() => setQuantity(menu, quantity - 1)}
                            onIncrease={() => setQuantity(menu, quantity + 1)}
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="rounded-lg border border-orange-200 bg-white p-4 shadow-sm">
            <p className="section-title">Ringkasan</p>
            {selectedMenus.length ? (
              <div className="mt-3 space-y-2">
                {selectedMenus.map((menu) => (
                  <div key={menu.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold">
                      {quantities[menu.id]}x {menu.name}
                    </span>
                    <span className="font-black">{formatCurrency(menu.price * (quantities[menu.id] ?? 0))}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-stone-500">Belum ada menu dipilih.</p>
            )}
          </section>

          <section className="rounded-lg border border-orange-200 bg-white p-4 shadow-sm">
            <p className="section-title">Data Pesanan</p>
            <div className="mt-3 space-y-3">
              <label className="block">
                <span className="text-sm font-semibold">Nama Kamu</span>
                <input
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  maxLength={50}
                  className="field"
                  placeholder="Contoh: Budi"
                />
              </label>
              <label className="block">
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
            </div>
          </section>
        </main>

        <footer className="fixed inset-x-0 bottom-0 border-t border-orange-200/70 bg-white/95 p-4 backdrop-blur">
          <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-stone-500">{itemCount} item dipilih</p>
              <p className="text-2xl font-black text-ink">{formatCurrency(total)}</p>
            </div>
            <button type="button" onClick={submit} disabled={!canSubmit} className="btn-primary px-5">
              {isPending ? "Membuat..." : "Buat Pesanan"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Step({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-full bg-white/12 px-3 py-2 text-xs font-black text-orange-50">
      {icon}
      {label}
    </div>
  );
}

function QuantityControl({
  menuName,
  quantity,
  disabled,
  onDecrease,
  onIncrease
}: {
  menuName: string;
  quantity: number;
  disabled: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2 rounded-full bg-white p-1 shadow-sm ring-1 ring-orange-100">
      <button
        type="button"
        onClick={onDecrease}
        className="grid h-9 w-9 place-items-center rounded-full border border-orange-200 bg-white text-brand disabled:opacity-40"
        disabled={quantity === 0 || disabled}
        aria-label={`Kurangi ${menuName}`}
      >
        <Minus size={16} />
      </button>
      <span className="w-7 text-center text-base font-black">{quantity}</span>
      <button
        type="button"
        onClick={onIncrease}
        className="grid h-9 w-9 place-items-center rounded-full bg-brand text-white shadow-sm disabled:bg-stone-300"
        disabled={disabled}
        aria-label={`Tambah ${menuName}`}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
