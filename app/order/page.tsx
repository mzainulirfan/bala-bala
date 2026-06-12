import { getMenusAction } from "@/actions/order";
import { OrderForm } from "@/components/order-form";

export default async function OrderPage() {
  const menus = await getMenusAction();
  return <OrderForm menus={menus} />;
}
