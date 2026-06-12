export type UserRole = "admin" | "cashier" | "kitchen";
export type OrderStatus = "waiting" | "processing" | "ready" | "completed" | "cancelled";
export type PaymentStatus = "unpaid" | "paid";

export type Menu = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  is_sold_out: boolean;
  created_at?: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  menu_id: string;
  menu_name: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export type Order = {
  id: string;
  order_code: string;
  queue_number: string;
  queue_date: string;
  customer_name: string;
  notes: string | null;
  total_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  created_at: string;
  items: OrderItem[];
};

export type Profile = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
};

export type CreateOrderInput = {
  customer_name: string;
  notes?: string;
  items: Array<{ menu_id: string; quantity: number }>;
};
