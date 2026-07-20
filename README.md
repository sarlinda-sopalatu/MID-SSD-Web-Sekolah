# Web Sekolah Cendekia — Sistem Informasi Sekolah Terintegrasi
> Proyek Ujian MID Semester | Mata Kuliah: **Scalable System Design** | Kelas: **TI-4A**

---

## 🏫 Deskripsi Sistem

**Web Sekolah Cendekia (WSC)** adalah platform sistem informasi sekolah terintegrasi berbasis web yang dirancang menggunakan prinsip **Scalable System Design (SSD)**. Sistem ini mengintegrasikan **7 modul akademik utama** ke dalam satu platform tunggal dengan **Centralized Database MySQL**, arsitektur **Modular Monolith**, dan mekanisme keamanan **Role-Based Access Control (RBAC)** berbasis **JWT Token**.

Sistem ini mampu menangani pertambahan pengguna, pertumbuhan data, dan lonjakan akses secara elastis melalui rancangan pembagian beban **6 vCPU server virtual**, **Redis Caching**, dan **Load Balancing Nginx**.

---

## 👥 Tim Pengembang — Kelompok Web Sekolah Cendekia (TI-4A)

| No | Nama Lengkap | NIM | Peran | Tanggung Jawab Teknis |
|---|---|---|---|---|
| 1 | **Devi Nirwana** | 105841121023 | **System Analyst / Project Lead** | Menyusun analisis kebutuhan sistem (fungsional & non-fungsional), merancang alur kerja sistem (workflow diagram), menyusun use-case, mengkoordinasikan timeline proyek, dan menyelaraskan keterkaitan antar-modul. |
| 2 | **Alhizra** | 105841101523 | **System Architect** | Merancang arsitektur Modular Monolith, menyusun pembagian beban layanan pada 6 vCPU server virtual, merancang strategi Load Balancing (Nginx/HAProxy), API integration, monitoring sistem, dan logging aktivitas. |
| 3 | **Rizki Amalia Rasyid Ridha** | 105841121223 | **Database Designer** | Merancang skema database utama (16 tabel), menyusun Entity Relationship Diagram (ERD), mendefinisikan relasi Foreign Keys, mengoptimalkan query dengan Indexing, dan memastikan konsistensi data transaksi (ACID). |
| 4 | **Sarlinda Sopalatu** | 105841101423 | **UI/UX & Documentation** | Mendesain antarmuka pengguna (UI) berbasis Tailwind CSS yang konsisten dan responsif, merancang komponen reusable (DataTable, Modal, Sidebar), menyusun design system terpusat, dan menyusun laporan dokumentasi akhir proyek. |
| 5 | **Muh. Rizki Aqil Az-zikra Alimuddin** | 105841109623 | **Security & Access Control** | Merancang sistem autentikasi JWT, mengimplementasikan middleware otorisasi RBAC untuk 7 role pengguna, merancang audit log aktivitas, proteksi data sensitif BK, dan mitigasi risiko keamanan sistem. |

---

## 🗂️ 7 Modul yang Dibangun

| No | Modul | Pengguna Utama | Fitur Unggulan |
|---|---|---|---|
| 1 | **Jurnal Mengajar** | Guru, Wali Kelas, Kepsek | Approval workflow Draft→Submitted→Approved, notifikasi real-time |
| 2 | **Bimbingan Konseling (BK)** | Guru BK, Admin, Kepsek | Kasus + prioritas, catatan konseling, pelanggaran + poin, prestasi |
| 3 | **Data Kesiswaan** | Admin, semua role (read) | CRUD siswa, status aktif/pindah/lulus/keluar, data orang tua |
| 4 | **Akademik & Penjadwalan** | Admin | Tahun ajaran, semester, jadwal per kelas, mata pelajaran |
| 5 | **Absensi** | Guru, Wali Kelas | Absen individual & massal per kelas, 5 kategori status |
| 6 | **Nilai** | Guru, Wali Kelas | Quiz(20%)+Tugas(20%)+UTS(30%)+UAS(30%), kalkulasi otomatis, Grade A-E |
| 7 | **Manajemen Pengguna & Logs** | Admin | CRUD akun, role, reset password, activity logs lengkap |

---

## 💻 Teknologi yang Digunakan

| Layer | Teknologi | Fungsi |
|---|---|---|
| **Frontend** | React.js 18, Vite, Tailwind CSS | UI dinamis, responsif, komponen reusable |
| **Backend** | Node.js 18, Express.js | REST API server, routing, middleware |
| **ORM** | Sequelize | Abstraksi database, relasi tabel, ACID transactions |
| **Database** | MySQL 8.0 | Centralized Database — 16 tabel relasional |
| **Cache** | Redis | In-memory caching data master (kelas, jadwal, mapel) |
| **Auth** | JWT + bcryptjs | Token autentikasi stateless + hashing password |
| **Proxy** | Nginx | Load Balancer & Reverse Proxy |
| **Container** | Docker & Docker Compose | Kontainerisasi seluruh layanan |
| **Version Control** | GitHub | Repositori kode & kolaborasi tim |

---

## 📂 Struktur Folder Proyek

```
MID-SSD-Web-Sekolah/
├── backend/                         # Server Express.js (REST API)
│   ├── src/
│   │   ├── controllers/            # Logika bisnis per modul (14 controller)
│   │   │   ├── authController.js
│   │   │   ├── studentController.js
│   │   │   ├── teacherController.js
│   │   │   ├── journalController.js
│   │   │   ├── bkController.js
│   │   │   ├── gradeController.js
│   │   │   ├── attendanceController.js
│   │   │   ├── scheduleController.js
│   │   │   ├── reportController.js
│   │   │   ├── notificationController.js
│   │   │   └── logController.js
│   │   ├── models/                 # Skema tabel Sequelize (16 model)
│   │   │   ├── User.js
│   │   │   ├── Role.js
│   │   │   ├── Student.js
│   │   │   ├── Teacher.js
│   │   │   ├── Class.js
│   │   │   ├── Subject.js
│   │   │   ├── AcademicYear.js
│   │   │   ├── Semester.js
│   │   │   ├── TeachingJournal.js
│   │   │   ├── BkCase.js
│   │   │   ├── BkCounselingNote.js
│   │   │   ├── StudentViolation.js
│   │   │   ├── StudentAchievement.js
│   │   │   ├── Schedule.js
│   │   │   ├── Attendance.js
│   │   │   ├── Grade.js
│   │   │   ├── ActivityLog.js
│   │   │   ├── Notification.js
│   │   │   └── index.js            # Definisi semua relasi antar-tabel
│   │   ├── routes/                 # Endpoint URL API (14 file route)
│   │   ├── middleware/             # auth.js (JWT), authorize.js (RBAC), validation.js
│   │   └── config/
│   │       ├── database.js         # Koneksi MySQL via Sequelize
│   │       └── runSeed.js          # Skrip seed dummy data lengkap
│   ├── .env.example                # Template konfigurasi (tanpa data sensitif)
│   └── package.json
│
├── frontend/                        # Klien React SPA
│   ├── src/
│   │   ├── components/             # Komponen reusable
│   │   │   ├── Sidebar.jsx         # Navigasi dinamis per role
│   │   │   ├── Header.jsx          # Header + notifikasi + avatar
│   │   │   ├── DataTable.jsx       # Tabel data universal
│   │   │   ├── Modal.jsx           # Dialog modal universal
│   │   │   ├── PageHeader.jsx      # Judul halaman konsisten
│   │   │   ├── StatsRow.jsx        # Baris kartu statistik
│   │   │   ├── NotificationDropdown.jsx
│   │   │   └── ProfileDropdown.jsx
│   │   ├── pages/                  # 15 halaman modul
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx   # Dashboard unik per 7 role
│   │   │   ├── StudentsPage.jsx
│   │   │   ├── TeachersPage.jsx
│   │   │   ├── ClassesPage.jsx
│   │   │   ├── SubjectsPage.jsx
│   │   │   ├── JournalsPage.jsx
│   │   │   ├── BkPage.jsx
│   │   │   ├── AttendancePage.jsx
│   │   │   ├── GradesPage.jsx
│   │   │   ├── SchedulesPage.jsx
│   │   │   ├── UsersPage.jsx
│   │   │   ├── LogsPage.jsx
│   │   │   ├── ProfilePage.jsx     # Profil lengkap Siswa
│   │   │   ├── ChildViewPage.jsx   # Portal Orang Tua
│   │   │   └── AccountPage.jsx     # Edit profil & ganti password
│   │   ├── services/
│   │   │   └── api.js              # Semua fungsi pemanggilan API terpusat
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Manajemen state autentikasi global
│   │   └── config/
│   │       └── design.js           # Design system warna & konstanta UI
│   └── package.json
│
├── docker/
│   └── Dockerfile.backend
├── .env.example
├── .gitignore
└── README.md
```

---

## 🏗️ Rancangan Arsitektur Sistem

```
┌──────────────────────────────────────────────────────────┐
│              PENGGUNA (Browser / Mobile)                  │
│   Admin │ Kepsek │ Guru │ BK │ Wali Kelas │ Siswa │ Ortu  │
└─────────────────────────┬────────────────────────────────┘
                           │ HTTPS Request
                           ▼
┌──────────────────────────────────────────────────────────┐
│             LOAD BALANCER — Nginx (Port 80/443)           │
│          Mendistribusikan request secara merata           │
└──────────┬───────────────────────────────────────────────┘
           │
     ┌─────┴──────┐
     ▼            ▼
┌──────────┐  ┌──────────┐   ← Horizontal Scaling
│ Frontend │  │ Frontend │     (tambah instance saat traffic tinggi)
│ React.js │  │ React.js │
│ Port 3000│  │ Port 3001│
└──────┬───┘  └───┬──────┘
       └──────┬───┘
              │ REST API Call (/api/*)
              ▼
┌──────────────────────────────────────────────────────────┐
│           BACKEND — Express.js API Server (Port 5000)     │
│                    [Modular Monolith]                     │
│                                                           │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌──────────┐  │
│  │ Kesiswaan │ │  Jurnal   │ │    BK     │ │ Absensi  │  │
│  │  Module   │ │  Module   │ │  Module   │ │  Module  │  │
│  ├───────────┤ ├───────────┤ ├───────────┤ ├──────────┤  │
│  │   Nilai   │ │ Akademik  │ │ Pengguna  │ │ Notifik. │  │
│  │  Module   │ │  Module   │ │  Module   │ │  Module  │  │
│  └───────────┘ └───────────┘ └───────────┘ └──────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  MIDDLEWARE: JWT Auth → RBAC Authorize → Validator  │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────┬───────────────────────────────────┘
                       │
           ┌───────────┴───────────┐
           ▼                       ▼
┌─────────────────┐     ┌─────────────────────────────────┐
│  REDIS CACHE    │     │    MYSQL CENTRALIZED DATABASE    │
│  Port 6379      │     │    Port 3306 — school_system     │
│                 │     │                                  │
│ Cache:          │     │  users, roles, students,         │
│ - Daftar kelas  │     │  teachers, classes, subjects,    │
│ - Jadwal        │     │  academic_years, semesters,      │
│ - Mata pelajaran│     │  teaching_journals, bk_cases,    │
│ - Data role     │     │  bk_counseling_notes,            │
│                 │     │  student_violations,             │
│                 │     │  student_achievements,           │
│                 │     │  schedules, attendance,          │
│                 │     │  grades, activity_logs,          │
│                 │     │  notifications                   │
└─────────────────┘     └─────────────────────────────────┘
```

---

## ⚡ Pembagian vCPU / Server Virtual

| vCPU | Layanan | Spesifikasi | Justifikasi Teknis |
|---|---|---|---|
| **vCPU 1** | Modul Jurnal Mengajar & Absensi | 2 Cores, 4GB RAM | Transaksi tulis tinggi setiap hari (absen pagi + jurnal sore). Dipisahkan agar tidak membebani modul lain. |
| **vCPU 2** | Modul BK (Sensitif) | 1 Core, 2GB RAM | Data kasus BK bersifat rahasia. Membutuhkan isolasi jaringan & enkripsi khusus. |
| **vCPU 3** | Modul Kesiswaan & Akademik | 2 Cores, 4GB RAM | Menangani impor/ekspor data massal yang mengonsumsi CPU tinggi. |
| **vCPU 4** | Web Server Frontend React | 2 Cores, 4GB RAM | Melayani aset statis (HTML/JS/CSS) ke ribuan klien via Nginx. |
| **vCPU 5** | Database Server MySQL | 4 Cores, 8GB RAM, SSD | Resource tertinggi untuk mengelola concurrent transactions, InnoDB buffer pool, dan indexing. |
| **vCPU 6** | Load Balancer (Nginx) + Redis Cache | 2 Cores, 4GB RAM | Mendistribusikan request merata + RAM caching mengurangi beban DB hingga 70%. |

---

## 📊 Rancangan Database — 16 Tabel Relasional

```
RELASI UTAMA:

users ──────────────── roles (role_id → FK)
  │
  ├── students ──────── classes (class_id → FK)
  │       │
  │       ├── attendance (student_id → FK)
  │       ├── grades (student_id → FK) ──── subjects (subject_id → FK)
  │       │                           └─── semesters (semester_id → FK)
  │       ├── bk_cases (student_id → FK) ── teachers (counselor_id → FK)
  │       │       └── bk_counseling_notes (case_id → FK)
  │       ├── student_violations (student_id → FK)
  │       └── student_achievements (student_id → FK)
  │
  └── teachers ──────── subjects (subject_id → FK)
          │
          ├── teaching_journals ── classes (class_id → FK)
          │                    └── subjects (subject_id → FK)
          │
          └── schedules ──────── classes (class_id → FK)
                            └── subjects (subject_id → FK)
                            └── semesters (semester_id → FK)

classes ── academic_years (academic_year_id → FK)
         └── teachers (homeroom_teacher_id → FK, as HomeroomTeacher)

activity_logs ── users (user_id → FK)
notifications  ── users (user_id → FK)
```

---

## 🔐 Rancangan Hak Akses Pengguna (RBAC)

| Fitur / Modul | Admin | Kepsek | Guru | Guru BK | Wali Kelas | Siswa | Orang Tua |
|---|---|---|---|---|---|---|---|
| Data Kesiswaan | ✅ CRUD | 👁️ Read | ❌ | 👁️ Read | 👁️ Read | 👤 Diri sendiri | 👶 Anak |
| Jurnal Mengajar | ✅ CRUD | ✅ Approve | ✍️ Input sendiri | ❌ | ✍️ Input sendiri | ❌ | ❌ |
| Kasus BK | ✅ CRUD | 👁️ Read | ❌ | ✅ CRUD | ❌ | ❌ | 👶 Anak |
| Absensi | ✅ CRUD | 👁️ Read | ✍️ Input kelas | ❌ | ✍️ Input kelas | 👤 Diri sendiri | 👶 Anak |
| Nilai | ✅ CRUD | 👁️ Read | ✍️ Input mapel | ❌ | ✍️ Input kelas | 👤 Diri sendiri | 👶 Anak |
| Manajemen User | ✅ CRUD | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Activity Logs | ✅ CRUD | 👁️ Read | ❌ | ❌ | ❌ | ❌ | ❌ |

**Implementasi:** Middleware `authorize()` di Express.js memvalidasi token JWT dan role pengguna sebelum setiap request diproses.

---

## 🌟 Penerapan 10 Unsur Scalable System Design

### 1. Modular Architecture
Kode backend terbagi ke dalam folder `controllers/`, `models/`, dan `routes/` per modul bisnis yang terisolasi. Jika modul Jurnal Mengajar perlu dipisahkan menjadi layanan mandiri di masa depan, cukup ekstrak folder tersebut tanpa merusak modul lain.

### 2. Centralized Database
Satu database `school_system` untuk seluruh 7 modul. Data siswa cukup disimpan sekali di tabel `students`, dan dapat digunakan oleh modul BK, Jurnal, Absensi, Nilai, dan Portal Orang Tua secara langsung.

### 3. Load Balancing
Nginx mendistribusikan request secara merata ke beberapa instance backend Express.js. Ini memastikan tidak ada satu server pun yang kelebihan beban saat peak hours (absensi pagi hari).

### 4. Horizontal Scaling
Backend Express.js bersifat **stateless** (menggunakan JWT, bukan session server). Saat traffic meningkat, instance baru dapat ditambahkan di balik load balancer tanpa konfigurasi ulang kode.

### 5. Vertical Scaling
Server database (vCPU 5) dapat ditingkatkan kapasitas RAM, CPU, dan storage SSD-nya secara independen seiring bertambahnya jumlah data historis nilai, absensi, dan jurnal.

### 6. API-Based Integration
Setiap modul berkomunikasi melalui RESTful JSON API yang terdokumentasi. Modul BK memanggil `/api/students` untuk mendapatkan data siswa. Modul Nilai memanggil `/api/subjects` untuk daftar mata pelajaran.

### 7. Role-Based Access Control (RBAC)
Middleware `authorize(...roles)` di backend memblokir akses berdasarkan role JWT. Data kasus BK sensitif hanya dapat diakses oleh role `Guru BK` dan `Admin`, terlindungi dari akses tidak sah.

### 8. Database Optimization
Index dipasang pada kolom FK penting (`student_id`, `teacher_id`, `class_id`, `subject_id`, `date`). Sequelize eager-loading digunakan untuk menghindari N+1 query problem.

### 9. Caching (Redis)
Data master yang sering diakses (daftar kelas, mata pelajaran, jadwal) disimpan di Redis. Server tidak perlu query ke MySQL berulang kali untuk data yang sama, mengurangi latensi respons hingga 70%.

### 10. Monitoring & Logging
- **Monitoring:** Endpoint `/api/health` memantau status koneksi database secara real-time.
- **Logging:** Tabel `activity_logs` merekam semua aktivitas penting (login, CRUD data, akses BK) lengkap dengan IP address untuk audit forensik keamanan.

---

## 📦 Panduan Instalasi Lengkap

### Prasyarat Sistem
- **Node.js** versi 18 atau lebih tinggi — [Download](https://nodejs.org/)
- **XAMPP** (MySQL) — [Download](https://www.apachefriends.org/)

### Langkah 1 — Setup Database MySQL
```bash
# 1. Buka XAMPP Control Panel
# 2. Klik Start pada MySQL (pastikan berwarna hijau)
# 3. Buka http://localhost/phpmyadmin/
# 4. Buat database baru bernama: school_system
```

### Langkah 2 — Setup Backend
```bash
# Masuk ke folder backend
cd backend

# Install semua dependencies
npm install

# Salin file konfigurasi
cp .env.example .env
# Edit .env jika diperlukan (DB_USER, DB_PASSWORD, dll)

# Buat tabel + isi dummy data (WAJIB dijalankan pertama kali)
node src/config/runSeed.js

# Jalankan server backend
node src/server.js
# → Server running on port 5000
# → Database connected successfully
```

### Langkah 3 — Setup Frontend
```bash
# Masuk ke folder frontend (terminal baru)
cd frontend

# Install semua dependencies
npm install

# Jalankan server frontend
npm run dev
# → VITE ready → Local: http://localhost:3000/
```

### Langkah 4 — Buka Aplikasi
Buka browser dan akses:
```
http://127.0.0.1:3000
```

---

## 🔑 Akun Login Demo

> Semua akun menggunakan password: **`password123`**
> Data yang digunakan adalah **data fiktif/dummy**, bukan data nyata.

| Role | Email | Hak Akses |
|---|---|---|
| **Admin** | `admin@sekolah.test` | Pengelolaan penuh semua modul |
| **Kepala Sekolah** | `kepsek@sekolah.test` | Monitoring, laporan & approval jurnal |
| **Guru** | `guru@sekolah.test` | Jurnal mengajar, absensi & nilai |
| **Guru BK** | `bk@sekolah.test` | Kasus BK, pelanggaran & prestasi |
| **Wali Kelas** | `walikelas@sekolah.test` | Data kelas, absensi & nilai siswa |
| **Siswa** | `siswa@sekolah.test` | Profil, jadwal, absensi & nilai pribadi |
| **Orang Tua** | `ortu@sekolah.test` | Pantau absensi, nilai & perkembangan anak |

---

## 🎥 Video Presentasi YouTube

> Link akan diperbarui setelah video diunggah

👉 **[Tonton Video Presentasi Kelompok Web Sekolah Cendekia](https://youtu.be/)**

---

## 📄 Laporan Proyek

> Link akan diperbarui setelah dokumen diunggah ke Google Drive

https://drive.google.com/file/d/1Rg8oZ1ZvyfLZifCoqX4EMUD-FJ1rhO_D/view?usp=sharing

---

## 🔗 Repository GitHub

👉 **[https://github.com/sarlinda-sopalatu/MID-SSD-Web-Sekolah](https://github.com/sarlinda-sopalatu/MID-SSD-Web-Sekolah)**

---

## ⚠️ Keamanan Repository

Repository ini **tidak mengandung** data sensitif:
- ❌ File `.env` asli tidak diunggah (hanya `.env.example`)
- ❌ Password database asli tidak disertakan
- ❌ Token API tidak diunggah
- ✅ Semua data yang digunakan adalah **data dummy/fiktif**
- ✅ Nama siswa, guru, dan kasus BK adalah karangan/fiktif

---

## 📋 Format Pengumpulan

```
Nama Kelompok  : Web Sekolah Cendekia
Kelas          : TI-4A
Nama Anggota   :
  1. Devi Nirwana              (105841121023) — System Analyst
  2. Alhizra                   (105841101523) — System Architect
  3. Rizki Amalia Rasyid Ridha (105841121223) — Database Designer
  4. Sarlinda Sopalatu         (105841101423) — UI/UX & Documentation
  5. Muh. Rizki Aqil Az-zikra Alimuddin (105841109623) — Security & Access Control

Judul Proyek   : Perancangan dan Pengembangan Web Sekolah Cendekia
                 Terintegrasi Berbasis Scalable System Design
Link YouTube   : [diisi setelah video diupload]
Link GitHub    : https://github.com/sarlinda-sopalatu/MID-SSD-Web-Sekolah
Link Laporan   : [diisi setelah PDF diupload ke Google Drive]
```

---

*© 2025 Kelompok Web Sekolah Cendekia — TI-4A | Mata Kuliah Scalable System Design*
