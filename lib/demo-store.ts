import { randomUUID } from "crypto";
import type { CreateOrderInput, Menu, Order, OrderItem, OrderStatus, PaymentStatus, Profile } from "@/types";
import { todayISO } from "@/lib/utils";

type Store = {
  menus: Menu[];
  orders: Order[];
  profiles: Profile[];
};

const globalForStore = globalThis as typeof globalThis & { __gorenganStore?: Store };

function seedStore(): Store {
  return {
    menus: [
      {
        id: "menu-bala-bala",
        name: "Bala-bala Viral",
        description: "Bakwan sayur renyah dengan sambal khas.",
        price: 3000,
        image_url: null,
        sort_order: 1,
        is_active: true,
        is_sold_out: false
      },
      {
        id: "menu-gehu",
        name: "Gehu Pedas",
        description: "Tahu isi sayur pedas, favorit antrean sore.",
        price: 3500,
        image_url: null,
        sort_order: 2,
        is_active: true,
        is_sold_out: false
      },
      {
        id: "menu-pisang",
        name: "Pisang Goreng",
        description: "Pisang manis tepung crispy.",
        price: 4000,
        image_url: null,
        sort_order: 3,
        is_active: true,
        is_sold_out: false
      },
      {
        id: "menu-combro",
        name: "Combro",
        description: "Oncom pedas dalam singkong goreng.",
        price: 3500,
        image_url: null,
        sort_order: 4,
        is_active: true,
        is_sold_out: true
      }
    ],
    orders: [],
    profiles: [
      { id: "demo-admin", name: "Admin Demo", email: "admin@gorengan.test", role: "admin" },
      { id: "demo-cashier", name: "Kasir Demo", email: "cashier@gorengan.test", role: "cashier" },
      { id: "demo-kitchen", name: "Dapur Demo", email: "kitchen@gorengan.test", role: "kitchen" }
    ]
  };
}

export function demoStore() {
  globalForStore.__gorenganStore ??= seedStore();
  return globalForStore.__gorenganStore;
}

export async function demoListActiveMenus() {
  return demoStore().menus
    .filter((menu) => menu.is_active)
    .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
}

export async function demoListAllMenus() {
  return [...demoStore().menus].sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
}

export async function demoCreateOrder(input: CreateOrderInput) {
  const store = demoStore();
  const name = input.customer_name.trim();
  if (name.length < 2 || name.length > 50) throw new Error("Nama wajib 2-50 karakter");
  if ((input.notes ?? "").length > 200) throw new Error("Catatan maksimal 200 karakter");

  const selected = input.items.filter((item) => item.quantity > 0);
  if (!selected.length) throw new Error("Pilih minimal 1 menu");

  const items: OrderItem[] = [];
  let total = 0;

  for (const item of selected) {
    if (item.quantity > 99) throw new Error("Quantity maksimal 99");
    const menu = store.menus.find((candidate) => candidate.id === item.menu_id);
    if (!menu) throw new Error("Menu tidak ditemukan");
    if (!menu.is_active) throw new Error(`Menu ${menu.name} tidak aktif`);
    if (menu.is_sold_out) throw new Error(`Menu ${menu.name} sudah habis`);

    const subtotal = menu.price * item.quantity;
    total += subtotal;
    items.push({
      id: randomUUID(),
      order_id: "",
      menu_id: menu.id,
      menu_name: menu.name,
      price: menu.price,
      quantity: item.quantity,
      subtotal
    });
  }

  const queueDate = todayISO();
  const sameDayCount = store.orders.filter((order) => order.queue_date === queueDate).length;
  const queueNumber = `A${String(sameDayCount + 1).padStart(3, "0")}`;
  const id = randomUUID();
  const order: Order = {
    id,
    order_code: randomUUID().slice(0, 8).toUpperCase(),
    queue_number: queueNumber,
    queue_date: queueDate,
    customer_name: name,
    notes: input.notes?.trim() || null,
    total_amount: total,
    status: "waiting",
    payment_status: "unpaid",
    created_at: new Date().toISOString(),
    items: items.map((item) => ({ ...item, order_id: id }))
  };

  store.orders.unshift(order);
  return order;
}

export async function demoGetOrderByCode(orderCode: string) {
  return demoStore().orders.find((order) => order.order_code === orderCode.toUpperCase()) ?? null;
}

export async function demoGetOrderById(id: string) {
  return demoStore().orders.find((order) => order.id === id) ?? null;
}

export async function demoListOrders(status?: OrderStatus | "all") {
  const queueDate = todayISO();
  return demoStore().orders
    .filter((order) => order.queue_date === queueDate)
    .filter((order) => !status || status === "all" || order.status === status)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function demoListKitchenOrders() {
  return demoStore().orders
    .filter((order) => order.queue_date === todayISO())
    .filter((order) => order.status === "waiting" || order.status === "processing")
    .sort((a, b) => a.queue_number.localeCompare(b.queue_number));
}

export async function demoListDisplayOrders() {
  return demoStore().orders
    .filter((order) => order.queue_date === todayISO())
    .filter((order) => order.status === "processing" || order.status === "ready")
    .sort((a, b) => a.queue_number.localeCompare(b.queue_number));
}

export async function demoUpdateOrderStatus(id: string, status: OrderStatus) {
  const order = await demoGetOrderById(id);
  if (!order) throw new Error("Pesanan tidak ditemukan");
  order.status = status;
  return order;
}

export async function demoUpdatePaymentStatus(id: string, payment_status: PaymentStatus) {
  const order = await demoGetOrderById(id);
  if (!order) throw new Error("Pesanan tidak ditemukan");
  order.payment_status = payment_status;
  return order;
}

export async function demoSaveMenu(input: Partial<Menu> & { name: string; price: number }) {
  const store = demoStore();
  if (input.name.trim().length < 2) throw new Error("Nama menu minimal 2 karakter");
  if (input.price < 0) throw new Error("Harga tidak boleh negatif");

  if (input.id) {
    const menu = store.menus.find((candidate) => candidate.id === input.id);
    if (!menu) throw new Error("Menu tidak ditemukan");
    Object.assign(menu, {
      name: input.name.trim(),
      description: input.description?.trim() || null,
      price: Math.trunc(input.price),
      image_url: input.image_url?.trim() || null,
      sort_order: Number(input.sort_order ?? menu.sort_order),
      is_active: Boolean(input.is_active),
      is_sold_out: Boolean(input.is_sold_out)
    });
    return menu;
  }

  const menu: Menu = {
    id: randomUUID(),
    name: input.name.trim(),
    description: input.description?.trim() || null,
    price: Math.trunc(input.price),
    image_url: input.image_url?.trim() || null,
    sort_order: Number(input.sort_order ?? 0),
    is_active: input.is_active ?? true,
    is_sold_out: input.is_sold_out ?? false,
    created_at: new Date().toISOString()
  };
  store.menus.push(menu);
  return menu;
}

export async function demoListProfiles() {
  return demoStore().profiles;
}
