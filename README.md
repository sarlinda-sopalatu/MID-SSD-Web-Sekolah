# Web Sekolah Cendekia — Sistem Informasi Sekolah Terintegrasi
Berbasis *Scalable System Design (SSD)* untuk Ujian MID Semester Ganjil 2025.

---

## 🏫 Deskripsi Umum Sistem
**Web Sekolah Cendekia (WSC)** adalah platform sistem informasi sekolah terintegrasi hulu-ke-hilir yang dirancang secara modular berbasis prinsip *Scalable System Design*. Sistem ini dirancang untuk mengatasi fragmentasi data sekolah dengan menyatukan 7 modul krusial (Kesiswaan, Jurnal, BK, Absensi, Nilai, Akademik, dan Pengguna) ke dalam satu database pusat (Centralized Database) dengan arsitektur **Modular Monolith** yang berkinerja tinggi, aman, dan siap bertumbuh elastis di masa depan.

---

## 👥 Kelompok Web Sekolah Cendekia (TI-4A)
Pembagian tugas dirancang seimbang sesuai kompetensi teknis untuk memenuhi standar penilaian kolaboratif:

| No | Nama Anggota | NIM | Peran Utama | Tanggung Jawab Teknis |
|---|---|---|---|---|
| 1 | **Siti Rahayu** | 2201010113 | **System Analyst (Lead)** | Analisis kebutuhan, perancangan use-case, penyusunan diagram alur kerja, koordinasi timeline proyek. |
| 2 | **Sarlinda Sopalatu** | 2201010111 | **System Architect & Security** | Perancangan arsitektur Modular Monolith, partisi 6 vCPU, token JWT, otorisasi RBAC, monitoring, logging, GitHub push. |
| 3 | **Budi Santoso** | 2201010112 | **Database Designer** | Perancangan ERD, skema database (16 tabel), relasi FK, optimalisasi query dengan Indexing & ACID Transactions. |
| 4 | **Ahmad Fauzi** | 2201010114 | **UI/UX & Documentation** | Desain UI modern berbasis Tailwind CSS, komponen reusable, responsivitas halaman, penyusunan laporan PDF 4433. |

---

## 🗂️ 7 Modul yang Dibuat & Fitur Unggulan

### 1. Modul Jurnal Mengajar
- **Pengguna**: Guru Mata Pelajaran
- **Fitur**: Form input jurnal mengajar harian (tanggal, materi, metode, catatan hambatan), simpan sebagai draft, status alur persetujuan (*Submitted*, *Approved*), rekap jurnal, dan sistem notifikasi real-time ke Kepala Sekolah untuk approval.

### 2. Modul Bimbingan Konseling (BK)
- **Pengguna**: Guru BK
- **Fitur**: Pencatatan Kasus BK berdasarkan siswa harian dengan prioritas (*Low, Medium, High, Urgent*), pencatatan Pelanggaran Siswa lengkap dengan sanksi dan poin pelanggaran, pencatatan Prestasi Siswa lengkap dengan tingkat kejuaraan (sekolah s/d internasional), serta log Catatan Konseling lanjutan secara berkelanjutan.

### 3. Modul Data Kesiswaan
- **Pengguna**: Admin & Kepala Sekolah
- **Fitur**: Pendaftaran siswa baru tunggal, mutasi, pelulusan, pengaturan kelas aktif, status keaktifan (*Active, Transferred, Graduated, Dropped*), serta impor data siswa massal.

### 4. Modul Akademik & Penjadwalan
- **Pengguna**: Admin, Guru, Siswa, Ortu
- **Fitur**: Manajemen data tahun ajaran aktif, semester, daftar mata pelajaran kurikulum, serta pembuatan Jadwal Pelajaran harian per kelas.

### 5. Modul Absensi
- **Pengguna**: Guru & Wali Kelas
- **Fitur**: Pencatatan presensi siswa harian per siswa maupun secara massal (Bulk Attendance) per kelas, status kehadiran (*Hadir, Sakit, Izin, Terlambat, Absen*), serta ringkasan persentase statistik real-time.

### 6. Modul Nilai
- **Pengguna**: Guru & Wali Kelas
- **Fitur**: Pengisian komponen nilai (Quiz 20%, Tugas 20%, UTS 30%, UAS 30%), kalkulasi nilai akhir otomatis di sisi backend, penentuan predikat huruf (*Grade A, B, C, D, E*), serta visualisasi distribusi grade.

### 7. Modul Manajemen Pengguna & Logs
- **Pengguna**: Admin
- **Fitur**: Pengelolaan akun, kontrol penugasan role, reset password ke default (*password123*), serta audit log keamanan harian (`activity_logs`).

---

## 💻 Teknologi yang Digunakan
- **Frontend**: React.js 18, Vite (Fast Build Tool), Tailwind CSS (Modern Styling), Axios (HTTP Client), React Hot Toast, React Icons.
- **Backend**: Node.js, Express.js (Asynchronous Web Framework), Sequelize ORM (Relational Abstraction).
- **Database**: MySQL 8.0 (Centralized Data Storage), Redis (In-Memory Caching).
- **Tools**: Docker & Docker Compose, Nginx (Load Balancer), HAProxy, draw.io (Architecture diagrams).

---

## 📂 Struktur Folder Proyek
```
MID-SSD-Web-Sekolah-Kelompok-Cendekia/
├── frontend/                    # Sisi Klien (React SPA)
│   ├── public/                  # File aset statis
│   ├── src/
│   │   ├── components/         # Komponen Reusable (DataTable, Modal, PageHeader, dll.)
│   │   ├── pages/              # Halaman Modul (Login, Dashboard, Students, dll.)
│   │   ├── services/           # Axios Services (api.js terpusat)
│   │   ├── context/            # AuthContext (JWT session state)
│   │   ├── config/             # design.js (Satu Design System Warna Terpusat)
│   │   ├── App.jsx             # Router aplikasi
│   │   └── main.jsx
│   └── package.json
│
├── backend/                     # Sisi Server (Express REST API)
│   ├── src/
│   │   ├── controllers/        # Logika Bisnis Modul (auth, student, bk, grade, etc.)
│   │   ├── models/             # Skema Tabel Sequelize (16 models)
│   │   ├── routes/             # Handler URL Endpoint (14 routes)
│   │   ├── middleware/         # Validasi, JWT Auth, Otorisasi RBAC
│   │   ├── config/             # Koneksi Database & Seed script (runSeed.js)
│   │   └── server.js           # Entrypoint Express Server
│   ├── .env.example            # Contoh konfigurasi environment tanpa password asli
│   └── package.json
│
├── docker/                      # Konfigurasi containerization
│   └── Dockerfile.backend
└── README.md
```

---

## 🏗️ Rancangan Arsitektur Sistem (Modular Monolith)
```
  ┌────────────────────────────────────────────────────────┐
  │                 REVERSE PROXY / LOAD BALANCER          │
  │                      Nginx (Port 80/443)               │
  └────────────────────────────────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
  ┌──────────────────┐                  ┌──────────────────┐
  │  REACT FRONTEND  │                  │  REACT FRONTEND  │
  │     Node-1       │                  │     Node-2       │
  └──────────────────┘                  └──────────────────┘
            │                                     │
            └──────────────────┬──────────────────┘
                               ▼
  ┌────────────────────────────────────────────────────────┐
  │                BACKEND EXPRESS.JS API SERVER           │
  │                       (Modular Monolith)               │
  │  ┌───────────┬───────────┬───────────┬──────────────┐  │
  │  │ Kesiswaan │  Jurnal   │    BK     │  Absensi     │  │
  │  ├───────────┼───────────┼───────────┼──────────────┤  │
  │  │   Nilai   │ Akademik  │ Pengguna  │ Notifikasi   │  │
  │  └───────────┴───────────┴───────────┴──────────────┘  │
  └────────────────────────────────────────────────────────┘
            │                                     │
            ▼ (Hit Cache)                         ▼ (Centralized Data)
  ┌──────────────────┐                  ┌──────────────────┐
  │   REDIS CACHE    │                  │  MYSQL DATABASE  │
  │    Port 6379     │                  │    Port 3306     │
  └──────────────────┘                  └──────────────────┘
```

---

## ⚡ Pembagian vCPU / Server Virtual
Beban sistem dialokasikan ke dalam **6 Node Server Virtual (vCPU)** secara logis dengan justifikasi teknis:

- **vCPU 1: Modul Jurnal Mengajar & Absensi (2 Cores, 4GB RAM)** — Sifat transaksi tinggi di pagi (absen) & sore (jurnal). Dipisahkan agar tidak mengganggu performa modul lain.
- **vCPU 2: Modul BK (1 Core, 2GB RAM)** — Penanganan data kasus BK yang sensitif. Diberikan firewall & enkripsi ketat.
- **vCPU 3: Modul Data Kesiswaan & Akademik (2 Cores, 4GB RAM)** — Menangani impor/ekspor data massal yang mengonsumsi CPU tinggi.
- **vCPU 4: Web Server Frontend React (2 Cores, 4GB RAM)** — Melayani penyajian berkas statis (SPA) ke ribuan klien secara stabil via Nginx.
- **vCPU 5: Centralized Database Server MySQL (4 Cores, 8GB RAM, SSD)** — Dialokasikan resource tertinggi untuk mengoptimalkan transaction pools, InnoDB buffer pool, dan disk IOPS harian.
- **vCPU 6: Load Balancer (HAProxy) & Redis Cache (2 Cores, 4GB RAM)** — Distribusi request merata & RAM caching untuk data static harian.

---

## 📊 Rancangan Database (Relasi ERD)
Seluruh 16 tabel menggunakan database pusat `school_system` dengan relasi integritas data tinggi (`RESTRICT` untuk data master):

```
users ─── roles (role_id)
  │
students ─── classes (class_id)
  │
teachers ─── subjects (subject_id)

teaching_journals ──┬── teachers (teacher_id)
                    ├── classes (class_id)
                    └── subjects (subject_id)

bk_cases ──┬── students (student_id)
           └── teachers (counselor_id)

student_violations ──┬── students (student_id)
                     └── teachers (reported_by)

student_achievements ── students (student_id)

attendance ── students (student_id)

grades ──┬── students (student_id)
         ├── subjects (subject_id)
         └── semesters (semester_id)

schedules ──┬── teachers (teacher_id)
            ├── classes (class_id)
            └── subjects (subject_id)

activity_logs ── users (user_id)
notifications ── users (user_id)
```

---

## 🌟 Penerapan Unsur Scalable System Design (SSD)
1. **Modular Monolith**: Kode bisnis terpisah rapi di folder controller/route/model terisolasi, memudahkan pemisahan menjadi layanan mikro (*Microservices*) saat jumlah siswa bertambah masif.
2. **Centralized Database**: MySQL relasional hulu-ke-hilir untuk menjamin tidak adanya duplikasi data akademik siswa.
3. **Database Indexing**: Indeks dipasang pada Foreign Keys penting (`student_id`, `class_id`, `subject_id`, `date`) untuk mempercepat eksekusi query relasional harian.
4. **Redis Caching**: Menyimpan sementara data master (Daftar kelas, mata pelajaran, jadwal) di RAM untuk mengurangi query redundan ke MySQL hingga 70%.
5. **Horizontal Scaling Ready**: Server Express.js bersifat *stateless* (menggunakan token JWT tanpa session server), siap di-scale harian menggunakan kontainer Docker di belakang Load Balancer.
6. **Role-Based Access Control (RBAC)**: Otorisasi route API ketat menggunakan custom middleware. Data BK aman terlindungi, hanya bisa diakses oleh role 'Guru BK' atau 'Admin'.
7. **Audit Logging & Monitoring**: Log terperinci pada tabel `activity_logs` merekam aktivitas login, mutasi, edit nilai, serta penanganan BK harian demi forensik keamanan. Endpoint `/api/health` memantau kesehatan server & database secara real-time.

---

## 📦 Panduan Instalasi & Menjalankan di Lokal (Localhost)

### 1. Prasyarat Sistem
- **Node.js** (Versi 18 ke atas)
- **XAMPP** (untuk server MySQL)

### 2. Setup Database (MySQL XAMPP)
1. Aktifkan **Apache** dan **MySQL** di XAMPP Control Panel.
2. Buka browser, akses `http://localhost/phpmyadmin/`.
3. Buat database baru bernama: **`school_system`**.

### 3. Setup & Jalankan Backend Server
1. Buka terminal baru, masuk ke folder backend:
   ```bash
   cd backend
   ```
2. Instal dependencies:
   ```bash
   npm install
   ```
3. Copy berkas environment:
   ```bash
   cp .env.example .env
   ```
4. Jalankan seeder database (Sangat Penting! Membuat tabel sekaligus mengisi dummy data lengkap):
   ```bash
   node src/config/runSeed.js
   ```
5. Jalankan server:
   ```bash
   node src/server.js
   ```
   *Terminal akan menampilkan: "Server running on port 5000" dan "Database connected successfully".*

### 4. Setup & Jalankan Frontend Client
1. Buka terminal baru lagi, masuk ke folder frontend:
   ```bash
   cd frontend
   ```
2. Instal dependencies:
   ```bash
   npm install
   ```
3. Jalankan aplikasi:
   ```bash
   npm run dev
   ```
4. Buka browser Anda dan akses alamat:
   👉 **`http://localhost:3000`**

---

## 🔑 Akun Login Demo (Fiktif - Dummy Data)
Password semua akun demo harian adalah: **`password123`**

| Role | Email Login | Hak Akses Utama di Sistem |
|---|---|---|
| **Admin** | `admin@sekolah.test` | Mengelola data kesiswaan, guru, kelas, mapel, akun, & logs |
| **Kepala Sekolah** | `kepsek@sekolah.test` | Lihat rekap laporan semua modul (Read-only) + Approve Jurnal |
| **Guru** | `guru@sekolah.test` | Lihat jadwal mengajar harian, isi jurnal, input komponen nilai |
| **Guru BK** | `bk@sekolah.test` | Catat kasus BK siswa, rekap sanksi pelanggaran, input prestasi |
| **Wali Kelas** | `walikelas@sekolah.test` | Mengelola data siswa, jadwal, nilai, & absensi kelas bimbingan |
| **Siswa** | `siswa@sekolah.test` | Lihat profil, jadwal pelajaran, absensi pribadi, nilai rapor |
| **Orang Tua** | `ortu@sekolah.test` | Memantau absensi, sanksi pelanggaran, prestasi, & nilai rapor anak |

---

## 🎥 Video Presentasi YouTube
Tonton video presentasi komprehensif, arsitektur vCPU, dan demo fitur sistem hulu-ke-hilir kami di tautan berikut:
👉 **[Link Video Presentasi Kelompok Cendekia di YouTube](https://youtu.be/dummy-cendekia-ssd)**
