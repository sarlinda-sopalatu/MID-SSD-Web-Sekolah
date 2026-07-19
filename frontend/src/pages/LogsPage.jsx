import React, { useState, useEffect } from 'react';
import { logService } from '../services/api';
import PageHeader from '../components/PageHeader';
import toast from 'react-hot-toast';

const actionColors = {
  login: 'bg-green-100 text-green-800',
  logout: 'bg-gray-100 text-gray-800',
  create: 'bg-blue-100 text-blue-800',
  update: 'bg-yellow-100 text-yellow-800',
  delete: 'bg-red-100 text-red-800',
};

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState({ module: '', action: '' });

  useEffect(() => { loadLogs(); }, [page, filter]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await logService.getAll({ page, limit: 30, ...filter });
      setLogs(res.data.logs || []);
      setTotal(res.data.total || 0);
    } catch (error) { toast.error('Gagal memuat log'); }
    finally { setLoading(false); }
  };

  const modules = ['auth', 'students', 'teachers', 'grades', 'attendance', 'journals', 'bk', 'users', 'classes', 'subjects', 'schedules'];
  const actions = ['login', 'logout', 'create', 'update', 'delete'];

  return (
    <div>
      <PageHeader title="Activity Logs" subtitle="Rekam jejak seluruh aktivitas pengguna dalam sistem" breadcrumb="Sistem / Logs" />

      {/* Filter */}
      <div className="card mb-4">
        <div className="flex flex-wrap gap-4">
          <select value={filter.module} onChange={e => { setFilter({ ...filter, module: e.target.value }); setPage(1); }} className="input-field max-w-xs">
            <option value="">Semua Modul</option>
            {modules.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={filter.action} onChange={e => { setFilter({ ...filter, action: e.target.value }); setPage(1); }} className="input-field max-w-xs">
            <option value="">Semua Aksi</option>
            {actions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <button onClick={() => { setFilter({ module: '', action: '' }); setPage(1); }} className="btn-secondary">Reset</button>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['No', 'Waktu', 'User', 'Role', 'Aksi', 'Modul', 'Deskripsi', 'IP'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {logs.map((log, i) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-400">{(page - 1) * 30 + i + 1}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{new Date(log.createdAt).toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3 text-sm font-medium">{log.User?.name || '-'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{log.User?.Role?.name || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${actionColors[log.action] || 'bg-gray-100 text-gray-800'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{log.module}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{log.description}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{log.ip_address}</td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-8 text-gray-400">Tidak ada log.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 px-4 py-3 border-t">
          <p className="text-sm text-gray-500">Total: <strong>{total}</strong> log</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary text-sm disabled:opacity-40">← Prev</button>
            <span className="py-2 px-3 text-sm text-gray-600">Hal. {page} / {Math.ceil(total / 30) || 1}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={logs.length < 30} className="btn-secondary text-sm disabled:opacity-40">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsPage;
