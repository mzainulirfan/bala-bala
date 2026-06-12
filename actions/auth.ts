"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { UserRole } from "@/types";

const demoUsers: Record<string, { password: string; role: UserRole; name: string }> = {
  "admin@gorengan.test": { password: "password", role: "admin", name: "Admin Demo" },
  "cashier@gorengan.test": { password: "password", role: "cashier", name: "Kasir Demo" },
  "kitchen@gorengan.test": { password: "password", role: "kitchen", name: "Dapur Demo" }
};

export async function loginAction(_: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Email dan password wajib diisi" };

  try {
    if (isSupabaseConfigured()) {
      const supabase = createSupabaseServerClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) return { error: "Login gagal" };

      const admin = createSupabaseServerClient(true);
      const { data: profile } = await admin.from("profiles").select("role, name").eq("id", data.user.id).single();
      if (!profile?.role) return { error: "Role user belum dikonfigurasi" };
      cookies().set("staff_role", profile.role, { httpOnly: true, sameSite: "lax", path: "/" });
      cookies().set("staff_name", profile.name ?? email, { httpOnly: true, sameSite: "lax", path: "/" });
    } else {
      const user = demoUsers[email];
      if (!user || user.password !== password) return { error: "Gunakan akun demo yang tersedia" };
      cookies().set("staff_role", user.role, { httpOnly: true, sameSite: "lax", path: "/" });
      cookies().set("staff_name", user.name, { httpOnly: true, sameSite: "lax", path: "/" });
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Login gagal" };
  }

  const role = cookies().get("staff_role")?.value;
  if (role === "admin") redirect("/admin");
  if (role === "kitchen") redirect("/kitchen");
  redirect("/cashier");
}

export async function logoutAction() {
  cookies().delete("staff_role");
  cookies().delete("staff_name");
  redirect("/login");
}

export async function requireRole(allowed: UserRole[]) {
  const role = cookies().get("staff_role")?.value as UserRole | undefined;
  if (!role || !allowed.includes(role)) redirect("/login");
  return {
    role,
    name: cookies().get("staff_name")?.value ?? "Staff"
  };
}
