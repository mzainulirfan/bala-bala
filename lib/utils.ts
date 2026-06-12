import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function statusLabel(status: string) {
  const labels: Record<string, string> = {
    waiting: "Menunggu",
    processing: "Diproses",
    ready: "Siap Diambil",
    completed: "Selesai",
    cancelled: "Dibatalkan"
  };
  return labels[status] ?? status;
}
