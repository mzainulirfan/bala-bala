"use client";

import Image from "next/image";
import { CheckCircle2, Clock3, Minus, Plus, ReceiptText, ShoppingBag, Utensils } from "lucide-react";
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

  const selectedMenus = useMemo(() => menus.filter((menu) => (quantities[menu.id] ?? 0) > 0), [menus, quantities]);
  const itemCount = Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0);
  const total = useMemo(
    () => selectedMenus.reduce((sum, menu) => sum + menu.price * (quantities[menu.id] ?? 0), 0),
    [selectedMenus, quantities]
  );
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
    <main className="min-h-screen bg-[#fff7ed] pb-40 text-ink">
      <section className="mx-auto max-w-6xl px-4 py-4 sm:py-6">
        <Hero itemCount={itemCount} />

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="section-title">Pilih Menu</p>
                <h2 className="mt-1 text-2xl font-black">Gorengan anget hari ini</h2>
              </div>
              <span className="hidden rounded-full bg-white px-4 py-2 text-sm font-black text-brand shadow-sm ring-1 ring-orange-100 sm:inline-flex">
                {menus.length} menu tersedia
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {menus.map((menu, index) => (
                <MenuCard
                  key={menu.id}
                  menu={menu}
                  index={index}
                  quantity={quantities[menu.id] ?? 0}
                  onDecrease={() => setQuantity(menu, (quantities[menu.id] ?? 0) - 1)}
                  onIncrease={() => setQuantity(menu, (quantities[menu.id] ?? 0) + 1)}
                />
              ))}
            </div>
          </section>

          <aside className="hidden lg:sticky lg:top-5 lg:block">
            <CheckoutPanel
              selectedMenus={selectedMenus}
              quantities={quantities}
              total={total}
              itemCount={itemCount}
              customerName={customerName}
              notes={notes}
              error={error}
              isPending={isPending}
              canSubmit={canSubmit}
              setCustomerName={setCustomerName}
              setNotes={setNotes}
              submit={submit}
            />
          </aside>
        </div>

        <section className="mt-5 lg:hidden">
          <CheckoutPanel
            selectedMenus={selectedMenus}
            quantities={quantities}
            total={total}
            itemCount={itemCount}
            customerName={customerName}
            notes={notes}
            error={error}
            isPending={isPending}
            canSubmit={canSubmit}
            setCustomerName={setCustomerName}
            setNotes={setNotes}
            submit={submit}
            compact
          />
        </section>
      </section>

      <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-orange-200/80 bg-white/95 p-4 shadow-[0_-12px_40px_rgba(120,53,15,0.12)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-stone-500">{itemCount} item</p>
            <p className="text-2xl font-black text-ink">{formatCurrency(total)}</p>
          </div>
          <button type="button" onClick={submit} disabled={!canSubmit} className="btn-primary px-5">
            {isPending ? "Membuat..." : "Buat Pesanan"}
          </button>
        </div>
      </footer>
    </main>
  );
}

function Hero({ itemCount }: { itemCount: number }) {
  return (
    <header className="relative overflow-hidden rounded-lg bg-[#241006] p-5 text-white shadow-[0_24px_80px_rgba(120,53,15,0.24)] sm:p-7">
      <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand/40 blur-3xl" />
      <div className="absolute -bottom-24 left-8 h-52 w-52 rounded-full bg-yellow-300/20 blur-3xl" />
      <div className="relative grid gap-5 md:grid-cols-[1fr_280px] md:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-100">
            <ShoppingBag size={15} />
            Bala Bala Anget
          </div>
          <h1 className="mt-4 max-w-xl text-4xl font-black leading-[0.95] sm:text-5xl">Pesan dulu, ambil sesuai nomor antrean.</h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-orange-50 sm:text-base">
            Pilih gorengan, tulis nama, lalu sistem membuat nomor antrean otomatis untuk kasir dan dapur.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 md:grid-cols-1">
          <HeroStat icon={<Utensils size={18} />} label="Self order" />
          <HeroStat icon={<ReceiptText size={18} />} label={`${itemCount} item`} />
          <HeroStat icon={<Clock3 size={18} />} label="Realtime" />
        </div>
      </div>
    </header>
  );
}

function HeroStat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-3 text-sm font-black text-orange-50 md:justify-start">
      {icon}
      {label}
    </div>
  );
}

function MenuCard({
  menu,
  index,
  quantity,
  onDecrease,
  onIncrease
}: {
  menu: Menu;
  index: number;
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  const selected = quantity > 0;
  const fallbackGradient = index % 2 === 0 ? "from-orange-200 via-amber-100 to-white" : "from-yellow-200 via-orange-100 to-white";

  return (
    <article
      className={`overflow-hidden rounded-lg border bg-white shadow-[0_12px_38px_rgba(120,53,15,0.08)] transition ${
        selected ? "border-brand ring-2 ring-brand/20" : "border-orange-100"
      } ${menu.is_sold_out ? "opacity-70" : "hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(120,53,15,0.14)]"}`}
    >
      <div className="relative h-36 overflow-hidden bg-orange-50">
        {menu.image_url ? (
          <Image src={menu.image_url} alt={menu.name} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        ) : (
          <div className={`grid h-full place-items-center bg-gradient-to-br ${fallbackGradient}`}>
            <div className="grid h-20 w-20 place-items-center rounded-full bg-white/80 text-4xl font-black text-brand shadow-inner">
              {menu.name.slice(0, 1)}
            </div>
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          {selected ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-black text-green-700 shadow-sm">
              <CheckCircle2 size={13} />
              Dipilih
            </span>
          ) : null}
          {menu.is_sold_out ? <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-black text-white">Habis</span> : null}
        </div>
      </div>

      <div className="p-4">
        <div className="min-h-20">
          <h3 className="text-lg font-black">{menu.name}</h3>
          {menu.description ? <p className="mt-1 line-clamp-2 text-sm leading-5 text-stone-600">{menu.description}</p> : null}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-lg font-black text-brand">{formatCurrency(menu.price)}</p>
          <QuantityControl menuName={menu.name} quantity={quantity} disabled={menu.is_sold_out} onDecrease={onDecrease} onIncrease={onIncrease} />
        </div>
      </div>
    </article>
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
    <div className="flex shrink-0 items-center gap-2 rounded-full bg-orange-50 p-1 ring-1 ring-orange-100">
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

function CheckoutPanel({
  selectedMenus,
  quantities,
  total,
  itemCount,
  customerName,
  notes,
  error,
  isPending,
  canSubmit,
  setCustomerName,
  setNotes,
  submit,
  compact = false
}: {
  selectedMenus: Menu[];
  quantities: Record<string, number>;
  total: number;
  itemCount: number;
  customerName: string;
  notes: string;
  error: string;
  isPending: boolean;
  canSubmit: boolean;
  setCustomerName: (value: string) => void;
  setNotes: (value: string) => void;
  submit: () => void;
  compact?: boolean;
}) {
  return (
    <section className="rounded-lg border border-orange-200 bg-white p-4 shadow-[0_18px_55px_rgba(120,53,15,0.12)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="section-title">Keranjang</p>
          <h2 className="mt-1 text-xl font-black">Detail pesanan</h2>
        </div>
        <span className="rounded-full bg-orange-50 px-3 py-2 text-sm font-black text-brand">{itemCount} item</span>
      </div>

      <div className="mt-4 rounded-lg bg-orange-50 p-3">
        {selectedMenus.length ? (
          <div className="space-y-2">
            {selectedMenus.map((menu) => (
              <div key={menu.id} className="flex items-start justify-between gap-3 text-sm">
                <span className="font-semibold">
                  {quantities[menu.id]}x {menu.name}
                </span>
                <span className="font-black">{formatCurrency(menu.price * (quantities[menu.id] ?? 0))}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm font-medium text-stone-500">Belum ada menu dipilih.</p>
        )}
        <div className="mt-3 flex justify-between border-t border-orange-200 pt-3 text-lg font-black">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <label className="block">
          <span className="text-sm font-bold">Nama Kamu</span>
          <input
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            maxLength={50}
            className="field"
            placeholder="Contoh: Budi"
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold">Catatan opsional</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value.slice(0, 200))}
            rows={compact ? 2 : 3}
            className="field"
            placeholder="Contoh: jangan terlalu matang"
          />
        </label>
        {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p> : null}
      </div>

      <button type="button" onClick={submit} disabled={!canSubmit} className="btn-primary mt-4 hidden w-full lg:inline-flex">
        {isPending ? "Membuat..." : "Buat Pesanan"}
      </button>
    </section>
  );
}
