# Web Sekolah Terintegrasi - Scalable System Design

## Deskripsi Sistem
Sistem web sekolah terintegrasi yang dibangun dengan arsitektur modular menggunakan Node.js, Express.js, React, dan MySQL. Sistem ini terdiri dari 7 modul utama yang saling terhubung dan menggunakan satu database terpusat.

## Anggota Kelompok

| Nama | NIM | Peran | Tanggung Jawab |
|------|-----|-------|----------------|
| [Nama Anggota 1] | [NIM] | System Analyst / Project Lead | Analisis kebutuhan, perencanaan proyek, dokumentasi |
| [Nama Anggota 2] | [NIM] | System Architect | Arsitektur sistem, pembagian vCPU, strategi skalabilitas |
| [Nama Anggota 3] | [NIM] | Database Designer | Rancangan database, ERD, optimasi query |
| [Nama Anggota 4] | [NIM] | UI/UX & Documentation | Desain antarmuka, dokumentasi, README |
| [Nama Anggota 5] | [NIM] | Security & Access Control | Keamanan sistem, RBAC, audit log |

## Daftar Modul

### Modul Wajib
1. **Modul Jurnal Mengajar** - Pencatatan aktivitas pembelajaran guru
2. **Modul BK (Bimbingan Konseling)** - Pengelolaan data konseling, pelanggaran, prestasi siswa
3. **Modul Data Kesiswaan** - Pengelolaan data utama siswa dan kelas
4. **Modul Manajemen Pengguna** - Pengelolaan akun dan hak akses

### Modul Tambahan
5. **Modul Akademik** - Pengelolaan mata pelajaran dan kurikulum
6. **Modul Absensi** - Pencatatan kehadiran siswa dan guru
7. **Modul Nilai** - Pengelolaan nilai dan rapor siswa

## Teknologi yang Digunakan

### Frontend
- React.js 18
- Tailwind CSS
- Axios (HTTP Client)
- React Router DOM
- Chart.js (Visualisasi Data)

### Backend
- Node.js 18+
- Express.js
- JWT (JSON Web Token) untuk autentikasi
- bcrypt untuk enkripsi password
- Sequelize ORM

### Database
- MySQL 8.0
- Redis (Caching)

### Tools Pendukung
- Nginx (Reverse Proxy & Load Balancer)
- Docker & Docker Compose
- GitHub (Version Control)
- Draw.io / Lucidchart (Diagram)

## Struktur Folder

```
MID-SSD-Web-Sekolah/
├── frontend/                    # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Komponen reusable
│   │   ├── pages/             # Halaman aplikasi
│   │   ├── services/          # API calls
│   │   ├── context/           # State management
│   │   ├── utils/             # Helper functions
│   │   └── App.jsx
│   └── package.json
├── backend/                     # Express Backend
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── middleware/        # Authentication & validation
│   │   ├── services/         # Business logic
│   │   ├── config/           # Database & app config
│   │   └── utils/            # Helper functions
│   └── package.json
├── database/
│   ├── migrations/            # Database migrations
│   ├── seeders/              # Dummy data
│   └── erd.png               # ERD diagram
├── docs/
│   ├── architecture.md       # Dokumentasi arsitektur
│   ├── api.md               # API documentation
│   ├── database.md          # Database design
│   └── scalability.md       # Scalability design
├── docker/
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
├── diagrams/
│   ├── architecture.png
│   ├── erd.png
│   └── use-case.png
├── .env.example
├── .gitignore
└── README.md
```

## Rancangan Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                    LOAD BALANCER (Nginx)                         │
│                         Port 80/443                              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     REACT FRONTEND                              │
│                    Port 3000 (Dev)                               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   EXPRESS API SERVER                             │
│                    Port 5000                                     │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐     │
│  │ Journal  │    BK    │ Student  │   User   │ Academic │     │
│  │ Module   │  Module  │  Module  │  Module  │  Module  │     │
│  ├──────────┼──────────┼──────────┼──────────┼──────────┤     │
│  │Attendance│  Grades  │ Schedule │ Library  │ Reports  │     │
│  │  Module  │  Module  │  Module  │  Module  │  Module  │     │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      REDIS CACHE                                │
│                    Port 6379                                     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MySQL DATABASE                               │
│                    Port 3306                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  users, roles, students, teachers, classes, subjects,   │   │
│  │  academic_years, semesters, teaching_journals,          │   │
│  │  bk_cases, bk_counseling_notes, student_violations,    │   │
│  │  student_achievements, schedules, attendance, grades,   │   │
│  │  activity_logs                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Pembagian vCPU / Server Virtual

| vCPU | Layanan | Alasan |
|------|---------|--------|
| vCPU 1 | Nginx Load Balancer | Distribusi traffic, SSL termination |
| vCPU 2 | React Frontend | Serving static files, SPA |
| vCPU 3 | Express API Server (Main) | Auth, User Management, Student Data |
| vCPU 4 | Express API Server (Modules) | Journal, BK, Academic, Attendance, Grades |
| vCPU 5 | MySQL Database Server | Centralized data storage |
| vCPU 6 | Redis Cache + Monitoring | Caching, logging, monitoring |

## Rancangan Database (ERD)

### Relasi Utama

```
users ──┬── roles (role_id)
        │
students ──┬── classes (class_id)
           │
teachers ──┬── subjects (subject_id)
           │
teaching_journals ──┬── teachers (teacher_id)
                    ├── classes (class_id)
                    └── subjects (subject_id)

bk_cases ──┬── students (student_id)
           └── teachers (counselor_id)

bk_counseling_notes ──┬── students (student_id)
                      └── teachers (counselor_id)

student_violations ──┬── students (student_id)
                     └── teachers (reported_by)

student_achievements ──┬── students (student_id)
                       └── teachers (awarded_by)

schedules ──┬── teachers (teacher_id)
            ├── classes (class_id)
            └── subjects (subject_id)

attendance ──┬── students (student_id)
             └── schedules (schedule_id)

grades ──┬── students (student_id)
         ├── subjects (subject_id)
         └── teachers (teacher_id)

activity_logs ── users (user_id)
```

## Rancangan Hak Akses Pengguna (RBAC)

| Role | Akses |
|------|-------|
| Admin | Full access ke semua modul |
| Kepala Sekolah | Lihat semua laporan, rekap data |
| Guru | Isi jurnal mengajar, lihat jadwal |
| Guru BK | Kelola data BK, lihat data siswa |
| Wali Kelas | Lihat data siswa di kelasnya |
| Siswa | Lihat data diri, jadwal, nilai |
| Orang Tua | Lihat perkembangan anak |

## Cara Instalasi

### Prasyarat
- Node.js 18+
- MySQL 8.0
- Redis
- npm atau yarn

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env dengan konfigurasi database
npm run migrate
npm run seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Docker (Opsional)
```bash
docker-compose up -d
```

## Akun Login Demo

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@sekolah.test | password123 |
| Guru | guru@sekolah.test | password123 |
| Guru BK | bk@sekolah.test | password123 |
| Kepala Sekolah | kepsek@sekolah.test | password123 |
| Siswa | siswa@sekolah.test | password123 |
| Orang Tua | ortu@sekolah.test | password123 |

## Video Presentasi
Link YouTube: [Link Video]

## Unsur Scalable System Design

1. **Modular Architecture** - Sistem dibagi menjadi 7 modul independen
2. **Centralized Database** - Satu database MySQL untuk semua modul
3. **Load Balancing** - Nginx untuk distribusi traffic
4. **Horizontal Scaling** - Dapat menambah server API baru
5. **Vertical Scaling** - Dapat meningkatkan kapasitas server
6. **API-Based Integration** - Modul berkomunikasi via REST API
7. **Role-Based Access Control** - Hak akses berdasarkan role
8. **Database Optimization** - Indexing, query optimization
9. **Caching** - Redis untuk data yang sering diakses
10. **Monitoring & Logging** - Aktivitas sistem tercatat"# MID-SSD-Web-Sekolah" 
