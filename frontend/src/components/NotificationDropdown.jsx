import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineBell, HiOutlineCheck, HiOutlineCheckCircle } from 'react-icons/hi';
import api from '../services/api';
import toast from 'react-hot-toast';

const typeColors = {
  info: 'bg-blue-100 text-blue-600',
  success: 'bg-green-100 text-green-600',
  warning: 'bg-yellow-100 text-yellow-600',
  error: 'bg-red-100 text-red-600',
};

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef(null);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || []);
      setUnread(res.data.unreadCount || 0);
    } catch {}
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000); // polling tiap 30 detik
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markRead = async (notif) => {
    if (!notif.is_read) {
      await api.put(`/notifications/${notif.id}/read`);
      load();
    }
    if (notif.link) { setOpen(false); navigate(notif.link); }
  };

  const markAllRead = async () => {
    await api.put('/notifications/read-all/mark');
    toast.success('Semua notifikasi ditandai dibaca');
    load();
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'baru saja';
    if (m < 60) return `${m} mnt lalu`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} jam lalu`;
    return `${Math.floor(h / 24)} hari lalu`;
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <HiOutlineBell size={22} className="text-gray-600" />
        {unread > 0 && (
          <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold text-gray-800">Notifikasi</h3>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs text-primary-600 hover:underline flex items-center gap-1">
                <HiOutlineCheck size={14} /> Tandai semua dibaca
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-10">
                <HiOutlineBell size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-400 text-sm">Tidak ada notifikasi</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markRead(n)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-50 transition-colors ${!n.is_read ? 'bg-blue-50/50' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${typeColors[n.type]}`}>
                    <HiOutlineBell size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${!n.is_read ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.is_read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t text-center">
              <button onClick={() => setOpen(false)} className="text-xs text-gray-400 hover:text-gray-600">Tutup</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
