# Supabase Setup

Panduan ini menghubungkan aplikasi `bala-bala` ke Supabase dan Vercel.

## 1. Buat Project Supabase

1. Buka Supabase Dashboard.
2. Buat project baru, misalnya `bala-bala`.
3. Simpan `Project URL`, `anon public key`, dan `service_role key` dari:
   `Project Settings > API`.

## 2. Jalankan Schema Database

1. Buka `SQL Editor` di Supabase.
2. Copy seluruh isi file `supabase/schema.sql`.
3. Jalankan query.

Schema ini membuat:
- `profiles`
- `menus`
- `queue_counters`
- `orders`
- `order_items`
- enum role/status
- function `generate_queue_number()`
- RLS policy dasar
- seed menu awal

## 3. Buat Akun Staff

Buat user lewat:
`Authentication > Users > Add user`

Contoh akun:
- `admin@gorengan.test`
- `cashier@gorengan.test`
- `kitchen@gorengan.test`

Setelah user dibuat, ambil UUID user dari tabel Auth Users, lalu insert ke `profiles`.

```sql
insert into public.profiles (id, name, email, role)
values
  ('UUID_ADMIN_DI_SINI', 'Admin', 'admin@gorengan.test', 'admin'),
  ('UUID_CASHIER_DI_SINI', 'Kasir', 'cashier@gorengan.test', 'cashier'),
  ('UUID_KITCHEN_DI_SINI', 'Dapur', 'kitchen@gorengan.test', 'kitchen');
```

Jika hanya ingin mulai dari satu akun admin:

```sql
insert into public.profiles (id, name, email, role)
values ('UUID_ADMIN_DI_SINI', 'Admin', 'admin@gorengan.test', 'admin');
```

## 4. Set Environment Variables di Vercel

Buka project Vercel:
`https://vercel.com/mzainulirfans-projects/bala-bala-anget`

Masuk ke:
`Settings > Environment Variables`

Tambahkan variable berikut untuk Production, Preview, dan Development:

```env
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ISI_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=ISI_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL=https://DOMAIN_VERCEL_KAMU
```

Catatan:
- `SUPABASE_SERVICE_ROLE_KEY` jangan pernah diberi prefix `NEXT_PUBLIC_`.
- Setelah env vars disimpan, lakukan redeploy di Vercel.
- Tanpa env vars Supabase, aplikasi akan memakai demo store lokal dan data tidak persisten.

## 5. Test Setelah Deploy

1. Buka `/order`, buat pesanan.
2. Cek tabel `orders` dan `order_items` di Supabase.
3. Login `/login` sebagai kasir/admin.
4. Buka `/kitchen`, ubah status pesanan menjadi diproses dan siap diambil.
5. Buka `/display`, pastikan nomor antrean muncul.

## 6. Query Cek Cepat

```sql
select * from public.menus order by sort_order;
select * from public.orders order by created_at desc;
select * from public.order_items order by order_id;
select id, name, email, role from public.profiles;
```
