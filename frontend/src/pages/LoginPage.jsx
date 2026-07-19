import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SCHOOL } from '../config/design';
import toast from 'react-hot-toast';

const demos = [
  { label: 'Admin',          email: 'admin@sekolah.test',     desc: 'Akses penuh sistem'        },
  { label: 'Kepala Sekolah', email: 'kepsek@sekolah.test',    desc: 'Monitoring & laporan'      },
  { label: 'Guru',           email: 'guru@sekolah.test',      desc: 'Jurnal & nilai'            },
  { label: 'Guru BK',        email: 'bk@sekolah.test',        desc: 'Bimbingan konseling'       },
  { label: 'Wali Kelas',     email: 'walikelas@sekolah.test', desc: 'Data kelas & siswa'        },
  { label: 'Siswa',          email: 'siswa@sekolah.test',     desc: 'Nilai & jadwal'            },
  { label: 'Orang Tua',      email: 'ortu@sekolah.test',      desc: 'Pantau perkembangan anak'  },
];

const LoginPage = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
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

  return (
    <div className="min-h-screen flex bg-slate-900">
      {/* ─── KIRI: Branding ─────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between flex-1 p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-slate-900/0 pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-base leading-tight">{SCHOOL.name}</p>
            <p className="text-slate-400 text-xs">{SCHOOL.tagline}</p>
          </div>
        </div>

        {/* Center content */}
        <div className="relative">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Satu Platform,<br />
            <span className="text-blue-400">Semua Kebutuhan</span><br />
            Sekolah
          </h1>
          <p className="text-slate-400 text-base mb-10 leading-relaxed max-w-sm">
            Kelola data siswa, jurnal mengajar, nilai, absensi, dan bimbingan konseling dalam satu sistem terintegrasi.
          </p>
          <div className="grid grid-cols-2 gap-3 max-w-sm">
            {[
              { icon: '📋', text: 'Jurnal Mengajar Digital'   },
              { icon: '📊', text: 'Monitoring Nilai & Absensi'},
              { icon: '💬', text: 'Bimbingan Konseling'        },
              { icon: '👨‍👩‍👧', text: 'Portal Orang Tua'         },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2.5 bg-white/5 border border-white/5 rounded-xl p-3">
                <span className="text-lg">{f.icon}</span>
                <span className="text-slate-300 text-xs font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-slate-600 text-xs relative">© {SCHOOL.year} {SCHOOL.name}</p>
      </div>

      {/* ─── KANAN: Form Login ──────────────────────────── */}
      <div className="flex-1 lg:max-w-[420px] flex flex-col justify-center p-8 bg-slate-50">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z"/>
            </svg>
          </div>
          <p className="text-slate-800 font-bold">{SCHOOL.name}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Masuk ke Sistem</h2>
          <p className="text-slate-500 text-sm">Gunakan akun yang diberikan oleh administrator</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-field bg-white"
              placeholder="nama@sekolah.test"
              required autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field bg-white pr-20"
                placeholder="Masukkan password"
                required
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-600 hover:text-blue-800 font-medium">
                {showPw ? 'Sembunyikan' : 'Tampilkan'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-sm shadow-blue-200 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memproses...
              </span>
            ) : 'Masuk ke Sistem'}
          </button>
        </form>

        {/* Demo accounts */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-slate-200" />
            <p className="text-xs text-slate-400 font-medium">Akun Demo</p>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <p className="text-xs text-slate-400 text-center mb-3">Password semua akun: <strong className="text-slate-600">password123</strong></p>
          <div className="grid grid-cols-2 gap-1.5">
            {demos.map(d => (
              <button
                key={d.email}
                onClick={() => { setEmail(d.email); setPassword('password123'); }}
                className="text-left p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
              >
                <p className="text-xs font-semibold text-slate-700 group-hover:text-blue-700">{d.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{d.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
