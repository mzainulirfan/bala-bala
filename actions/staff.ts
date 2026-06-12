"use server";

import { revalidatePath } from "next/cache";
import {
  getDailyReport,
  getOrderById,
  listAllMenus,
  listDisplayOrders,
  listKitchenOrders,
  listOrders,
  listProfiles,
  saveMenu,
  updateOrderStatus,
  updatePaymentStatus
} from "@/lib/data";
import type { Menu, OrderStatus } from "@/types";

export async function listOrdersAction(status?: OrderStatus | "all") {
  return listOrders(status);
}

export async function getOrderAction(id: string) {
  return getOrderById(id);
}

export async function markPaidAction(id: string) {
  const order = await updatePaymentStatus(id, "paid");
  revalidatePath("/cashier");
  revalidatePath(`/cashier/orders/${id}`);
  return order;
}

export async function updateOrderStatusAction(id: string, status: OrderStatus) {
  const order = await updateOrderStatus(id, status);
  revalidatePath("/cashier");
  revalidatePath("/kitchen");
  revalidatePath("/display");
  revalidatePath(`/cashier/orders/${id}`);
  return order;
}

export async function listKitchenOrdersAction() {
  return listKitchenOrders();
}

export async function listDisplayOrdersAction() {
  return listDisplayOrders();
}

export async function listMenusAction() {
  return listAllMenus();
}

export async function saveMenuAction(input: Partial<Menu> & { name: string; price: number }) {
  const menu = await saveMenu(input);
  revalidatePath("/admin/menu");
  revalidatePath("/order");
  return menu;
}

export async function getDailyReportAction() {
  return getDailyReport();
}

export async function listProfilesAction() {
  return listProfiles();
}
