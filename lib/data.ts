import type { CreateOrderInput, Menu, Order, OrderStatus, PaymentStatus, Profile } from "@/types";
import {
  demoCreateOrder,
  demoGetOrderByCode,
  demoGetOrderById,
  demoListActiveMenus,
  demoListAllMenus,
  demoListDisplayOrders,
  demoListKitchenOrders,
  demoListOrders,
  demoListProfiles,
  demoSaveMenu,
  demoUpdateOrderStatus,
  demoUpdatePaymentStatus
} from "@/lib/demo-store";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { todayISO } from "@/lib/utils";

function mapOrder(row: any): Order {
  return {
    id: row.id,
    order_code: row.order_code,
    queue_number: row.queue_number,
    queue_date: row.queue_date,
    customer_name: row.customer_name,
    notes: row.notes,
    total_amount: Number(row.total_amount),
    status: row.status,
    payment_status: row.payment_status,
    created_at: row.created_at,
    items: (row.order_items ?? []).map((item: any) => ({
      id: item.id,
      order_id: item.order_id,
      menu_id: item.menu_id,
      menu_name: item.menu_name,
      price: Number(item.price),
      quantity: Number(item.quantity),
      subtotal: Number(item.subtotal)
    }))
  };
}

const orderSelect = "*, order_items(*)";

export async function listActiveMenus(): Promise<Menu[]> {
  if (!isSupabaseConfigured()) return demoListActiveMenus();
  const supabase = createSupabaseServerClient(true);
  const { data, error } = await supabase
    .from("menus")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listAllMenus(): Promise<Menu[]> {
  if (!isSupabaseConfigured()) return demoListAllMenus();
  const supabase = createSupabaseServerClient(true);
  const { data, error } = await supabase.from("menus").select("*").order("sort_order").order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  if (!isSupabaseConfigured()) return demoCreateOrder(input);

  const name = input.customer_name.trim();
  if (name.length < 2 || name.length > 50) throw new Error("Nama wajib 2-50 karakter");
  if ((input.notes ?? "").length > 200) throw new Error("Catatan maksimal 200 karakter");
  const selected = input.items.filter((item) => item.quantity > 0);
  if (!selected.length) throw new Error("Pilih minimal 1 menu");
  if (selected.some((item) => item.quantity > 99)) throw new Error("Quantity maksimal 99");

  const supabase = createSupabaseServerClient(true);
  const menuIds = selected.map((item) => item.menu_id);
  const { data: menus, error: menuError } = await supabase
    .from("menus")
    .select("id, name, price, is_active, is_sold_out")
    .in("id", menuIds);
  if (menuError) throw new Error(menuError.message);

  let total = 0;
  const items = selected.map((item) => {
    const menu = menus?.find((candidate) => candidate.id === item.menu_id);
    if (!menu) throw new Error("Menu tidak ditemukan");
    if (!menu.is_active) throw new Error(`Menu ${menu.name} tidak aktif`);
    if (menu.is_sold_out) throw new Error(`Menu ${menu.name} sudah habis`);
    const subtotal = Number(menu.price) * item.quantity;
    total += subtotal;
    return {
      menu_id: menu.id,
      menu_name: menu.name,
      price: Number(menu.price),
      quantity: item.quantity,
      subtotal
    };
  });

  const { data: queueNumber, error: queueError } = await supabase.rpc("generate_queue_number");
  if (queueError) throw new Error(queueError.message);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: name,
      notes: input.notes?.trim() || null,
      total_amount: total,
      queue_number: queueNumber,
      queue_date: todayISO()
    })
    .select("*")
    .single();
  if (orderError) throw new Error(orderError.message);

  const { error: itemError } = await supabase
    .from("order_items")
    .insert(items.map((item) => ({ ...item, order_id: order.id })));
  if (itemError) throw new Error(itemError.message);

  const created = await getOrderById(order.id);
  if (!created) throw new Error("Pesanan gagal dimuat setelah dibuat");
  return created;
}

export async function getOrderByCode(orderCode: string): Promise<Order | null> {
  if (!isSupabaseConfigured()) return demoGetOrderByCode(orderCode);
  const supabase = createSupabaseServerClient(true);
  const { data, error } = await supabase
    .from("orders")
    .select(orderSelect)
    .eq("order_code", orderCode.toUpperCase())
    .single();
  if (error) return null;
  return mapOrder(data);
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (!isSupabaseConfigured()) return demoGetOrderById(id);
  const supabase = createSupabaseServerClient(true);
  const { data, error } = await supabase.from("orders").select(orderSelect).eq("id", id).single();
  if (error) return null;
  return mapOrder(data);
}

export async function listOrders(status?: OrderStatus | "all"): Promise<Order[]> {
  if (!isSupabaseConfigured()) return demoListOrders(status);
  const supabase = createSupabaseServerClient(true);
  let query = supabase.from("orders").select(orderSelect).eq("queue_date", todayISO()).order("created_at", { ascending: false });
  if (status && status !== "all") query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapOrder);
}

export async function listKitchenOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured()) return demoListKitchenOrders();
  const supabase = createSupabaseServerClient(true);
  const { data, error } = await supabase
    .from("orders")
    .select(orderSelect)
    .eq("queue_date", todayISO())
    .in("status", ["waiting", "processing"])
    .order("queue_number", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapOrder);
}

export async function listDisplayOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured()) return demoListDisplayOrders();
  const supabase = createSupabaseServerClient(true);
  const { data, error } = await supabase
    .from("orders")
    .select(orderSelect)
    .eq("queue_date", todayISO())
    .in("status", ["processing", "ready"])
    .order("queue_number", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapOrder);
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  if (!isSupabaseConfigured()) return demoUpdateOrderStatus(id, status);
  const supabase = createSupabaseServerClient(true);
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  const order = await getOrderById(id);
  if (!order) throw new Error("Pesanan tidak ditemukan");
  return order;
}

export async function updatePaymentStatus(id: string, payment_status: PaymentStatus) {
  if (!isSupabaseConfigured()) return demoUpdatePaymentStatus(id, payment_status);
  const supabase = createSupabaseServerClient(true);
  const { error } = await supabase.from("orders").update({ payment_status }).eq("id", id);
  if (error) throw new Error(error.message);
  const order = await getOrderById(id);
  if (!order) throw new Error("Pesanan tidak ditemukan");
  return order;
}

export async function saveMenu(input: Partial<Menu> & { name: string; price: number }) {
  if (!isSupabaseConfigured()) return demoSaveMenu(input);
  const supabase = createSupabaseServerClient(true);
  const payload = {
    name: input.name.trim(),
    description: input.description?.trim() || null,
    price: Math.trunc(input.price),
    image_url: input.image_url?.trim() || null,
    sort_order: Number(input.sort_order ?? 0),
    is_active: Boolean(input.is_active),
    is_sold_out: Boolean(input.is_sold_out)
  };
  if (payload.name.length < 2) throw new Error("Nama menu minimal 2 karakter");
  if (payload.price < 0) throw new Error("Harga tidak boleh negatif");
  const query = input.id
    ? supabase.from("menus").update(payload).eq("id", input.id).select("*").single()
    : supabase.from("menus").insert(payload).select("*").single();
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as Menu;
}

export async function listProfiles(): Promise<Profile[]> {
  if (!isSupabaseConfigured()) return demoListProfiles();
  const supabase = createSupabaseServerClient(true);
  const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getDailyReport() {
  const orders = await listOrders("all");
  const paidOrders = orders.filter((order) => order.payment_status === "paid");
  const itemTotals = new Map<string, number>();
  for (const order of orders) {
    for (const item of order.items) {
      itemTotals.set(item.menu_name, (itemTotals.get(item.menu_name) ?? 0) + item.quantity);
    }
  }

  return {
    totalOrders: orders.length,
    revenue: paidOrders.reduce((sum, order) => sum + order.total_amount, 0),
    completedOrders: orders.filter((order) => order.status === "completed").length,
    cancelledOrders: orders.filter((order) => order.status === "cancelled").length,
    bestSellers: [...itemTotals.entries()]
      .map(([menu_name, quantity]) => ({ menu_name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
  };
}
