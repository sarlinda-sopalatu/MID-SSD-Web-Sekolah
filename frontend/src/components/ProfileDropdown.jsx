import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAvatarClass } from '../config/design';
import { HiOutlineUser, HiOutlineCog, HiOutlineLogout, HiOutlineKey, HiChevronDown } from 'react-icons/hi';

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const avatarBg = getAvatarClass(user?.role);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
      >
        <div className={`w-7 h-7 rounded-lg ${avatarBg} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.name}</p>
          <p className="text-xs text-slate-400 leading-tight">{user?.role}</p>
        </div>
        <HiChevronDown size={13} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
          {/* Info */}
          <div className="px-4 py-3 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${avatarBg} flex items-center justify-center text-white text-base font-bold shadow-sm`}>
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-slate-800 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${avatarBg} text-white`}>{user?.role}</span>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="py-1.5">
            {[
              { icon: HiOutlineUser, label: 'Edit Profil',     path: '/account' },
              { icon: HiOutlineKey,  label: 'Ganti Password',  path: '/account?tab=password' },
              ...(user?.role === 'Admin' ? [{ icon: HiOutlineCog, label: 'Manajemen Pengguna', path: '/users' }] : []),
            ].map(item => (
              <button
                key={item.path}
                onClick={() => { setOpen(false); navigate(item.path); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <item.icon size={16} className="text-slate-400 flex-shrink-0" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-slate-50 py-1.5">
            <button
              onClick={() => { setOpen(false); logout(); navigate('/login'); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <HiOutlineLogout size={16} className="flex-shrink-0" />
              Keluar / Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
