# PRD — Sistem Antrean & Self-Order Gorengan Viral
**Versi:** 1.1 (Revisi Detail)
**Tanggal:** Juni 2026
**Status:** Draft — Siap Dikerjakan

---

## Daftar Isi

1. [Ringkasan Produk](#1-ringkasan-produk)
2. [Latar Belakang Masalah](#2-latar-belakang-masalah)
3. [Tujuan Produk](#3-tujuan-produk)
4. [Target Pengguna](#4-target-pengguna)
5. [Platform & Stack Teknologi](#5-platform--stack-teknologi)
6. [Konsep Produk](#6-konsep-produk)
7. [Scope MVP](#7-scope-mvp)
8. [Di Luar Scope MVP](#8-di-luar-scope-mvp)
9. [User Flow](#9-user-flow)
10. [Role & Permission](#10-role--permission)
11. [Status Pesanan](#11-status-pesanan)
12. [Status Pembayaran](#12-status-pembayaran)
13. [Nomor Antrean](#13-nomor-antrean)
14. [Struktur Halaman & Routing](#14-struktur-halaman--routing)
15. [Database Design](#15-database-design)
16. [Realtime Requirement](#16-realtime-requirement)
17. [UI Requirement](#17-ui-requirement)
18. [Validasi Data](#18-validasi-data)
19. [Security Requirement](#19-security-requirement)
20. [Laporan MVP](#20-laporan-mvp)
21. [QR Code Requirement](#21-qr-code-requirement)
22. [Acceptance Criteria](#22-acceptance-criteria)
23. [Prioritas Development](#23-prioritas-development)
24. [Environment Variables](#24-environment-variables)
25. [Risiko & Mitigasi](#25-risiko--mitigasi)
26. [Future Enhancement](#26-future-enhancement)
27. [Definisi Sukses](#27-definisi-sukses)
28. [Catatan Implementasi Awal](#28-catatan-implementasi-awal)

---

## 1. Ringkasan Produk

Sistem ini adalah **aplikasi web mobile-first** untuk membantu toko gorengan yang mengalami lonjakan antrean akibat produk viral.

**Cara kerja secara garis besar:**
1. Pembeli datang ke toko, scan QR Code menggunakan kamera HP.
2. Browser HP otomatis membuka halaman order — tidak perlu install aplikasi apapun.
3. Pembeli memilih menu, tentukan jumlah, isi nama, lalu submit pesanan.
4. Sistem otomatis memberikan **nomor antrean unik** (contoh: `A001`, `A002`).
5. Kasir dan dapur memproses pesanan melalui dashboard masing-masing.
6. Display antrean di layar TV/tablet menampilkan nomor yang sedang diproses dan siap diambil.

**Siapa yang menggunakan sistem ini?**
- **Pembeli** — memesan sendiri lewat HP
- **Kasir** — memantau pesanan masuk, konfirmasi pembayaran
- **Dapur/Produksi** — melihat dan memproses antrean pesanan
- **Admin/Owner** — mengelola menu, harga, user, laporan

---

## 2. Latar Belakang Masalah

Toko gorengan sedang ramai karena produk viral di media sosial. Akibatnya terjadi lonjakan pembeli yang membuat operasional kacau.

**Masalah yang terjadi saat ini:**

| # | Masalah | Dampak |
|---|---------|--------|
| 1 | Tidak ada sistem antrean, pembeli tidak tahu siapa yang datang lebih dulu | Pembeli saling rebut, suasana tidak kondusif |
| 2 | Penjual mencatat pesanan manual di kertas atau ingatan | Pesanan bisa terlewat atau tertukar |
| 3 | Total harga dihitung manual oleh kasir | Lambat dan rawan kesalahan hitung |
| 4 | Tidak ada visibilitas status pesanan untuk pembeli | Pembeli terus-menerus bertanya ke kasir |
| 5 | Kasir dan bagian produksi tidak punya alur kerja yang jelas | Koordinasi buruk, pesanan bisa ganda atau terlewat |
| 6 | Pembeli yang baru datang bisa dianggap menyerobot | Konflik antar pembeli |

**Solusi yang diusulkan:**
Membuat sistem pemesanan mandiri berbasis QR Code dengan nomor antrean otomatis, dashboard kasir, dashboard dapur, dan display antrean realtime.

---

## 3. Tujuan Produk

| Tujuan | Indikator Keberhasilan |
|--------|------------------------|
| Pembeli bisa memesan sendiri tanpa bantuan kasir | Kasir tidak perlu lagi input pesanan manual |
| Antrean diatur berdasarkan urutan pesanan masuk | Tidak ada lagi konflik siapa yang duluan |
| Total biaya dihitung otomatis | Tidak ada lagi salah hitung manual |
| Kasir bisa memantau semua pesanan dari satu layar | Dashboard kasir menampilkan semua pesanan real-time |
| Dapur bisa memproses pesanan sesuai urutan | Tidak ada pesanan yang dilewati atau salah urutan |
| Pembeli tahu nomor antrean dan status pesanannya | Berkurangnya pertanyaan "pesanan saya mana?" |
| Sistem bisa di-deploy di Vercel tanpa server tambahan | Deployment berhasil dan bisa diakses online |

---

## 4. Target Pengguna

### 4.1 Pembeli

**Siapa:** Orang yang datang ke toko untuk membeli gorengan.

**Karakteristik:**
- Membawa smartphone (Android/iOS)
- Tidak semua melek teknologi — UI harus sangat sederhana
- Tidak mau install aplikasi
- Ingin proses cepat, tidak mau ribet

**Yang mereka butuhkan:**
- Melihat menu dengan gambar dan harga
- Memesan dengan mudah (tap-tap, isi nama, submit)
- Tahu nomor antrean mereka
- Bisa cek status pesanan kapan saja

---

### 4.2 Kasir

**Siapa:** Pegawai toko yang bertugas di meja kasir.

**Karakteristik:**
- Tidak selalu melek teknologi, perlu UI yang intuitif
- Bekerja di lingkungan ramai dan cepat
- Menggunakan smartphone atau tablet di meja kasir

**Yang mereka butuhkan:**
- Melihat semua pesanan yang masuk secara real-time
- Tahu detail pesanan (apa yang dipesan, total harga)
- Konfirmasi pembayaran saat pembeli membayar
- Bisa batalkan pesanan jika perlu

---

### 4.3 Dapur / Produksi

**Siapa:** Pegawai bagian produksi yang membuat gorengan.

**Karakteristik:**
- Tangan sering kotor/basah, jadi layar harus minimal sentuh
- Butuh informasi yang jelas dan besar
- Tidak perlu akses ke informasi keuangan

**Yang mereka butuhkan:**
- Melihat daftar pesanan yang harus dibuat, urut dari yang pertama
- Tahu apa saja item yang dipesan dan berapa banyak
- Update status pesanan (mulai proses → siap diambil)

---

### 4.4 Admin / Owner

**Siapa:** Pemilik toko atau manajer yang mengelola keseluruhan sistem.

**Yang mereka butuhkan:**
- Kelola menu (tambah, edit, nonaktifkan, tandai habis)
- Kelola akun kasir dan dapur
- Lihat laporan penjualan harian

---

## 5. Platform & Stack Teknologi

### 5.1 Platform

Aplikasi berbentuk **web mobile-first**. Tidak ada aplikasi Android/iOS yang perlu diinstall. Pembeli cukup scan QR Code dan halaman langsung terbuka di browser HP (Chrome, Safari, dll).

### 5.2 Stack Teknologi

| Kategori | Teknologi | Alasan |
|---|---|---|
| Framework Frontend | Next.js 14 (App Router) | Cocok untuk Vercel, support Server Actions |
| Hosting | Vercel | Free tier cukup untuk MVP, auto-deploy dari GitHub |
| Database | Supabase (PostgreSQL) | Gratis, sudah include auth, realtime, dan API |
| Authentication | Supabase Auth | Terintegrasi langsung dengan database |
| Realtime | Supabase Realtime | Subscribe perubahan data tanpa polling terus-menerus |
| Styling | TailwindCSS | Cepat, class-based, cocok untuk mobile-first |
| UI Component | shadcn/ui | Komponen siap pakai, bisa dikustomisasi |
| Backend Logic | Next.js Server Actions / API Routes | Tidak perlu server terpisah |
| Queue Generator | PostgreSQL Function (Supabase RPC) | Generate nomor antrean aman dari race condition |

### 5.3 Kenapa Pilihan Ini?

- **Next.js + Vercel:** Deploy semudah push ke GitHub, tidak perlu manage server sendiri.
- **Supabase:** Satu platform untuk database, auth, API, dan realtime. Tidak perlu banyak servis berbeda.
- **Web app:** Pembeli tidak perlu install apapun. Cukup kamera untuk scan QR.

### 5.4 Struktur Folder Project (Rekomendasi)

```
/
├── app/
│   ├── (public)/
│   │   ├── order/
│   │   │   └── page.tsx              # Halaman order pembeli
│   │   ├── order/success/[orderCode]/
│   │   │   └── page.tsx              # Halaman sukses + nomor antrean
│   │   └── track/[orderCode]/
│   │       └── page.tsx              # Tracking status pesanan
│   ├── (internal)/
│   │   ├── cashier/
│   │   │   ├── page.tsx              # Dashboard kasir
│   │   │   └── orders/[id]/
│   │   │       └── page.tsx          # Detail pesanan kasir
│   │   ├── kitchen/
│   │   │   └── page.tsx              # Antrean dapur
│   │   ├── display/
│   │   │   └── page.tsx              # Display antrean TV
│   │   └── admin/
│   │       ├── page.tsx              # Dashboard admin
│   │       ├── menu/page.tsx         # Kelola menu
│   │       ├── orders/page.tsx       # Kelola pesanan
│   │       ├── reports/page.tsx      # Laporan harian
│   │       └── users/page.tsx        # Kelola user
│   ├── login/
│   │   └── page.tsx                  # Halaman login
│   └── layout.tsx
├── components/
│   ├── order/                        # Komponen halaman order
│   ├── cashier/                      # Komponen halaman kasir
│   ├── kitchen/                      # Komponen halaman dapur
│   ├── display/                      # Komponen display antrean
│   └── ui/                           # shadcn/ui components
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Supabase client (browser)
│   │   └── server.ts                 # Supabase client (server)
│   └── utils.ts
├── actions/
│   ├── order.ts                      # Server actions untuk order
│   ├── menu.ts                       # Server actions untuk menu
│   └── auth.ts                       # Server actions untuk auth
└── types/
    └── index.ts                      # Type definitions
```

---

## 6. Konsep Produk

### 6.1 Alur Inti

```
Pembeli scan QR
       ↓
Buka /order di browser HP
       ↓
Pilih menu & jumlah → Total harga otomatis terhitung
       ↓
Isi nama (wajib) + catatan (opsional)
       ↓
Klik "Buat Pesanan"
       ↓
Server menyimpan pesanan + generate nomor antrean (A001, A002, ...)
       ↓
Pembeli dapat halaman sukses: Nomor Antrean + bisa cek status
       ↓
Kasir lihat pesanan baru di dashboard → konfirmasi bayar
       ↓
Dapur lihat pesanan → proses → tandai siap diambil
       ↓
Display antrean update otomatis
       ↓
Pembeli ambil pesanan
```

### 6.2 Nomor Antrean

Sistem memberikan nomor antrean otomatis mulai dari `A001` setiap harinya. Nomor ini ditampilkan besar di:
- Halaman sukses setelah order (HP pembeli)
- Display antrean di TV/tablet toko
- Dashboard kasir dan dapur

---

## 7. Scope MVP

Fitur yang **wajib ada** di versi pertama (MVP):

### 7.1 Fitur Pembeli

| Fitur | Deskripsi Detail |
|---|---|
| Scan QR → buka halaman order | QR Code mengarah ke `/order`. Tidak ada login, tidak ada registrasi. |
| Lihat daftar menu | Menampilkan semua menu aktif dengan nama, deskripsi (opsional), harga, dan gambar (opsional). Menu habis ditandai dan tidak bisa dipilih. |
| Tambah / kurang jumlah item | Tombol `+` dan `-` per item. Jumlah minimum 0, tidak ada maksimum di MVP. |
| Total harga otomatis | Total dihitung real-time di frontend saat pembeli menambah/mengurangi item. |
| Isi nama pembeli | Input teks wajib diisi. Bukan nomor HP, bukan email. Cukup nama. |
| Isi catatan opsional | Textarea opsional. Contoh: "jangan terlalu matang", "pisahin ya". |
| Submit pesanan | Tombol "Buat Pesanan". Disabled jika tidak ada item yang dipilih atau nama kosong. |
| Terima nomor antrean | Setelah submit berhasil, redirect ke halaman sukses yang menampilkan nomor antrean. |
| Cek status pesanan | Halaman `/track/[orderCode]` menampilkan status terkini pesanan. Bisa diakses kapan saja. |

---

### 7.2 Fitur Kasir

| Fitur | Deskripsi Detail |
|---|---|
| Login kasir | Email + password via Supabase Auth. Role harus `cashier` atau `admin`. |
| Lihat daftar pesanan masuk | List semua pesanan hari ini, diurutkan dari yang terbaru. Real-time update. |
| Filter pesanan berdasarkan status | Filter: Semua / Menunggu / Diproses / Siap Diambil / Selesai / Dibatalkan |
| Lihat detail pesanan | Klik pesanan → lihat nama pembeli, daftar item, jumlah, harga per item, total, catatan, nomor antrean. |
| Konfirmasi pembayaran | Tombol "Tandai Sudah Bayar" → ubah `payment_status` dari `unpaid` ke `paid`. |
| Ubah status pesanan | Kasir bisa ubah status pesanan (manual override jika diperlukan). |
| Batalkan pesanan | Tombol "Batalkan" → ubah status ke `cancelled`. Memerlukan konfirmasi dialog. |

---

### 7.3 Fitur Dapur / Produksi

| Fitur | Deskripsi Detail |
|---|---|
| Login dapur | Email + password via Supabase Auth. Role harus `kitchen` atau `admin`. |
| Lihat antrean pesanan aktif | Menampilkan pesanan dengan status `waiting` dan `processing`, diurutkan dari nomor antrean terkecil (paling lama menunggu). |
| Lihat detail item per pesanan | Setiap card pesanan menampilkan: Nomor antrean (besar), nama pembeli, daftar item + jumlah, catatan pembeli. |
| Mulai proses pesanan | Tombol "Proses" → ubah status dari `waiting` ke `processing`. |
| Tandai siap diambil | Tombol "Siap Diambil" → ubah status dari `processing` ke `ready`. |

---

### 7.4 Fitur Admin

| Fitur | Deskripsi Detail |
|---|---|
| Login admin | Email + password. Role harus `admin`. |
| Tambah menu baru | Form: nama (wajib), deskripsi (opsional), harga (wajib), gambar (opsional), urutan tampil. |
| Edit menu | Edit semua field menu. |
| Nonaktifkan menu | Toggle `is_active`. Menu nonaktif tidak tampil di halaman order pembeli. |
| Tandai menu habis | Toggle `is_sold_out`. Menu habis masih tampil tapi tidak bisa dipesan (ada label "Habis"). |
| Lihat daftar pesanan | Akses ke semua pesanan (bisa filter per tanggal). |
| Lihat laporan harian | Ringkasan: total pesanan, total omzet, pesanan selesai, pesanan dibatalkan, menu terlaris. |
| Kelola user | Tambah akun kasir atau dapur (set email, password, role). |

---

### 7.5 Fitur Display Antrean

| Fitur | Deskripsi Detail |
|---|---|
| Tampilkan nomor sedang diproses | Daftar nomor antrean dengan status `processing`, diurutkan dari terkecil. |
| Tampilkan nomor siap diambil | Daftar nomor antrean dengan status `ready`, diurutkan dari terkecil. |
| Tampilkan nama pembeli | Di sebelah atau di bawah nomor antrean. |
| Auto-update | Menggunakan Supabase Realtime. Fallback: polling setiap 5 detik jika realtime tidak stabil. |
| Tampilan besar | Font besar, kontras tinggi. Dirancang untuk dilihat dari jarak 3-5 meter. |

---

## 8. Di Luar Scope MVP

Fitur-fitur ini **tidak dikerjakan** di versi pertama:

| Fitur | Alasan Ditunda |
|---|---|
| Payment gateway / QRIS otomatis | Kompleks, butuh akun merchant dan integrasi API pihak ketiga |
| Cetak struk printer thermal | Butuh hardware tambahan dan integrasi khusus |
| Notifikasi WhatsApp otomatis | Butuh WhatsApp Business API dan biaya per pesan |
| Aplikasi Android/iOS native | Biaya dan waktu development jauh lebih besar |
| Multi-cabang | Database design dan auth lebih kompleks |
| Loyalty point | Butuh sistem akun pelanggan terlebih dahulu |
| Diskon / promo kompleks | Bisa ditambah setelah fitur inti stabil |
| Estimasi waktu tunggu berbasis AI | Data historis belum ada, terlalu dini |
| Akuntansi lengkap | Di luar kebutuhan toko gorengan skala kecil |
| Manajemen stok bahan baku | Terlalu kompleks untuk MVP |

---

## 9. User Flow

### 9.1 Flow Pembeli (Detail)

```
1. Pembeli datang ke toko
2. Pembeli melihat banner/QR Code
3. Pembeli buka kamera HP → scan QR Code
4. Browser otomatis membuka https://[domain]/order
5. Halaman /order tampil:
   - Header nama toko
   - List menu dalam card (gambar, nama, harga, tombol +/-)
6. Pembeli tap tombol "+" untuk menambah item
   → Angka jumlah berubah
   → Total di bagian bawah layar otomatis berubah
7. Pembeli isi nama di field "Nama Kamu"
8. (Opsional) Pembeli isi catatan
9. Pembeli tap tombol "Buat Pesanan"
   → Jika nama kosong: tampil error "Nama wajib diisi"
   → Jika tidak ada item: tampil error "Pilih minimal 1 menu"
   → Jika valid: loading...
10. Server:
    - Validasi ulang data (menu aktif, harga, total)
    - Simpan ke tabel `orders` dan `order_items`
    - Generate nomor antrean via PostgreSQL Function
11. Pembeli di-redirect ke /order/success/[orderCode]
    - Tampil: Nomor antrean (besar, bold), nama pembeli, ringkasan pesanan, total harga
    - Ada tombol "Cek Status Pesanan" → link ke /track/[orderCode]
12. Pembeli menunggu nomor dipanggil
13. Pembeli bisa sewaktu-waktu buka /track/[orderCode] untuk cek status
```

---

### 9.2 Flow Kasir (Detail)

```
1. Kasir buka browser di HP/tablet/laptop
2. Kasir buka /login → isi email + password → submit
3. Server validasi login + cek role (harus cashier/admin)
4. Redirect ke /cashier
5. Dashboard kasir tampil:
   - List pesanan hari ini, diurutkan dari terbaru
   - Setiap card: nomor antrean, nama pembeli, total harga, status, status bayar
6. Pesanan baru masuk otomatis muncul di atas (realtime)
7. Kasir tap kartu pesanan → buka /cashier/orders/[id]
   - Detail: daftar item, jumlah, harga per item, total, catatan, waktu pesanan
8. Pembeli datang ke kasir untuk bayar:
   → Kasir tap "Tandai Sudah Bayar" → payment_status = paid
9. Kasir bisa ubah status pesanan jika diperlukan
10. Jika pesanan bermasalah:
    → Kasir tap "Batalkan" → muncul dialog konfirmasi → konfirmasi → status = cancelled
11. Setelah pembeli mengambil pesanan:
    → Kasir (atau dapur) ubah status ke completed
```

---

### 9.3 Flow Dapur (Detail)

```
1. Dapur buka browser di HP/tablet (disarankan tablet besar di meja produksi)
2. Login di /login → role kitchen/admin → redirect ke /kitchen
3. Halaman dapur tampil:
   - Card-card pesanan berisi: nomor antrean (besar), nama, item-item yang dipesan, catatan
   - Diurutkan dari nomor antrean terkecil (yang paling lama menunggu)
   - Hanya tampil pesanan dengan status waiting dan processing
4. Pesanan baru muncul otomatis tanpa perlu refresh
5. Dapur mulai buat pesanan nomor A001:
   → Tap "Proses" → status berubah ke processing
   → Card pindah ke kolom "Sedang Diproses" (jika ada tampilan kolom)
6. Setelah gorengan selesai dibuat:
   → Tap "Siap Diambil" → status berubah ke ready
   → Nomor A001 muncul di display antrean bagian "Siap Diambil"
7. Ulangi untuk pesanan berikutnya
```

---

### 9.4 Flow Admin (Detail)

```
1. Admin login di /login → role admin → redirect ke /admin
2. Dashboard admin menampilkan ringkasan hari ini
3. Kelola menu:
   → Buka /admin/menu
   → Lihat semua menu (aktif dan nonaktif)
   → Klik "Tambah Menu" → isi form → simpan
   → Klik menu yang ada → edit atau nonaktifkan atau tandai habis
4. Kelola user:
   → Buka /admin/users
   → Klik "Tambah User" → isi nama, email, password, role → simpan
5. Lihat laporan:
   → Buka /admin/reports
   → Pilih tanggal → lihat ringkasan
```

---

## 10. Role & Permission

### 10.1 Tabel Permission

| Aksi | Admin | Kasir | Dapur | Pembeli |
|---|:---:|:---:|:---:|:---:|
| Login | ✅ | ✅ | ✅ | ❌ |
| Tambah menu | ✅ | ❌ | ❌ | ❌ |
| Edit menu | ✅ | ❌ | ❌ | ❌ |
| Nonaktifkan menu | ✅ | ❌ | ❌ | ❌ |
| Tandai menu habis | ✅ | ✅* | ❌ | ❌ |
| Lihat semua pesanan | ✅ | ✅ | ❌ | ❌ |
| Lihat pesanan aktif (dapur) | ✅ | ❌ | ✅ | ❌ |
| Ubah status pembayaran | ✅ | ✅ | ❌ | ❌ |
| Ubah status pesanan | ✅ | ✅ | ✅** | ❌ |
| Batalkan pesanan | ✅ | ✅ | ❌ | ❌ |
| Kelola user | ✅ | ❌ | ❌ | ❌ |
| Lihat laporan | ✅ | ❌ | ❌ | ❌ |
| Buat pesanan | ❌ | ❌ | ❌ | ✅ |
| Lihat status pesanan sendiri | ❌ | ❌ | ❌ | ✅ |

> *Kasir bisa tandai habis opsional — bisa diatur kemudian oleh admin
> **Dapur hanya bisa ubah ke `processing` dan `ready`

### 10.2 Implementasi Role di Supabase

Role disimpan di tabel `profiles` dengan field `role: 'admin' | 'cashier' | 'kitchen'`.

Setiap halaman internal (bukan `/order` dan `/track`) wajib:
1. Cek apakah user sudah login (via Supabase Auth session)
2. Cek apakah role user sesuai dengan halaman yang diakses
3. Jika tidak sesuai → redirect ke `/login` atau tampil error 403

---

## 11. Status Pesanan

### 11.1 Daftar Status

| Status | Label Tampil | Warna Badge | Deskripsi |
|---|---|---|---|
| `waiting` | Menunggu | 🟡 Kuning | Pesanan baru masuk, belum diproses dapur |
| `processing` | Sedang Diproses | 🔵 Biru | Dapur sedang membuat pesanan |
| `ready` | Siap Diambil | 🟢 Hijau | Pesanan sudah jadi, menunggu diambil pembeli |
| `completed` | Selesai | ⚫ Abu-abu | Pesanan sudah diambil pembeli |
| `cancelled` | Dibatalkan | 🔴 Merah | Pesanan dibatalkan |

### 11.2 Transisi Status yang Diizinkan

```
waiting → processing   (oleh: dapur, kasir, admin)
waiting → cancelled    (oleh: kasir, admin)
processing → ready     (oleh: dapur, kasir, admin)
processing → cancelled (oleh: kasir, admin)
ready → completed      (oleh: kasir, admin)
ready → processing     (oleh: kasir, admin — jika ada masalah)
```

### 11.3 Status yang Tidak Bisa Diubah

- Pesanan dengan status `completed` atau `cancelled` **tidak bisa diubah** lagi.
- Jika ada kesalahan, admin bisa override secara langsung di database (bukan via UI MVP).

---

## 12. Status Pembayaran

| Status | Label Tampil | Deskripsi |
|---|---|---|
| `unpaid` | Belum Bayar | Default saat pesanan dibuat |
| `paid` | Sudah Bayar | Kasir konfirmasi setelah pembeli bayar |
| `refunded` | Dikembalikan | Digunakan jika pesanan dibatalkan dan uang dikembalikan (opsional di MVP) |

**Catatan untuk MVP:**
- Pembayaran dilakukan **manual di kasir** saat pembeli mengambil pesanan (cash/transfer manual).
- Tidak ada integrasi payment gateway.
- Kasir yang mengubah `payment_status` dari `unpaid` ke `paid` secara manual.

---

## 13. Nomor Antrean

### 13.1 Format

```
A001
A002
A003
...
A999
```

Format: **1 huruf prefix** + **3 digit angka** dengan leading zero.

Untuk MVP, prefix selalu `A`. Di masa depan bisa diubah per kategori atau per shift.

### 13.2 Reset Harian

Nomor antrean **reset setiap hari** pukul 00:00 (midnight server time / WIB).

Contoh:
- 12 Juni 2026: A001, A002, ..., A247
- 13 Juni 2026: mulai lagi dari A001

### 13.3 Cara Generate Nomor (Penting — Anti Race Condition)

Nomor antrean **HARUS** di-generate di database menggunakan PostgreSQL Function, bukan di aplikasi. Ini penting untuk menghindari dua pembeli mendapat nomor yang sama saat memesan bersamaan.

**Contoh PostgreSQL Function:**

```sql
CREATE OR REPLACE FUNCTION generate_queue_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  today DATE := CURRENT_DATE;
  next_number INTEGER;
  queue_text TEXT;
BEGIN
  -- Lock baris untuk tanggal ini agar tidak ada race condition
  INSERT INTO queue_counters (queue_date, last_number)
  VALUES (today, 0)
  ON CONFLICT (queue_date) DO NOTHING;

  UPDATE queue_counters
  SET last_number = last_number + 1,
      updated_at = NOW()
  WHERE queue_date = today
  RETURNING last_number INTO next_number;

  -- Format: A001, A002, dst
  queue_text := 'A' || LPAD(next_number::TEXT, 3, '0');

  RETURN queue_text;
END;
$$;
```

**Cara panggil dari Next.js:**

```typescript
const { data, error } = await supabase.rpc('generate_queue_number');
// data = 'A001'
```

### 13.4 Unique Constraint di Database

```sql
-- Di tabel orders, kombinasi queue_date + queue_number harus unik
ALTER TABLE orders ADD CONSTRAINT unique_queue_per_day
  UNIQUE (queue_date, queue_number);
```

---

## 14. Struktur Halaman & Routing

### 14.1 Halaman Publik (Pembeli)

| Route | Deskripsi | Perlu Login? |
|---|---|---|
| `/order` | Halaman utama order pembeli | ❌ Tidak |
| `/order/success/[orderCode]` | Halaman sukses setelah order berhasil, tampilkan nomor antrean | ❌ Tidak |
| `/track/[orderCode]` | Cek status pesanan berdasarkan order code | ❌ Tidak |

**Catatan:**
- `orderCode` adalah kode unik yang di-generate sistem saat order dibuat (bukan nomor antrean).
- Contoh `orderCode`: `ORD-20260612-A1B2`

---

### 14.2 Halaman Kasir

| Route | Deskripsi | Perlu Login? | Role |
|---|---|---|---|
| `/cashier` | Dashboard kasir — list semua pesanan hari ini | ✅ Ya | cashier, admin |
| `/cashier/orders/[id]` | Detail pesanan tertentu | ✅ Ya | cashier, admin |

---

### 14.3 Halaman Dapur

| Route | Deskripsi | Perlu Login? | Role |
|---|---|---|---|
| `/kitchen` | Antrean produksi — pesanan waiting dan processing | ✅ Ya | kitchen, admin |

---

### 14.4 Halaman Display Antrean

| Route | Deskripsi | Perlu Login? | Role |
|---|---|---|---|
| `/display` | Display antrean untuk TV/tablet di toko | ❌ Tidak (publik) | Siapapun |

**Catatan:** `/display` bisa diakses tanpa login agar mudah dibuka di TV. Tapi hanya menampilkan data, tidak ada aksi apapun.

---

### 14.5 Halaman Admin

| Route | Deskripsi | Perlu Login? | Role |
|---|---|---|---|
| `/admin` | Dashboard admin — ringkasan hari ini | ✅ Ya | admin |
| `/admin/menu` | Daftar dan kelola menu | ✅ Ya | admin |
| `/admin/orders` | Daftar semua pesanan (bisa filter tanggal) | ✅ Ya | admin |
| `/admin/reports` | Laporan penjualan harian | ✅ Ya | admin |
| `/admin/users` | Kelola user (kasir, dapur) | ✅ Ya | admin |

---

### 14.6 Halaman Auth

| Route | Deskripsi |
|---|---|
| `/login` | Halaman login untuk kasir, dapur, dan admin |

---

## 15. Database Design

### 15.1 Tabel `menus`

Menyimpan data menu gorengan yang dijual.

```sql
CREATE TABLE menus (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  description  TEXT,
  price        INTEGER NOT NULL CHECK (price >= 0), -- dalam Rupiah
  image_url    TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  is_sold_out  BOOLEAN NOT NULL DEFAULT false,
  sort_order   INTEGER NOT NULL DEFAULT 0, -- urutan tampil di halaman order
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `id` | UUID | ✅ | Primary key, auto-generated |
| `name` | TEXT | ✅ | Nama menu, misal "Tempe Goreng" |
| `description` | TEXT | ❌ | Deskripsi singkat, opsional |
| `price` | INTEGER | ✅ | Harga dalam Rupiah (tidak pakai desimal) |
| `image_url` | TEXT | ❌ | URL gambar dari Supabase Storage |
| `is_active` | BOOLEAN | ✅ | `true` = tampil di halaman order |
| `is_sold_out` | BOOLEAN | ✅ | `true` = tampil tapi tidak bisa dipesan |
| `sort_order` | INTEGER | ✅ | Urutan tampil, angka kecil muncul lebih atas |
| `created_at` | TIMESTAMPTZ | ✅ | Waktu dibuat, auto-fill |
| `updated_at` | TIMESTAMPTZ | ✅ | Waktu diupdate terakhir, perlu trigger |

---

### 15.2 Tabel `orders`

Menyimpan data pesanan utama.

```sql
CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code       TEXT NOT NULL UNIQUE,   -- kode unik untuk tracking
  queue_number     TEXT,                    -- contoh: A001
  queue_date       DATE NOT NULL DEFAULT CURRENT_DATE,
  customer_name    TEXT NOT NULL,
  customer_phone   TEXT,                   -- opsional
  total_amount     INTEGER NOT NULL CHECK (total_amount >= 0),
  status           TEXT NOT NULL DEFAULT 'waiting'
                     CHECK (status IN ('waiting', 'processing', 'ready', 'completed', 'cancelled')),
  payment_status   TEXT NOT NULL DEFAULT 'unpaid'
                     CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (queue_date, queue_number)
);
```

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `id` | UUID | ✅ | Primary key |
| `order_code` | TEXT | ✅ | Kode unik untuk URL tracking, misal `ORD-20260612-AB12` |
| `queue_number` | TEXT | ✅ | Nomor antrean, misal `A001`. Di-generate via RPC. |
| `queue_date` | DATE | ✅ | Tanggal pesanan (untuk reset harian) |
| `customer_name` | TEXT | ✅ | Nama pembeli |
| `customer_phone` | TEXT | ❌ | Nomor HP, opsional |
| `total_amount` | INTEGER | ✅ | Total harga dalam Rupiah, dihitung ulang di server |
| `status` | TEXT | ✅ | Status pesanan, lihat bagian 11 |
| `payment_status` | TEXT | ✅ | Status pembayaran, lihat bagian 12 |
| `notes` | TEXT | ❌ | Catatan dari pembeli |
| `created_at` | TIMESTAMPTZ | ✅ | Waktu order dibuat |
| `updated_at` | TIMESTAMPTZ | ✅ | Waktu terakhir diupdate |

---

### 15.3 Tabel `order_items`

Menyimpan detail item di setiap pesanan.

```sql
CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_id     UUID REFERENCES menus(id) ON DELETE SET NULL,
  menu_name   TEXT NOT NULL,    -- snapshot nama menu saat dipesan
  price       INTEGER NOT NULL, -- snapshot harga saat dipesan
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  subtotal    INTEGER NOT NULL, -- price * quantity
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `id` | UUID | ✅ | Primary key |
| `order_id` | UUID | ✅ | Foreign key ke `orders.id` |
| `menu_id` | UUID | ❌ | Foreign key ke `menus.id`. Nullable agar data tetap ada jika menu dihapus. |
| `menu_name` | TEXT | ✅ | **Snapshot nama menu** saat dipesan. Jangan ambil dari relasi karena nama bisa berubah. |
| `price` | INTEGER | ✅ | **Snapshot harga** saat dipesan. Jangan ambil dari relasi. |
| `quantity` | INTEGER | ✅ | Jumlah item yang dipesan |
| `subtotal` | INTEGER | ✅ | `price × quantity`, dihitung di server |

> ⚠️ **Kenapa ada `menu_name` dan `price` yang di-snapshot?**
> Jika admin mengubah harga menu besok, kita tetap ingin tahu harga yang berlaku saat pesanan dibuat. Jadi kita simpan snapshot-nya.

---

### 15.4 Tabel `profiles`

Menyimpan profil dan role user internal (kasir, dapur, admin).

```sql
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('admin', 'cashier', 'kitchen')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | UUID | Sama dengan `auth.users.id` dari Supabase Auth |
| `name` | TEXT | Nama tampil user |
| `role` | TEXT | `admin`, `cashier`, atau `kitchen` |

> Tabel ini otomatis terhubung ke sistem auth Supabase. Saat user login, kita bisa ambil role-nya dari sini.

---

### 15.5 Tabel `queue_counters`

Menyimpan counter nomor antrean per tanggal.

```sql
CREATE TABLE queue_counters (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_date   DATE NOT NULL UNIQUE,
  last_number  INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

| Field | Tipe | Keterangan |
|---|---|---|
| `queue_date` | DATE | Tanggal (UNIQUE — satu baris per hari) |
| `last_number` | INTEGER | Nomor antrean terakhir yang sudah dipakai hari ini |

> Tabel ini di-manage oleh PostgreSQL Function `generate_queue_number()`. Tidak perlu diakses langsung oleh aplikasi.

---

### 15.6 Trigger `updated_at`

Semua tabel yang punya field `updated_at` perlu trigger otomatis:

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Pasang trigger ke setiap tabel yang relevan
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON menus
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Ulangi untuk tabel lain yang punya updated_at
```

---

## 16. Realtime Requirement

Supabase Realtime memungkinkan data berubah di satu device langsung ter-update di device lain tanpa perlu refresh manual.

### 16.1 Channel yang Perlu Realtime

| Channel | Subscribe di | Event yang didengarkan |
|---|---|---|
| `orders` | Dashboard kasir | INSERT (pesanan baru), UPDATE (status berubah) |
| `orders` | Dashboard dapur | INSERT, UPDATE (terutama status `waiting` → `processing`) |
| `orders` | Halaman display | UPDATE (status berubah ke `processing`, `ready`) |
| `orders` | Halaman tracking pembeli | UPDATE (status pesanan yang relevan) |

### 16.2 Contoh Implementasi Realtime di Next.js

```typescript
// Di komponen kasir dashboard
useEffect(() => {
  const channel = supabase
    .channel('orders-cashier')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      (payload) => {
        // Update state pesanan saat ada perubahan
        fetchOrders(); // atau update state lokal
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

### 16.3 Fallback Polling

Jika Supabase Realtime tidak stabil (koneksi putus, masalah jaringan), gunakan **polling setiap 5 detik** sebagai fallback:

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    fetchOrders();
  }, 5000); // 5 detik

  return () => clearInterval(interval);
}, []);
```

> Untuk MVP, polling fallback sudah cukup. Realtime bisa dioptimasi setelah MVP stabil.

---

## 17. UI Requirement

### 17.1 Prinsip UI

- **Mobile-first:** Semua tampilan dirancang untuk layar HP 375px–430px terlebih dahulu.
- **Tombol besar:** Minimum tinggi 44px untuk semua tombol (touch target).
- **Font besar:** Minimum 16px untuk body text, 24px+ untuk nomor antrean.
- **Minim input:** Kurangi typing sebisa mungkin (tap untuk pilih item, bukan input angka).
- **Warna status jelas:** Setiap status punya warna badge yang konsisten (lihat tabel di bagian 11).
- **Loading state:** Setiap aksi async (submit order, ubah status) harus ada loading indicator.
- **Error state:** Setiap error harus ditampilkan dengan pesan yang jelas, bukan console.log.

---

### 17.2 Halaman Order Pembeli (`/order`)

**Layout:**
```
┌─────────────────────────────┐
│  🍟 Gorengan Viral           │  ← Header nama toko
├─────────────────────────────┤
│  [Gambar] Tempe Goreng      │  ← Card menu
│  Rp 2.000                   │
│            [ - ] [ 2 ] [ + ]│
├─────────────────────────────┤
│  [Gambar] Tahu Goreng       │
│  Rp 2.000                   │
│            [ - ] [ 0 ] [ + ]│
├─────────────────────────────┤
│  ...                        │
├─────────────────────────────┤
│  Nama Kamu *                │  ← Input nama
│  [________________]         │
│                             │
│  Catatan (opsional)         │  ← Textarea catatan
│  [________________]         │
│  [________________]         │
└─────────────────────────────┘
┌─────────────────────────────┐  ← Sticky footer
│  Total: Rp 4.000            │
│  [    Buat Pesanan    ]      │  ← Tombol besar
└─────────────────────────────┘
```

**Aturan:**
- Menu dengan `is_sold_out = true` tampil dengan label "Habis" dan tombol `+` disabled (grey out).
- Menu dengan `is_active = false` tidak tampil sama sekali.
- Tombol "Buat Pesanan" disabled jika: total = 0 atau nama kosong.
- Total sticky selalu terlihat di bawah layar saat scroll.

---

### 17.3 Halaman Sukses Order (`/order/success/[orderCode]`)

```
┌─────────────────────────────┐
│  ✅ Pesanan Berhasil!        │
│                             │
│  Nomor Antrean Kamu         │
│  ┌─────────────────────┐    │
│  │       A 0 0 1       │    │  ← Font sangat besar (48px+)
│  └─────────────────────┘    │
│                             │
│  Nama: Budi                 │
│  Total: Rp 4.000            │
│                             │
│  Ringkasan Pesanan:         │
│  • Tempe Goreng x2 = 4.000  │
│                             │
│  [  Cek Status Pesanan  ]   │  ← Tombol ke /track/[orderCode]
└─────────────────────────────┘
```

---

### 17.4 Halaman Tracking (`/track/[orderCode]`)

```
┌─────────────────────────────┐
│  Pesanan #A001               │
│  Status: 🔵 Sedang Diproses  │  ← Badge warna sesuai status
│                             │
│  Nama: Budi                 │
│  Total: Rp 4.000            │
│                             │
│  ⏱ Dipesan pukul 14:23      │
│                             │
│  Rincian:                   │
│  • Tempe Goreng x2 = 4.000  │
└─────────────────────────────┘
```

**Aturan:** Halaman ini auto-refresh (polling 5 detik) atau realtime via Supabase.

---

### 17.5 Dashboard Kasir (`/cashier`)

```
┌─────────────────────────────┐
│  Dashboard Kasir            │
│  [Semua] [Menunggu] [Proses]│  ← Filter tabs
│  [Siap]  [Selesai] [Batal]  │
├─────────────────────────────┤
│  A001 • Budi • Rp 4.000    │
│  🟡 Menunggu • 💳 Belum Bayar│  ← Card pesanan
├─────────────────────────────┤
│  A002 • Sari • Rp 6.000    │
│  🔵 Diproses • 💳 Belum Bayar│
└─────────────────────────────┘
```

---

### 17.6 Dashboard Dapur (`/kitchen`)

```
┌─────────────────────────────┐
│  Antrean Dapur              │
├─────────────────────────────┤
│  ┌───────────────────────┐  │
│  │  A001                 │  │  ← Nomor antrean besar
│  │  Budi                 │  │
│  │  • Tempe x2           │  │  ← Daftar item
│  │  • Tahu x1            │  │
│  │  Catatan: jgn matang  │  │  ← Catatan pembeli
│  │                       │  │
│  │  [Proses] [Siap Ambil]│  │  ← Tombol aksi
│  └───────────────────────┘  │
│                             │
│  A002 • dst...              │
└─────────────────────────────┘
```

---

### 17.7 Display Antrean (`/display`)

Dirancang untuk **TV atau tablet besar** di area toko. Tidak perlu interaksi.

```
┌───────────────────────────────────────────────────┐
│            🍟 ANTREAN GORENGAN VIRAL              │
├────────────────────┬──────────────────────────────┤
│  SEDANG DIPROSES   │     SIAP DIAMBIL             │
│                    │                              │
│     A001           │          A003                │
│     Budi           │          Ani                 │
│                    │                              │
│     A002           │          A004                │
│     Sari           │          Doni                │
│                    │                              │
└────────────────────┴──────────────────────────────┘
```

**Aturan:**
- Font sangat besar (48px untuk nomor antrean).
- Background gelap, teks terang agar mudah dibaca dari jarak jauh.
- Auto-update tanpa interaksi (realtime atau polling 5 detik).
- Tidak ada tombol, tidak ada navigasi.

---

## 18. Validasi Data

### 18.1 Validasi di Frontend (Client-Side)

Validasi di frontend bersifat UX — untuk memberi feedback cepat ke pembeli. Tapi **tidak cukup** untuk keamanan.

| Field | Aturan Validasi |
|---|---|
| `customer_name` | Wajib diisi, minimal 2 karakter, maksimal 50 karakter |
| Items | Minimal 1 item dengan quantity > 0 |
| `notes` | Opsional, maksimal 200 karakter |
| `quantity` per item | Minimal 0, maksimal 99 |

---

### 18.2 Validasi di Server (Server-Side) — WAJIB

Semua request order **harus divalidasi ulang di server**, tidak boleh percaya data dari frontend.

```typescript
// Server Action atau API Route untuk create order
async function createOrder(formData: OrderFormData) {
  // 1. Validasi nama tidak kosong
  if (!formData.customer_name?.trim()) {
    throw new Error('Nama pembeli wajib diisi');
  }

  // 2. Ambil data menu dari database (jangan percaya harga dari frontend)
  const menuIds = formData.items.map(item => item.menu_id);
  const { data: menus } = await supabase
    .from('menus')
    .select('id, name, price, is_active, is_sold_out')
    .in('id', menuIds);

  // 3. Validasi setiap item
  let calculatedTotal = 0;
  const validatedItems = [];

  for (const item of formData.items) {
    const menu = menus.find(m => m.id === item.menu_id);

    if (!menu) throw new Error(`Menu tidak ditemukan`);
    if (!menu.is_active) throw new Error(`Menu ${menu.name} tidak aktif`);
    if (menu.is_sold_out) throw new Error(`Menu ${menu.name} sudah habis`);
    if (item.quantity <= 0) throw new Error(`Quantity harus lebih dari 0`);

    const subtotal = menu.price * item.quantity; // pakai harga dari database!
    calculatedTotal += subtotal;

    validatedItems.push({
      menu_id: menu.id,
      menu_name: menu.name,
      price: menu.price,       // dari database, bukan dari frontend
      quantity: item.quantity,
      subtotal,
    });
  }

  // 4. Simpan order dan items, generate nomor antrean
  // ...
}
```

---

### 18.3 Validasi Admin Menu

| Field | Aturan |
|---|---|
| `name` | Wajib diisi, minimal 2 karakter, maksimal 100 karakter |
| `price` | Wajib diisi, angka bulat, minimal 0 (tidak boleh negatif) |
| `sort_order` | Angka bulat, default 0 |
| `is_active` | Harus boolean |
| `is_sold_out` | Harus boolean |

---

## 19. Security Requirement

### 19.1 Authentication

- Semua halaman internal (`/cashier`, `/kitchen`, `/admin`, `/display` kecuali `/display`) wajib login via Supabase Auth.
- Session dikelola otomatis oleh Supabase SDK.
- Token session disimpan di cookie (HTTP-only jika memungkinkan).

### 19.2 Authorization (Role Check)

Setiap halaman internal harus cek role user sebelum render konten:

```typescript
// Contoh middleware atau layout check
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function CashierLayout({ children }) {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (!['cashier', 'admin'].includes(profile?.role)) {
    redirect('/login'); // atau tampil halaman 403
  }

  return <>{children}</>;
}
```

---

### 19.3 Row Level Security (RLS) di Supabase

RLS **wajib diaktifkan** di semua tabel. Ini mencegah pembeli mengakses data yang bukan miliknya langsung via API.

```sql
-- Aktifkan RLS di semua tabel
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Siapapun bisa baca menu yang aktif (untuk halaman order publik)
CREATE POLICY "Menu aktif bisa dilihat publik"
  ON menus FOR SELECT
  USING (is_active = true);

-- Policy: Siapapun bisa insert order baru (publik boleh order)
CREATE POLICY "Publik bisa buat order"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Policy: Pembeli hanya bisa lihat order berdasarkan order_code (via URL)
CREATE POLICY "Baca order via order_code"
  ON orders FOR SELECT
  USING (true); -- Di MVP, kita izinkan karena pembeli akses via order_code unik

-- Policy: Hanya user internal yang bisa update order
CREATE POLICY "Hanya staff yang bisa update order"
  ON orders FOR UPDATE
  USING (auth.role() = 'authenticated');
```

> ⚠️ **Penting:** `SUPABASE_SERVICE_ROLE_KEY` hanya boleh digunakan di server (Server Actions / API Routes). **Jangan pernah** expose ke frontend/browser.

---

### 19.4 Validasi Total di Server

Total harga **selalu dihitung ulang di server** menggunakan harga dari database, bukan dari data yang dikirim frontend. Ini mencegah pembeli memanipulasi harga.

---

## 20. Laporan MVP

Halaman laporan (`/admin/reports`) cukup menampilkan:

| Metrik | Cara Hitung |
|---|---|
| Total pesanan hari ini | `COUNT(*) FROM orders WHERE queue_date = today` |
| Total omzet hari ini | `SUM(total_amount) FROM orders WHERE queue_date = today AND payment_status = 'paid'` |
| Jumlah pesanan selesai | `COUNT(*) WHERE status = 'completed'` |
| Jumlah pesanan dibatalkan | `COUNT(*) WHERE status = 'cancelled'` |
| Menu terlaris | `SELECT menu_name, SUM(quantity) FROM order_items JOIN orders ... GROUP BY menu_name ORDER BY SUM DESC LIMIT 5` |

Tampilan bisa sederhana: tabel atau kartu statistik. Tidak perlu chart di MVP.

---

## 21. QR Code Requirement

### 21.1 URL yang Dituju

```
https://[nama-domain].vercel.app/order
```

### 21.2 Generate QR Code

QR Code bisa di-generate menggunakan:
- Website online: `qr-code-generator.com`, `qrcode-monkey.com`
- Library: `qrcode` (npm) jika ingin generate via aplikasi

QR Code di-print dalam resolusi tinggi untuk dipasang di toko.

### 21.3 Penempatan QR Code

QR Code dipasang di:
- Banner antrean di pintu masuk/area antrian
- Meja toko / etalase
- Area kasir (untuk pembeli yang terlanjur antre manual)
- Area tunggu

### 21.4 Teks Banner

```
SCAN UNTUK PESAN
📱 Pilih menu dari HP kamu
🎫 Dapat nomor antrean otomatis
✅ Tidak perlu antre di kasir
```

---

## 22. Acceptance Criteria

Fitur dianggap **selesai dan siap ditest** jika semua kriteria berikut terpenuhi:

### 22.1 Pembeli

- [ ] Membuka `/order` tidak memerlukan login apapun
- [ ] Daftar menu tampil lengkap dengan nama, harga, dan tombol +/-
- [ ] Menu habis (`is_sold_out = true`) tampil dengan label "Habis" dan tidak bisa ditambah
- [ ] Total harga berubah real-time saat item ditambah/dikurangi
- [ ] Tombol "Buat Pesanan" tidak bisa diklik jika nama kosong atau tidak ada item
- [ ] Pesanan berhasil tersimpan ke database setelah submit
- [ ] Nomor antrean ter-generate otomatis dan unik
- [ ] Pembeli di-redirect ke halaman sukses dengan nomor antrean setelah submit
- [ ] Pembeli bisa buka `/track/[orderCode]` dan melihat status pesanan terkini

### 22.2 Kasir

- [ ] Kasir bisa login dengan email + password, role kasir/admin
- [ ] User bukan kasir/admin tidak bisa masuk ke `/cashier`
- [ ] Dashboard menampilkan semua pesanan hari ini
- [ ] Pesanan baru muncul tanpa perlu refresh halaman (realtime/polling)
- [ ] Filter status berfungsi
- [ ] Kasir bisa membuka detail pesanan
- [ ] Kasir bisa mengubah `payment_status` ke `paid`
- [ ] Kasir bisa membatalkan pesanan dengan konfirmasi dialog
- [ ] Setelah pembatalan, status pesanan berubah ke `cancelled`

### 22.3 Dapur

- [ ] Dapur bisa login dengan email + password, role kitchen/admin
- [ ] User bukan kitchen/admin tidak bisa masuk ke `/kitchen`
- [ ] Hanya pesanan dengan status `waiting` dan `processing` yang tampil
- [ ] Pesanan diurutkan dari nomor antrean terkecil
- [ ] Pesanan baru muncul tanpa refresh (realtime/polling)
- [ ] Tombol "Proses" mengubah status ke `processing`
- [ ] Tombol "Siap Diambil" mengubah status ke `ready`
- [ ] Setelah status `ready`, kartu pesanan hilang dari tampilan dapur

### 22.4 Admin

- [ ] Admin bisa login, hanya role admin yang bisa akses `/admin`
- [ ] Admin bisa menambah menu baru
- [ ] Menu baru langsung muncul di halaman order pembeli
- [ ] Admin bisa edit menu
- [ ] Admin bisa toggle `is_active` (nonaktifkan menu)
- [ ] Menu nonaktif tidak muncul di halaman order pembeli
- [ ] Admin bisa toggle `is_sold_out`
- [ ] Menu habis muncul dengan label "Habis" dan tidak bisa dipesan
- [ ] Admin bisa melihat laporan harian sederhana

### 22.5 Display Antrean

- [ ] `/display` bisa dibuka tanpa login
- [ ] Nomor dengan status `processing` tampil di kolom "Sedang Diproses"
- [ ] Nomor dengan status `ready` tampil di kolom "Siap Diambil"
- [ ] Tampilan berubah otomatis tanpa refresh manual
- [ ] Font dan tampilan terbaca dari jarak minimal 3 meter

### 22.6 Keamanan

- [ ] Total harga pada order tersimpan berdasarkan harga dari database, bukan dari frontend
- [ ] `SUPABASE_SERVICE_ROLE_KEY` tidak terekspos ke browser
- [ ] RLS aktif di semua tabel
- [ ] Pembeli tidak bisa mengubah status pesanan

---

## 23. Prioritas Development

Kerjakan fitur dalam urutan berikut. **Jangan loncat phase** — setiap phase adalah fondasi untuk phase berikutnya.

### Phase 1 — Setup Project (Estimasi: 1-2 hari)

- [ ] Init project Next.js 14 dengan App Router
- [ ] Setup TailwindCSS
- [ ] Setup dan install shadcn/ui
- [ ] Buat Supabase project baru
- [ ] Setup environment variables (`.env.local`)
- [ ] Setup Supabase client (browser dan server)
- [ ] Buat database schema (semua tabel)
- [ ] Buat PostgreSQL Function `generate_queue_number()`
- [ ] Aktifkan RLS dan buat policy dasar
- [ ] Push ke GitHub dan setup deploy ke Vercel

**Output:** Project bisa di-deploy ke Vercel, database siap.

---

### Phase 2 — Public Order (Estimasi: 2-3 hari)

- [ ] Buat halaman `/order`
  - [ ] Fetch dan tampilkan menu aktif
  - [ ] Card menu dengan tombol +/- dan quantity
  - [ ] Total harga sticky di bawah
  - [ ] Input nama pembeli
  - [ ] Input catatan opsional
- [ ] Buat Server Action `createOrder()`
  - [ ] Validasi semua input
  - [ ] Hitung total di server
  - [ ] Insert ke `orders` dan `order_items`
  - [ ] Panggil RPC `generate_queue_number()`
- [ ] Buat halaman `/order/success/[orderCode]`
  - [ ] Tampilkan nomor antrean besar
  - [ ] Ringkasan pesanan
  - [ ] Link ke halaman tracking
- [ ] Buat halaman `/track/[orderCode]`
  - [ ] Fetch status pesanan berdasarkan `order_code`
  - [ ] Tampilkan status dengan badge warna

**Output:** Pembeli bisa memesan dan dapat nomor antrean.

---

### Phase 3 — Halaman Login & Auth Guard (Estimasi: 1 hari)

- [ ] Buat halaman `/login`
- [ ] Buat Server Action untuk login via Supabase Auth
- [ ] Buat middleware atau layout guard untuk cek role
- [ ] Test login kasir, dapur, dan admin
- [ ] Redirect sesuai role setelah login berhasil

**Output:** Login berfungsi dan proteksi halaman internal aktif.

---

### Phase 4 — Dashboard Kasir (Estimasi: 2 hari)

- [ ] Buat halaman `/cashier`
  - [ ] Fetch dan tampilkan pesanan hari ini
  - [ ] Filter berdasarkan status
  - [ ] Setup realtime atau polling 5 detik
- [ ] Buat halaman `/cashier/orders/[id]`
  - [ ] Detail pesanan lengkap
  - [ ] Tombol "Tandai Sudah Bayar"
  - [ ] Tombol "Batalkan" dengan dialog konfirmasi
  - [ ] Tombol ubah status (opsional di MVP)
- [ ] Test semua aksi kasir

**Output:** Kasir bisa memantau dan mengelola pesanan.

---

### Phase 5 — Dashboard Dapur (Estimasi: 1-2 hari)

- [ ] Buat halaman `/kitchen`
  - [ ] Fetch pesanan dengan status `waiting` dan `processing`
  - [ ] Tampilkan dalam card besar dengan info lengkap
  - [ ] Urutkan dari nomor antrean terkecil
  - [ ] Setup realtime atau polling
- [ ] Tombol "Proses" → update status ke `processing`
- [ ] Tombol "Siap Diambil" → update status ke `ready`
- [ ] Test alur lengkap dari order → dapur → ready

**Output:** Dapur bisa memproses pesanan sesuai urutan.

---

### Phase 6 — Display Antrean (Estimasi: 1 hari)

- [ ] Buat halaman `/display`
  - [ ] Fetch pesanan `processing` dan `ready`
  - [ ] Tampilkan dua kolom dengan font besar
  - [ ] Setup realtime atau polling 5 detik
- [ ] Test tampilan di TV/layar besar

**Output:** Display antrean berfungsi di TV toko.

---

### Phase 7 — Admin & Laporan (Estimasi: 2-3 hari)

- [ ] Buat halaman `/admin/menu`
  - [ ] List semua menu
  - [ ] Form tambah menu
  - [ ] Form edit menu
  - [ ] Toggle aktif/nonaktif
  - [ ] Toggle habis/tersedia
- [ ] Buat halaman `/admin/users`
  - [ ] List user
  - [ ] Form tambah user (buat akun Supabase Auth + insert profiles)
- [ ] Buat halaman `/admin/reports`
  - [ ] Query dan tampilkan metrik harian
- [ ] Test semua fitur admin

**Output:** Admin bisa kelola menu, user, dan lihat laporan.

---

### Phase 8 — Testing & Polish (Estimasi: 1-2 hari)

- [ ] Test alur lengkap end-to-end (scan QR → order → dapur → display → selesai)
- [ ] Test di berbagai ukuran HP (Android dan iOS)
- [ ] Test di kondisi ramai (simulasi banyak order bersamaan)
- [ ] Fix bug yang ditemukan
- [ ] Pastikan tampilan rapi di mobile

---

## 24. Environment Variables

File `.env.local` (jangan di-commit ke Git):

```env
# Supabase — bisa dilihat di Supabase Dashboard > Project Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# HANYA untuk server! Jangan pernah pakai di frontend/browser!
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# URL app (untuk generate link tracking, dll)
NEXT_PUBLIC_APP_URL=https://gorengan-viral.vercel.app
```

### Aturan Penting

| Variable | Boleh di Client? | Boleh di Server? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Ya | ✅ Ya |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Ya (dengan RLS!) | ✅ Ya |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ **TIDAK PERNAH** | ✅ Ya |
| `NEXT_PUBLIC_APP_URL` | ✅ Ya | ✅ Ya |

> Variable dengan prefix `NEXT_PUBLIC_` otomatis ter-expose ke browser. Variabel tanpa prefix hanya ada di server.

> ⚠️ **Jika `SUPABASE_SERVICE_ROLE_KEY` ter-expose ke frontend, semua data di database bisa diakses dan dimanipulasi siapapun!**

---

## 25. Risiko & Mitigasi

### 25.1 Internet Mati

| | Detail |
|---|---|
| **Risiko** | Seluruh sistem tidak bisa digunakan jika koneksi internet toko mati |
| **Dampak** | Pembeli tidak bisa order, kasir tidak bisa lihat pesanan |
| **Mitigasi** | Siapkan hotspot dari HP sebagai cadangan. Siapkan kertas antrean manual. Brief tim tentang prosedur darurat jika internet mati. |

### 25.2 Nomor Antrean Dobel

| | Detail |
|---|---|
| **Risiko** | Dua pembeli mendapat nomor antrean yang sama karena order bersamaan |
| **Dampak** | Kebingungan di dapur dan kasir, konflik pembeli |
| **Mitigasi** | Generate nomor via PostgreSQL Function dengan atomic UPDATE (bukan di aplikasi). Tambah UNIQUE constraint pada `(queue_date, queue_number)`. |

### 25.3 Pesanan Fiktif / Tidak Diambil

| | Detail |
|---|---|
| **Risiko** | Pembeli submit order tapi tidak datang atau tidak bayar |
| **Dampak** | Gorengan sudah dibuat tapi tidak laku, nomor antrean mubazir |
| **Mitigasi** | Untuk MVP: kasir bisa batalkan pesanan yang terlalu lama tidak diambil. Tahap lanjut: tambah validasi nomor HP atau deposit via QRIS. |

### 25.4 Menu Habis Tidak Di-update

| | Detail |
|---|---|
| **Risiko** | Menu sudah habis di toko tapi belum ditandai habis di sistem |
| **Dampak** | Pembeli pesan item yang tidak bisa dibuat |
| **Mitigasi** | SOP untuk kasir/admin: segera update status menu habis di sistem saat stok fisik habis. Server tetap validasi `is_sold_out` saat order dibuat. |

### 25.5 Koneksi Realtime Putus

| | Detail |
|---|---|
| **Risiko** | Supabase Realtime tidak stabil, dashboard tidak update |
| **Dampak** | Kasir/dapur tidak tahu ada pesanan baru |
| **Mitigasi** | Implementasi polling fallback setiap 5 detik. Tambah tombol "Refresh" manual sebagai last resort. |

---

## 26. Future Enhancement

Fitur-fitur ini bisa dikerjakan **setelah MVP stabil** di toko:

| Prioritas | Fitur | Alasan |
|---|---|---|
| Tinggi | Notifikasi suara / audio saat pesanan baru | Agar dapur tidak perlu selalu lihat layar |
| Tinggi | Cetak struk thermal | Bukti pesanan lebih profesional |
| Sedang | Integrasi QRIS payment gateway | Kurangi risiko pesanan fiktif |
| Sedang | Estimasi waktu tunggu | Beri ekspektasi ke pembeli |
| Sedang | Mode pre-order (pesan sebelum datang) | Kurangi antrean di toko |
| Rendah | Multi-cabang | Untuk ekspansi toko |
| Rendah | Paket menu / bundling | Tambah nilai transaksi |
| Rendah | Promo / diskon | Marketing tool |
| Rendah | Customer loyalty point | Retensi pembeli |
| Rendah | Export laporan ke Excel | Kebutuhan accounting |
| Rendah | Riwayat pembelian pelanggan | Perlu sistem akun pelanggan |

---

## 27. Definisi Sukses

Produk dianggap **berhasil** jika setelah digunakan di toko:

- ✅ Pembeli bisa memesan sendiri tanpa perlu bicara ke kasir
- ✅ Nomor antrean terbentuk otomatis, tidak ada yang dobel
- ✅ Kasir tidak perlu lagi input pesanan manual
- ✅ Dapur memproses pesanan berdasarkan urutan yang jelas
- ✅ Display antrean mengurangi pertanyaan "pesanan saya mana?"
- ✅ Waktu dari pembeli datang hingga pesanan masuk ke sistem berkurang signifikan
- ✅ Antrean di area kasir berkurang dan lebih tertib

---

## 28. Catatan Implementasi Awal

### Fokus Utama

**Jangan overthink.** Kerjakan alur inti ini terlebih dahulu:

```
Scan QR → Pilih Menu → Submit → Nomor Antrean → Kasir Lihat → Dapur Proses → Siap Diambil
```

Setelah alur ini benar-benar berjalan di toko, baru pertimbangkan fitur tambahan.

### Tips untuk Developer

1. **Mulai dari database.** Pastikan schema, RLS, dan PostgreSQL Function sudah benar sebelum mulai coding frontend.
2. **Test di HP sungguhan.** Jangan hanya test di browser desktop. Tampilan mobile-first harus ditest di HP Android/iOS nyata.
3. **Gunakan Supabase Dashboard** untuk cek data, test RLS policy, dan debug query.
4. **Jangan fikirkan payment dulu.** Payment manual (kasir konfirmasi) sudah cukup untuk MVP.
5. **Commit kecil-kecil.** Setiap fitur kecil commit sendiri agar mudah rollback jika ada masalah.
6. **Tanya jika tidak paham.** PRD ini dibuat selengkap mungkin, tapi jika ada yang ambigu, tanyakan sebelum mulai coding — lebih baik tanya 5 menit daripada salah arah 2 jam.

### Tidak Perlu di MVP

- ❌ Payment gateway
- ❌ WhatsApp notification
- ❌ Thermal printer
- ❌ Animasi kompleks
- ❌ Dark mode
- ❌ Multi-language

Fokus pada **fungsi yang benar** dulu. UI bisa dipercantik setelah MVP.
