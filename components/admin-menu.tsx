"use client";

import { useState, useTransition } from "react";
import { saveMenuAction } from "@/actions/staff";
import { formatCurrency } from "@/lib/utils";
import type { Menu } from "@/types";

const emptyMenu = {
  name: "",
  description: "",
  price: 0,
  image_url: "",
  sort_order: 0,
  is_active: true,
  is_sold_out: false
};

export function AdminMenu({ initialMenus }: { initialMenus: Menu[] }) {
  const [menus, setMenus] = useState(initialMenus);
  const [editing, setEditing] = useState<Partial<Menu> & typeof emptyMenu>(emptyMenu);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit() {
    setError("");
    startTransition(async () => {
      try {
        const saved = await saveMenuAction({ ...editing, price: Number(editing.price), sort_order: Number(editing.sort_order) });
        setMenus((current) => {
          const exists = current.some((menu) => menu.id === saved.id);
          return exists ? current.map((menu) => (menu.id === saved.id ? saved : menu)) : [...current, saved];
        });
        setEditing(emptyMenu);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Menu gagal disimpan");
      }
    });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
      <section className="rounded-lg border border-orange-200 bg-white p-4">
        <h2 className="text-lg font-bold">{editing.id ? "Edit Menu" : "Tambah Menu"}</h2>
        <div className="mt-4 space-y-3">
          <Field label="Nama" value={editing.name} onChange={(value) => setEditing({ ...editing, name: value })} />
          <Field label="Deskripsi" value={editing.description ?? ""} onChange={(value) => setEditing({ ...editing, description: value })} />
          <Field label="Harga" type="number" value={String(editing.price)} onChange={(value) => setEditing({ ...editing, price: Number(value) })} />
          <Field label="URL Gambar" value={editing.image_url ?? ""} onChange={(value) => setEditing({ ...editing, image_url: value })} />
          <Field label="Urutan" type="number" value={String(editing.sort_order)} onChange={(value) => setEditing({ ...editing, sort_order: Number(value) })} />
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={editing.is_active} onChange={(event) => setEditing({ ...editing, is_active: event.target.checked })} />
            Aktif
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={editing.is_sold_out} onChange={(event) => setEditing({ ...editing, is_sold_out: event.target.checked })} />
            Habis
          </label>
          {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p> : null}
          <button disabled={isPending} onClick={submit} className="w-full rounded-md bg-brand px-4 py-3 font-bold text-white disabled:bg-stone-300">
            {isPending ? "Menyimpan..." : "Simpan Menu"}
          </button>
          {editing.id ? (
            <button onClick={() => setEditing(emptyMenu)} className="w-full rounded-md border border-orange-200 px-4 py-3 font-bold">
              Batal Edit
            </button>
          ) : null}
        </div>
      </section>
      <section className="space-y-3">
        {menus.map((menu) => (
          <article key={menu.id} className="rounded-lg border border-orange-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">{menu.name}</h3>
                <p className="text-sm text-stone-600">{menu.description}</p>
                <p className="mt-2 font-bold text-brand">{formatCurrency(menu.price)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-brand">{menu.is_active ? "Aktif" : "Nonaktif"}</span>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">{menu.is_sold_out ? "Habis" : "Tersedia"}</span>
                <button
                  onClick={() =>
                    setEditing({
                      ...emptyMenu,
                      ...menu,
                      description: menu.description ?? "",
                      image_url: menu.image_url ?? ""
                    })
                  }
                  className="rounded-md border border-orange-200 px-3 py-1 text-xs font-bold"
                >
                  Edit
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-md border border-orange-200 px-3 py-2 outline-none focus:border-brand"
      />
    </label>
  );
}
