import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { HiOutlineUsers, HiOutlineUserAdd, HiOutlinePencil, HiOutlineKey, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';

const roleBadge = {
  'Admin':          'bg-red-100 text-red-700',
  'Kepala Sekolah': 'bg-purple-100 text-purple-700',
  'Guru':           'bg-emerald-100 text-emerald-700',
  'Guru BK':        'bg-pink-100 text-pink-700',
  'Wali Kelas':     'bg-blue-100 text-blue-700',
  'Siswa':          'bg-amber-100 text-amber-700',
  'Orang Tua':      'bg-slate-100 text-slate-700',
};

const avatarColor = {
  'Admin':          'from-red-400 to-red-600',
  'Kepala Sekolah': 'from-purple-400 to-purple-600',
  'Guru':           'from-emerald-400 to-emerald-600',
  'Guru BK':        'from-pink-400 to-pink-600',
  'Wali Kelas':     'from-blue-400 to-blue-600',
  'Siswa':          'from-amber-400 to-amber-600',
  'Orang Tua':      'from-slate-400 to-slate-600',
};

const UsersPage = () => {
  const { user } = useAuth();
  const [users,    setUsers]    = useState([]);
  const [roles,    setRoles]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filterRole,   setFilterRole]   = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [search,       setSearch]       = useState('');
  const [searchInput,  setSearchInput]  = useState('');
  const [form, setForm] = useState({ name:'', email:'', password:'', role_id:'' });

  useEffect(() => { const t = setTimeout(() => setSearch(searchInput), 400); return () => clearTimeout(t); }, [searchInput]);

  const load = async () => {
    setLoading(true);
    try { const r = await userService.getAll(); setUsers(r.data); }
    catch { toast.error('Gagal memuat'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); userService.getRoles().then(r => setRoles(r.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) { await userService.update(editData.id, { name:form.name, email:form.email, role_id:form.role_id }); toast.success('User diperbarui'); }
      else          { await userService.create(form); toast.success('User ditambahkan'); }
      setShowForm(false); setEditData(null); setForm({ name:'', email:'', password:'', role_id:'' }); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Gagal menyimpan'); }
  };

  const handleReset = async (u) => {
    if (!confirm(`Reset password ${u.name} ke "password123"?`)) return;
    try { await userService.resetPassword(u.id); toast.success('Password direset ke password123'); }
    catch { toast.error('Gagal reset'); }
  };

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole   = !filterRole   || u.Role?.name === filterRole;
    const matchStatus = !filterStatus || (filterStatus === 'active' ? u.is_active : !u.is_active);
    return matchSearch && matchRole && matchStatus;
  });

  // Stats per role
  const statsPerRole = roles.map(r => ({ name: r.name, count: users.filter(u => u.role_id === r.id).length }));

  return (
    <div>
      <PageHeader
        title="Manajemen Pengguna"
        subtitle="Kelola akun, role, dan hak akses semua pengguna sistem"
        breadcrumb="Sistem / Pengguna"
        actions={
          <button onClick={() => { setEditData(null); setForm({ name:'', email:'', password:'', role_id:'' }); setShowForm(true); }} className="btn-primary">
            <HiOutlineUserAdd size={16}/> Tambah Pengguna
          </button>
        }
      />

      {/* Stats per Role */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-5">
        {statsPerRole.map(s => (
          <button key={s.name} onClick={() => setFilterRole(filterRole === s.name ? '' : s.name)}
            className={`bg-white rounded-xl border p-3 text-center transition-all cursor-pointer hover:shadow-md ${filterRole === s.name ? 'border-blue-400 shadow-md ring-2 ring-blue-200' : 'border-slate-100'}`}>
            <p className="text-xl font-bold text-slate-800">{s.count}</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-tight">{s.name}</p>
          </button>
        ))}
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-5">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input type="text" placeholder="Cari nama atau email..." value={searchInput} onChange={e=>setSearchInput(e.target.value)} className="input-field pl-9 text-sm" />
          </div>
          <select value={filterRole} onChange={e=>setFilterRole(e.target.value)} className="input-field w-auto text-sm">
            <option value="">Semua Role</option>
            {roles.map(r=><option key={r.id} value={r.name}>{r.name}</option>)}
          </select>
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="input-field w-auto text-sm">
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
          {(search || filterRole || filterStatus) && <button onClick={() => { setSearchInput(''); setFilterRole(''); setFilterStatus(''); }} className="btn-secondary text-sm">Reset</button>}
          <span className="text-xs text-slate-400 ml-auto">{filtered.length} pengguna</span>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <HiOutlineUsers size={48} className="mx-auto text-slate-200 mb-3"/>
            <p className="text-slate-400">Tidak ada pengguna ditemukan</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                {['No','Pengguna','Email','Role','Status','Login Terakhir','Aksi'].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((u, i) => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-400">{i+1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarColor[u.Role?.name] || 'from-slate-400 to-slate-600'} text-white flex items-center justify-center text-sm font-bold shadow-sm`}>
                        {u.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-400">ID #{u.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleBadge[u.Role?.name] || 'bg-slate-100 text-slate-700'}`}>{u.Role?.name || '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${u.is_active ? 'bg-emerald-400' : 'bg-red-400'}`}/>
                      <span className={`text-xs font-medium ${u.is_active ? 'text-emerald-600' : 'text-red-500'}`}>{u.is_active ? 'Aktif' : 'Nonaktif'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {u.last_login ? new Date(u.last_login).toLocaleString('id-ID', {day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setEditData(u); setForm({name:u.name,email:u.email,password:'',role_id:u.role_id}); setShowForm(true); }}
                        title="Edit" className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                        <HiOutlinePencil size={14}/>
                      </button>
                      <button onClick={() => handleReset(u)} title="Reset Password"
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <HiOutlineKey size={14}/>
                      </button>
                      {u.id !== user?.id && (
                        <button onClick={async()=>{if(confirm(`Nonaktifkan ${u.name}?`)){await userService.delete(u.id);load();toast.success('Dinonaktifkan');}}}
                          title="Nonaktifkan" className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <HiOutlineTrash size={14}/>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditData(null); }} title={editData ? `Edit: ${editData.name}` : 'Tambah Pengguna Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Nama Lengkap *</label>
            <input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input-field" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Email *</label>
            <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="input-field" required />
          </div>
          {!editData && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Password * <span className="text-slate-400">(minimal 6 karakter)</span></label>
              <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="input-field" required minLength={6} />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Role *</label>
            <select value={form.role_id} onChange={e=>setForm({...form,role_id:e.target.value})} className="input-field" required>
              <option value="">— Pilih Role —</option>
              {roles.map(r=><option key={r.id} value={r.id}>{r.name} — {r.description || r.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={() => { setShowForm(false); setEditData(null); }} className="btn-secondary">Batal</button>
            <button type="submit" className="btn-primary">{editData ? 'Simpan Perubahan' : 'Tambah Pengguna'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsersPage;
