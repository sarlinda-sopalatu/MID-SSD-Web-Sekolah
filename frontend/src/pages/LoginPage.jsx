import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SCHOOL } from '../config/design';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineChevronDown, HiOutlineShieldCheck, HiOutlineAcademicCap } from 'react-icons/hi';
import toast from 'react-hot-toast';

const demos = [
  { label: 'Admin Utama',      email: 'admin@sekolah.test',     desc: 'Akses penuh seluruh modul sistem' },
  { label: 'Kepala Sekolah',   email: 'kepsek@sekolah.test',    desc: 'Monitoring laporan, audit log & approval' },
  { label: 'Guru Akademik',    email: 'guru@sekolah.test',      desc: 'Manajemen kelas, jurnal & nilai siswa' },
  { label: 'Guru Konseling BK',email: 'bk@sekolah.test',        desc: 'Pencatatan kasus, sanksi & prestasi' },
  { label: 'Wali Kelas',       email: 'walikelas@sekolah.test', desc: 'Kontrol kelas bimbingan & absensi' },
  { label: 'Siswa',            email: 'siswa@sekolah.test',     desc: 'Akses jadwal, absensi harian & rapor' },
  { label: 'Orang Tua / Wali', email: 'ortu@sekolah.test',      desc: 'Pantau perkembangan nilai & pelanggaran anak' },
];

const LoginPage = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [showDemo, setShowDemo] = useState(false); // Collapsible accordion untuk menyembunyikan demo
  
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login berhasil!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email atau password salah');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    toast.success('Akun demo berhasil dimuat!');
  };

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans">
      
      {/* ─── KIRI: BRANDING & DETAIL SEKOLAH (Mesh Gradient & Stats) ─── */}
      <div className="hidden lg:flex flex-col justify-between flex-1 p-12 relative overflow-hidden select-none">
        
        {/* Desain latar belakang yang menawan & modern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 via-slate-950 to-slate-900" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />

        {/* Logo Sekolah */}
        <div className="flex items-center gap-3.5 relative">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-base leading-tight tracking-wide">{SCHOOL.name}</p>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">{SCHOOL.tagline}</p>
          </div>
        </div>

        {/* Fitur & Stat */}
        <div className="relative space-y-8 my-auto">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
              <HiOutlineAcademicCap size={12} /> Akreditasi A Unggul
            </div>
            <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
              Sistem Portal<br />
              <span className="text-blue-500 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Akademik Modern</span><br />
              &amp; Terintegrasi.
            </h1>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed max-w-sm font-medium">
              Akses cepat dan aman untuk manajemen Kesiswaan, Jurnal Mengajar, Bimbingan Konseling (BK), Presensi harian, dan Nilai Rapor dalam satu sistem terpusat.
            </p>
          </div>

          {/* Grid fitur dengan ikon yang bersih */}
          <div className="grid grid-cols-2 gap-3 max-w-md">
            {[
              { icon: '📝', title: 'Jurnal & Absensi', desc: 'Pencatatan kelas instan' },
              { icon: '🛡️', title: 'Akses Aman RBAC', desc: 'Enkripsi data & log' },
              { icon: '🤝', title: 'Layanan BK Terpadu', desc: 'Konseling & prestasi' },
              { icon: '👨‍👩‍👧', title: 'Portal Orang Tua', desc: 'Pantau nilai & kehadiran' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-2xl p-3 hover:bg-white/[0.05] transition-all">
                <span className="text-xl bg-slate-900 p-1.5 rounded-lg">{f.icon}</span>
                <div className="min-w-0">
                  <p className="text-white text-xs font-bold truncate">{f.title}</p>
                  <p className="text-slate-500 text-[10px] truncate">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-slate-500 text-xs relative">
          <p>© {SCHOOL.year} {SCHOOL.name}</p>
          <p className="font-medium">Scalable System Design</p>
        </div>
      </div>

      {/* ─── KANAN: FORM LOGIN BERSIH & PROFESIONAL ─── */}
      <div className="flex-1 lg:max-w-[430px] flex flex-col justify-center p-8 bg-slate-50 relative">
        
        {/* Mobile View Header Logo */}
        <div className="lg:hidden flex items-center gap-3 mb-10 select-none">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z"/>
            </svg>
          </div>
          <div>
            <p className="text-slate-800 font-bold text-sm leading-none">{SCHOOL.name}</p>
            <p className="text-slate-400 text-[10px] mt-0.5">{SCHOOL.tagline}</p>
          </div>
        </div>

        <div className="mb-6 select-none">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Portal Masuk</h2>
          <p className="text-slate-500 text-xs mt-1 font-medium">Gunakan email dan kata sandi institusi Anda</p>
        </div>

        {/* Form Utama */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Email</label>
            <div className="relative">
              <HiOutlineMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                placeholder="nama@sekolah.test"
                required autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Kata Sandi</label>
            <div className="relative">
              <HiOutlineLockClosed size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-slate-200 rounded-xl pl-10 pr-24 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                placeholder="Masukkan kata sandi"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-0 top-0 h-full px-3 text-xs font-bold text-blue-600 hover:text-blue-800 bg-slate-50 hover:bg-blue-50 rounded-r-xl border-l border-slate-200 transition-colors"
                style={{ minWidth: '80px' }}
              >
                {showPw ? 'Sembunyikan' : 'Tampilkan'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-md shadow-blue-100 mt-2 flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memproses...
              </span>
            ) : 'Masuk ke Portal'}
          </button>
        </form>

        {/* ── Collapsible Accordion: Akun Uji Coba (Demo) ── */}
        {/* Tidak menampilkan email atau password asli di depannya, melainkan hanya role */}
        <div className="mt-6 border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => setShowDemo(!showDemo)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-700 font-semibold text-xs uppercase tracking-wider"
          >
            <span className="flex items-center gap-2 text-slate-700">
              🔑 Akses Akun Uji Coba (Demo)
            </span>
            <HiChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${showDemo ? 'rotate-180' : ''}`} />
          </button>

          {showDemo && (
            <div className="p-3 border-t border-slate-150 bg-white max-h-56 overflow-y-auto space-y-1 divide-y divide-slate-50">
              {demos.map(d => (
                <button
                  key={d.email}
                  onClick={() => handleDemoClick(d.email)}
                  className="w-full text-left py-2 px-2.5 rounded-lg hover:bg-blue-50/50 hover:text-blue-700 transition-all flex items-center justify-between group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-700 group-hover:text-blue-800 flex items-center gap-1.5">
                      {d.label}
                    </p>
                    <p className="text-[10px] text-slate-400 group-hover:text-blue-600 mt-0.5 truncate">{d.desc}</p>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-500 font-medium px-2 py-0.5 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600 flex-shrink-0 transition-colors">
                    Pilih Akun
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-center text-slate-400 text-[10px] mt-6 select-none">
          © 2025 {SCHOOL.name} · Hak Cipta Dilindungi.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
