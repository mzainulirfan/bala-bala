import { listDisplayOrdersAction } from "@/actions/staff";
import { DisplayBoard } from "@/components/display-board";

export default async function DisplayPage() {
  const orders = await listDisplayOrdersAction();
  return <DisplayBoard initialOrders={orders} />;
}
