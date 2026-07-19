import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SCHOOL } from '../config/design';
import {
  HiOutlineHome, HiOutlineUsers, HiOutlineAcademicCap, HiOutlineBookOpen,
  HiOutlineClipboardList, HiOutlineHeart, HiOutlineCalendar, HiOutlineUserGroup,
  HiOutlineChartBar, HiOutlineDocumentText, HiOutlineCog, HiOutlineLogout,
  HiOutlineEye, HiOutlineUserCircle, HiOutlineChevronLeft, HiOutlineMenuAlt3,
} from 'react-icons/hi';

const allMenus = [
  { path:'/dashboard',  label:'Dashboard',           icon:HiOutlineHome,          roles:['Admin','Kepala Sekolah','Guru','Guru BK','Wali Kelas','Siswa','Orang Tua'] },
  // Admin
  { path:'/students',   label:'Data Kesiswaan',       icon:HiOutlineUsers,         roles:['Admin'] },
  { path:'/teachers',   label:'Data Guru',            icon:HiOutlineAcademicCap,   roles:['Admin'] },
  { path:'/classes',    label:'Kelas',                icon:HiOutlineUserGroup,     roles:['Admin'] },
  { path:'/subjects',   label:'Mata Pelajaran',       icon:HiOutlineBookOpen,      roles:['Admin'] },
  { path:'/schedules',  label:'Jadwal Pelajaran',     icon:HiOutlineCalendar,      roles:['Admin'] },
  { path:'/journals',   label:'Jurnal Mengajar',      icon:HiOutlineClipboardList, roles:['Admin'] },
  { path:'/bk',         label:'Bimbingan Konseling',  icon:HiOutlineHeart,         roles:['Admin'] },
  { path:'/attendance', label:'Absensi',              icon:HiOutlineEye,           roles:['Admin'] },
  { path:'/grades',     label:'Nilai',                icon:HiOutlineChartBar,      roles:['Admin'] },
  { path:'/users',      label:'Manajemen Pengguna',   icon:HiOutlineCog,           roles:['Admin'] },
  { path:'/logs',       label:'Activity Logs',        icon:HiOutlineDocumentText,  roles:['Admin'] },
  // Kepala Sekolah
  { path:'/students',   label:'Data Kesiswaan',       icon:HiOutlineUsers,         roles:['Kepala Sekolah'] },
  { path:'/teachers',   label:'Data Guru',            icon:HiOutlineAcademicCap,   roles:['Kepala Sekolah'] },
  { path:'/classes',    label:'Kelas',                icon:HiOutlineUserGroup,     roles:['Kepala Sekolah'] },
  { path:'/subjects',   label:'Mata Pelajaran',       icon:HiOutlineBookOpen,      roles:['Kepala Sekolah'] },
  { path:'/journals',   label:'Jurnal Mengajar',      icon:HiOutlineClipboardList, roles:['Kepala Sekolah'] },
  { path:'/bk',         label:'Bimbingan Konseling',  icon:HiOutlineHeart,         roles:['Kepala Sekolah'] },
  { path:'/attendance', label:'Absensi',              icon:HiOutlineEye,           roles:['Kepala Sekolah'] },
  { path:'/grades',     label:'Nilai',                icon:HiOutlineChartBar,      roles:['Kepala Sekolah'] },
  { path:'/logs',       label:'Activity Logs',        icon:HiOutlineDocumentText,  roles:['Kepala Sekolah'] },
  // Guru
  { path:'/schedules',  label:'Jadwal Saya',          icon:HiOutlineCalendar,      roles:['Guru'] },
  { path:'/journals',   label:'Jurnal Mengajar',      icon:HiOutlineClipboardList, roles:['Guru'] },
  { path:'/attendance', label:'Absensi',              icon:HiOutlineEye,           roles:['Guru'] },
  { path:'/grades',     label:'Input Nilai',          icon:HiOutlineChartBar,      roles:['Guru'] },
  // Guru BK
  { path:'/students',   label:'Data Siswa',           icon:HiOutlineUsers,         roles:['Guru BK'] },
  { path:'/bk',         label:'Bimbingan Konseling',  icon:HiOutlineHeart,         roles:['Guru BK'] },
  // Wali Kelas
  { path:'/students',   label:'Data Siswa Kelas',     icon:HiOutlineUsers,         roles:['Wali Kelas'] },
  { path:'/schedules',  label:'Jadwal Saya',          icon:HiOutlineCalendar,      roles:['Wali Kelas'] },
  { path:'/journals',   label:'Jurnal Mengajar',      icon:HiOutlineClipboardList, roles:['Wali Kelas'] },
  { path:'/attendance', label:'Absensi Kelas',        icon:HiOutlineEye,           roles:['Wali Kelas'] },
  { path:'/grades',     label:'Nilai Siswa',          icon:HiOutlineChartBar,      roles:['Wali Kelas'] },
  // Siswa
  { path:'/profile',    label:'Profil Saya',          icon:HiOutlineUserCircle,    roles:['Siswa'] },
  { path:'/schedules',  label:'Jadwal Pelajaran',     icon:HiOutlineCalendar,      roles:['Siswa'] },
  { path:'/grades',     label:'Nilai Saya',           icon:HiOutlineChartBar,      roles:['Siswa'] },
  { path:'/attendance', label:'Absensi Saya',         icon:HiOutlineEye,           roles:['Siswa'] },
  // Orang Tua
  { path:'/child',      label:'Pemantauan Anak',      icon:HiOutlineEye,           roles:['Orang Tua'] },
];

const Sidebar = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const menus     = allMenus.filter(m => m.roles.includes(user?.role));

  return (
    <div
      className="flex flex-col flex-shrink-0 transition-all duration-300 select-none"
      style={{ width: collapsed ? 64 : 240, background: '#0f172a', minHeight: '100vh' }}
    >
      {/* ── LOGO ── */}
      <div className={`flex items-center border-b border-white/5 ${collapsed ? 'justify-center py-4 px-2 h-14' : 'gap-2.5 px-4 h-14'}`}>
        {/* Ikon */}
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-white" fill="currentColor" width={18}>
            <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
          </svg>
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm leading-tight truncate">{SCHOOL.name}</p>
            <p className="text-slate-400 text-xs truncate">{SCHOOL.tagline}</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
        >
          {collapsed ? <HiOutlineMenuAlt3 size={17} /> : <HiOutlineChevronLeft size={17} />}
        </button>
      </div>

      {/* ── MENU ── */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        {menus.map((item, idx) => {
          const active = location.pathname === item.path;
          return (
            <NavLink
              key={`${item.path}-${idx}`}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={() =>
                `flex items-center mx-2 my-0.5 rounded-lg transition-all duration-150 text-sm
                 ${collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'}
                 ${active
                   ? 'bg-blue-600 text-white font-medium shadow-sm'
                   : 'text-slate-400 hover:text-white hover:bg-white/8'
                 }`
              }
            >
              <item.icon size={17} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && active && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full opacity-70" />}
            </NavLink>
          );
        })}
      </nav>

      {/* ── USER + LOGOUT ── */}
      <div className="border-t border-white/5 p-3">
        {!collapsed && (
          <div
            onClick={() => navigate('/account')}
            className="flex items-center gap-2.5 mb-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate leading-tight">{user?.name}</p>
              <p className="text-slate-500 text-xs truncate">{user?.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className={`flex items-center gap-2.5 text-slate-500 hover:text-white hover:bg-white/8 rounded-lg transition-all px-3 py-2 w-full text-sm`}
          title="Keluar"
        >
          <HiOutlineLogout size={17} className="flex-shrink-0" />
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
