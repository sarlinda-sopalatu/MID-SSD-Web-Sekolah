import React from 'react';
import { useLocation } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import { SCHOOL } from '../config/design';

const pageTitles = {
  '/dashboard':  'Dashboard',
  '/students':   'Data Kesiswaan',
  '/teachers':   'Data Guru',
  '/classes':    'Kelas',
  '/subjects':   'Mata Pelajaran',
  '/schedules':  'Jadwal Pelajaran',
  '/journals':   'Jurnal Mengajar',
  '/bk':         'Bimbingan Konseling',
  '/attendance': 'Absensi',
  '/grades':     'Nilai',
  '/users':      'Manajemen Pengguna',
  '/logs':       'Activity Logs',
  '/profile':    'Profil Saya',
  '/child':      'Pemantauan Anak',
  '/account':    'Pengaturan Akun',
};

const Header = () => {
  const location  = useLocation();
  const pageTitle = pageTitles[location.pathname] || '';

  return (
    <header className="bg-white border-b border-slate-100 h-14 px-6 flex items-center justify-between flex-shrink-0">
      {/* Kiri */}
      <div>
        <p className="text-sm font-semibold text-slate-800 leading-tight">{pageTitle}</p>
        <p className="text-xs text-slate-400">{SCHOOL.name}</p>
      </div>
      {/* Kanan */}
      <div className="flex items-center gap-1">
        <NotificationDropdown />
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Header;
