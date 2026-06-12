"use server";

import { redirect } from "next/navigation";
import { createOrder, getOrderByCode, listActiveMenus } from "@/lib/data";
import type { CreateOrderInput } from "@/types";

export async function getMenusAction() {
  return listActiveMenus();
}

export async function createOrderAction(input: CreateOrderInput) {
  const order = await createOrder(input);
  redirect(`/order/success/${order.order_code}`);
}

export async function getOrderByCodeAction(orderCode: string) {
  return getOrderByCode(orderCode);
}
