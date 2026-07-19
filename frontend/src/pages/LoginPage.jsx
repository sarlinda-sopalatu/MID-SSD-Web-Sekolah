import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SCHOOL } from '../config/design';
import toast from 'react-hot-toast';

const demos = [
  { label: 'Admin Utama',      email: 'admin@sekolah.test',     desc: 'Akses penuh seluruh konfigurasi & logs' },
  { label: 'Kepala Sekolah',   email: 'kepsek@sekolah.test',    desc: 'Monitoring jurnal, BK, nilai & laporan' },
  { label: 'Guru Akademik',    email: 'guru@sekolah.test',      desc: 'Kelola jadwal, jurnal mengajar & nilai' },
  { label: 'Guru Konseling BK',email: 'bk@sekolah.test',        desc: 'Bimbingan konseling, sanksi & prestasi' },
  { label: 'Wali Kelas',       email: 'walikelas@sekolah.test', desc: 'Kontrol kelas bimbingan, absensi & siswa' },
  { label: 'Siswa',            email: 'siswa@sekolah.test',     desc: 'Akses profil, jadwal, absensi & rapor' },
  { label: 'Orang Tua / Wali', email: 'ortu@sekolah.test',      desc: 'Pantau rekap absensi, sanksi & nilai anak' },
];

const LoginPage = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [showDemo, setShowDemo] = useState(false); // Dropdown tertutup rapi secara default
  
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

  // UX Premium: Klik akun demo -> Otomatis isi & otomatis langsung masuk (one-click login)
  const handleDemoClick = async (demoEmail) => {
    setLoading(true);
    try {
      await login(demoEmail, 'password123');
      toast.success('Masuk sebagai akun demo!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Gagal memproses login demo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans">
      
      {/* ─── KIRI: LANDING BRANDING (WSC) ─── */}
      <div className="hidden lg:flex flex-col justify-between flex-1 p-12 relative overflow-hidden select-none">
        
        {/* Background Mesh Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 via-slate-950 to-slate-900" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />

        {/* Header Logo */}
        <div className="flex items-center gap-3.5 relative z-10">
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

        {/* Center Content */}
        <div className="relative z-10 space-y-8 my-auto">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
              {/* Native SVG: Shield Check */}
              <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Akreditasi A Unggul
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

          {/* Grid Features */}
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
        <div className="flex items-center justify-between text-slate-500 text-xs relative z-10">
          <p>© {SCHOOL.year} {SCHOOL.name}</p>
          <p className="font-medium">Scalable System Design</p>
        </div>
      </div>

      {/* ─── KANAN: FORM LOGIN BERSIH & FORM MODERN ─── */}
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
          <p className="text-slate-500 text-xs mt-1 font-medium">Silakan masuk menggunakan akun resmi Anda</p>
        </div>

        {/* Form Utama */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Email</label>
            <div className="relative">
              {/* Native SVG: Mail */}
              <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                placeholder="nama@sekolah.test"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Kata Sandi</label>
            <div className="relative">
              {/* Native SVG: Lock */}
              <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
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
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-md shadow-blue-100 mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                {/* Native SVG: Login/Arrow */}
                <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" width={18}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Masuk ke Portal
              </>
            )}
          </button>
        </form>

        {/* ─── Collapsible Accordion: AKSES CEPAT (AKUN DEMO) ─── */}
        <div className="mt-6 border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => setShowDemo(!showDemo)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-700 font-bold text-xs uppercase tracking-wider"
          >
            <span className="flex items-center gap-2 text-slate-700">
              🔑 Gunakan Akun Demo Uji Coba
            </span>
            {/* Native SVG: Chevron Down */}
            <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showDemo ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDemo && (
            <div className="p-3 border-t border-slate-100 bg-white max-h-56 overflow-y-auto space-y-1 divide-y divide-slate-50">
              {demos.map(d => (
                <button
                  key={d.email}
                  disabled={loading}
                  onClick={() => handleDemoClick(d.email)}
                  className="w-full text-left py-2 px-2.5 rounded-lg hover:bg-blue-50/50 hover:text-blue-700 transition-all flex items-center justify-between group disabled:opacity-55"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="text-xs font-bold text-slate-700 group-hover:text-blue-800 flex items-center gap-1.5">
                      {d.label}
                    </p>
                    <p className="text-[10px] text-slate-400 group-hover:text-blue-600 mt-0.5 truncate">{d.desc}</p>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-500 font-medium px-2.5 py-1 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600 flex-shrink-0 transition-colors">
                    Masuk Instan →
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
