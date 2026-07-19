/**
 * DESIGN SYSTEM — Web Sekolah Cendekia
 * Satu sumber kebenaran untuk seluruh warna, nama, dan konstanta UI.
 * Import dari file ini di semua komponen.
 */

// ─── IDENTITAS SEKOLAH ───────────────────────────────────────────
export const SCHOOL = {
  name:      'Web Sekolah Cendekia',
  shortName: 'WSC',
  tagline:   'Sistem Informasi Sekolah Terintegrasi',
  year:      '2025',
};

// ─── WARNA PRIMER (satu palet biru-indigo) ───────────────────────
// Semua elemen UI menggunakan palet ini. TIDAK ada pink/merah/ungu campur.
export const COLOR = {
  // Background sidebar & header aksen
  sidebar: 'from-slate-900 to-slate-800',

  // Tombol utama
  primary:       'bg-blue-600 hover:bg-blue-700 text-white',
  primaryBorder: 'border-blue-600 text-blue-600 hover:bg-blue-50',

  // Badge role — satu warna berdasarkan tone, bukan warna warni
  roleBadge: {
    'Admin':          { bg: 'bg-slate-800',  text: 'text-white'       },
    'Kepala Sekolah': { bg: 'bg-slate-700',  text: 'text-white'       },
    'Guru':           { bg: 'bg-blue-600',   text: 'text-white'       },
    'Guru BK':        { bg: 'bg-blue-500',   text: 'text-white'       },
    'Wali Kelas':     { bg: 'bg-blue-400',   text: 'text-white'       },
    'Siswa':          { bg: 'bg-slate-500',  text: 'text-white'       },
    'Orang Tua':      { bg: 'bg-slate-400',  text: 'text-white'       },
  },

  // Avatar inisial — gradient biru semua
  avatar: {
    'Admin':          'bg-slate-800',
    'Kepala Sekolah': 'bg-slate-700',
    'Guru':           'bg-blue-600',
    'Guru BK':        'bg-blue-500',
    'Wali Kelas':     'bg-blue-400',
    'Siswa':          'bg-slate-500',
    'Orang Tua':      'bg-slate-400',
  },

  // Status kehadiran
  attendance: {
    present: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-400' },
    absent:  { bg: 'bg-red-100',     text: 'text-red-700',     dot: 'bg-red-400'     },
    late:    { bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-400'   },
    sick:    { bg: 'bg-blue-100',    text: 'text-blue-700',    dot: 'bg-blue-400'    },
    excused: { bg: 'bg-slate-100',   text: 'text-slate-600',   dot: 'bg-slate-400'   },
  },

  // Grade nilai
  grade: {
    A: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    B: { bg: 'bg-blue-100',    text: 'text-blue-700'    },
    C: { bg: 'bg-amber-100',   text: 'text-amber-700'   },
    D: { bg: 'bg-orange-100',  text: 'text-orange-700'  },
    E: { bg: 'bg-red-100',     text: 'text-red-700'     },
  },

  // Status kasus BK
  caseStatus: {
    open:        { bg: 'bg-amber-100',   text: 'text-amber-700'  },
    in_progress: { bg: 'bg-blue-100',    text: 'text-blue-700'   },
    resolved:    { bg: 'bg-emerald-100', text: 'text-emerald-700'},
    closed:      { bg: 'bg-slate-100',   text: 'text-slate-600'  },
  },

  // Status jurnal
  journalStatus: {
    draft:     { bg: 'bg-slate-100',   text: 'text-slate-600'  },
    submitted: { bg: 'bg-amber-100',   text: 'text-amber-700'  },
    approved:  { bg: 'bg-emerald-100', text: 'text-emerald-700'},
  },
};

// ─── LABEL ───────────────────────────────────────────────────────
export const LABEL = {
  attendance: { present:'Hadir', absent:'Tidak Hadir', late:'Terlambat', sick:'Sakit', excused:'Izin' },
  grade:      { A:'Sangat Baik', B:'Baik', C:'Cukup', D:'Kurang', E:'Sangat Kurang' },
  gender:     { L:'Laki-laki', P:'Perempuan' },
  status:     { active:'Aktif', transferred:'Pindah', graduated:'Lulus', dropped:'Keluar' },
  dayName:    { monday:'Senin', tuesday:'Selasa', wednesday:'Rabu', thursday:'Kamis', friday:'Jumat', saturday:'Sabtu' },
};

// ─── HELPER ──────────────────────────────────────────────────────
export const getRoleBadgeClass = (role) => {
  const c = COLOR.roleBadge[role] || { bg:'bg-slate-500', text:'text-white' };
  return `${c.bg} ${c.text}`;
};

export const getAvatarClass = (role) => COLOR.avatar[role] || 'bg-blue-600';
