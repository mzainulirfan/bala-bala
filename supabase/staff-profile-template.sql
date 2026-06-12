-- Jalankan setelah membuat user di Supabase Auth.
-- Ganti UUID_* dengan id user dari Authentication > Users.

insert into public.profiles (id, name, email, role)
values
  ('UUID_ADMIN_DI_SINI', 'Admin', 'admin@gorengan.test', 'admin'),
  ('UUID_CASHIER_DI_SINI', 'Kasir', 'cashier@gorengan.test', 'cashier'),
  ('UUID_KITCHEN_DI_SINI', 'Dapur', 'kitchen@gorengan.test', 'kitchen');
