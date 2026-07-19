import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { getAvatarClass } from '../config/design';
import toast from 'react-hot-toast';
import {
  HiOutlineUser, HiOutlineShieldCheck, HiOutlineMail, HiOutlinePencil,
} from 'react-icons/hi';

const AccountPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') === 'password' ? 'password' : 'profile');

  const [pf,       setPf]       = useState({ name: '', email: '' });
  const [pw,       setPw]       = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingPf, setSavingPf] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [showPw,   setShowPw]   = useState({ cur: false, new: false, con: false });

  const avatarBg = getAvatarClass(user?.role);

  useEffect(() => {
    if (user) setPf({ name: user.name || '', email: user.email || '' });
  }, [user]);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingPf(true);
    try {
      await authService.updateProfile(pf);
      toast.success('Profil berhasil diperbarui');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal memperbarui profil');
    } finally { setSavingPf(false); }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (pw.newPassword !== pw.confirmPassword) return toast.error('Konfirmasi password tidak cocok');
    if (pw.newPassword.length < 6) return toast.error('Password minimal 6 karakter');
    setSavingPw(true);
    try {
      await authService.changePassword(pw.currentPassword, pw.newPassword);
      toast.success('Password berhasil diubah');
      setPw({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengubah password');
    } finally { setSavingPw(false); }
  };

  const pwNoMatch = pw.confirmPassword.length > 0 && pw.newPassword !== pw.confirmPassword;
  const pwMatch   = pw.confirmPassword.length > 0 && pw.newPassword === pw.confirmPassword;

  const strength      = pw.newPassword.length;
  const strengthLabel = strength === 0 ? '' : strength < 4 ? 'Lemah' : strength < 7 ? 'Cukup' : strength < 10 ? 'Kuat' : 'Sangat Kuat';
  const strengthBars  = [4, 7, 10, 13];

  /* ── Input Password dengan tombol show/hide ── */
  const PwInput = ({ id, label, val, onChange, placeholder, isValid, isInvalid, showKey }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={showPw[showKey] ? 'text' : 'password'}
          value={val}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full border rounded-xl px-4 py-3 pr-28 text-sm focus:outline-none focus:ring-2 transition-all
            ${isInvalid ? 'border-red-300 focus:ring-red-300' : isValid ? 'border-emerald-400 focus:ring-emerald-300' : 'border-slate-200 focus:ring-blue-400 focus:border-blue-400'}`}
          required
        />
        {/* Tombol show/hide — di luar area teks, tidak bertumpuk */}
        <button
          type="button"
          onClick={() => setShowPw(prev => ({ ...prev, [showKey]: !prev[showKey] }))}
          className="absolute right-0 top-0 h-full px-4 text-xs font-semibold text-blue-600 hover:text-blue-800 border-l border-slate-200 rounded-r-xl bg-slate-50 hover:bg-blue-50 transition-colors"
          style={{ minWidth: '90px' }}
        >
          {showPw[showKey] ? 'Sembunyikan' : 'Tampilkan'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto space-y-6">

      {/* ════════════════════════════════════════════
          HERO CARD — Avatar, Nama, Email terpisah rapi
          ════════════════════════════════════════════ */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden">

        {/* Strip biru atas */}
        <div className="h-1.5 bg-blue-600" />

        <div className="p-6">
          {/* Baris 1: Avatar (kiri) + Badge Role (kanan) — terpisah penuh */}
          <div className="flex items-start justify-between mb-5">
            {/* Avatar besar — berdiri sendiri tanpa elemen di sebelahnya */}
            <div
              className={`w-20 h-20 rounded-2xl ${avatarBg} flex items-center justify-center
                          text-white text-4xl font-bold shadow-lg select-none flex-shrink-0`}
            >
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>

            {/* Badge role — pojok kanan atas */}
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${avatarBg} text-white shadow-sm`}>
              {user?.role}
            </span>
          </div>

          {/* Baris 2: Nama (satu baris penuh) */}
          <h2 className="text-xl font-bold text-white leading-snug mb-1">
            {user?.name}
          </h2>

          {/* Baris 3: Email (satu baris penuh, di bawah nama, bukan di sampingnya) */}
          <p className="text-slate-400 text-sm mb-5">
            {user?.email}
          </p>

          {/* Baris 4: Info tambahan — garis pemisah di atas */}
          <div className="border-t border-white/5 pt-4 grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-slate-500">Role</p>
              <p className="text-sm font-medium text-slate-300 mt-0.5">{user?.role}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Status Akun</p>
              <p className="text-sm font-semibold text-emerald-400 mt-0.5">● Aktif</p>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500">ID Pengguna</p>
              <p className="text-sm font-medium text-slate-300 mt-0.5">#{user?.id || '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          PANEL FORM — Tab Edit Profil / Ganti Password
          ════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* Tab selector */}
        <div className="flex border-b border-slate-100">
          {[
            { key: 'profile',  label: 'Edit Profil',    Icon: HiOutlineUser         },
            { key: 'password', label: 'Ganti Password', Icon: HiOutlineShieldCheck  },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors
                ${tab === t.key
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/40'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
            >
              <t.Icon size={16} />
              {t.label}
            </button>
          ))}
        </div>

        {/* ─── TAB: EDIT PROFIL ─── */}
        {tab === 'profile' && (
          <form onSubmit={saveProfile} className="p-6 space-y-5">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <HiOutlineUser size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={pf.name}
                  onChange={e => setPf({ ...pf, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                  placeholder="Nama lengkap Anda"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Alamat Email
              </label>
              <div className="relative">
                <HiOutlineMail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={pf.email}
                  onChange={e => setPf({ ...pf, email: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                  placeholder="email@contoh.com"
                  required
                />
              </div>
            </div>

            {/* Notif role */}
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <HiOutlineShieldCheck size={17} className="text-slate-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-slate-500">
                <strong className="text-slate-700">Role: {user?.role}</strong>
                <p className="mt-0.5 text-xs leading-relaxed">
                  Role tidak dapat diubah sendiri. Hubungi Administrator sistem jika perlu perubahan.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingPf}
                className="btn-primary disabled:opacity-50 px-6"
              >
                {savingPf
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan...</>
                  : <><HiOutlinePencil size={15} /> Simpan Perubahan</>
                }
              </button>
            </div>
          </form>
        )}

        {/* ─── TAB: GANTI PASSWORD ─── */}
        {tab === 'password' && (
          <form onSubmit={savePassword} className="p-6 space-y-5">

            <PwInput
              id="cur"
              label="Password Saat Ini"
              val={pw.currentPassword}
              onChange={e => setPw({ ...pw, currentPassword: e.target.value })}
              placeholder="Masukkan password lama"
              showKey="cur"
            />

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-slate-100" />
              <span className="text-xs text-slate-400">Password Baru</span>
              <div className="flex-1 border-t border-slate-100" />
            </div>

            {/* Password baru */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password Baru</label>
              <div className="relative">
                <input
                  type={showPw.new ? 'text' : 'password'}
                  value={pw.newPassword}
                  onChange={e => setPw({ ...pw, newPassword: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-28 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-0 top-0 h-full px-4 text-xs font-semibold text-blue-600 hover:text-blue-800 border-l border-slate-200 rounded-r-xl bg-slate-50 hover:bg-blue-50 transition-colors"
                  style={{ minWidth: '90px' }}
                >
                  {showPw.new ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>

              {/* Strength bar */}
              {pw.newPassword && (
                <div className="mt-3">
                  <div className="flex gap-1.5 mb-1">
                    {strengthBars.map((threshold, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          strength >= threshold
                            ? i === 0 ? 'bg-red-400' : i === 1 ? 'bg-amber-400' : i === 2 ? 'bg-blue-500' : 'bg-emerald-500'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 text-right">{strengthLabel}</p>
                </div>
              )}
            </div>

            {/* Konfirmasi password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Konfirmasi Password Baru</label>
              <div className="relative">
                <input
                  type={showPw.con ? 'text' : 'password'}
                  value={pw.confirmPassword}
                  onChange={e => setPw({ ...pw, confirmPassword: e.target.value })}
                  placeholder="Ulangi password baru"
                  className={`w-full border rounded-xl px-4 py-3 pr-28 text-sm focus:outline-none focus:ring-2 transition-all
                    ${pwNoMatch ? 'border-red-300 focus:ring-red-300'
                    : pwMatch   ? 'border-emerald-400 focus:ring-emerald-300'
                    : 'border-slate-200 focus:ring-blue-400 focus:border-blue-400'}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(prev => ({ ...prev, con: !prev.con }))}
                  className="absolute right-0 top-0 h-full px-4 text-xs font-semibold text-blue-600 hover:text-blue-800 border-l border-slate-200 rounded-r-xl bg-slate-50 hover:bg-blue-50 transition-colors"
                  style={{ minWidth: '90px' }}
                >
                  {showPw.con ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
              {pwNoMatch && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <span>✕</span> Password tidak cocok
                </p>
              )}
              {pwMatch && (
                <p className="mt-1.5 text-xs text-emerald-600 flex items-center gap-1">
                  <span>✓</span> Password cocok
                </p>
              )}
            </div>

            {/* Peringatan */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700">
              <span className="flex-shrink-0">⚠️</span>
              <span>Setelah password diubah, Anda perlu <strong>login ulang</strong> menggunakan password baru.</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingPw || !!pwNoMatch}
                className="btn-primary disabled:opacity-50 px-6"
              >
                {savingPw
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan...</>
                  : <><HiOutlineShieldCheck size={15} /> Ubah Password</>
                }
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
