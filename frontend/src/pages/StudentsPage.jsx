import React, { useState, useEffect, useCallback } from 'react';
import { studentService, classService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import StatsRow from '../components/StatsRow';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import {
  HiOutlineUsers, HiOutlineUserAdd, HiOutlineCheckCircle,
  HiOutlineSearch, HiOutlineFilter, HiOutlineEye,
  HiOutlinePencil, HiOutlineTrash, HiOutlineDownload,
  HiOutlineAcademicCap
} from 'react-icons/hi';

const statusColors = { active:'bg-emerald-100 text-emerald-700', transferred:'bg-amber-100 text-amber-700', graduated:'bg-blue-100 text-blue-700', dropped:'bg-red-100 text-red-700' };
const statusLabels = { active:'Aktif', transferred:'Pindah', graduated:'Lulus', dropped:'Keluar' };
const genderLabels = { L:'Laki-laki', P:'Perempuan' };

const emptyForm = { name:'', nis:'', nisn:'', gender:'L', class_id:'', status:'active', birth_date:'', address:'', parent_name:'', parent_phone:'', parent_email:'' };

const StudentsPage = () => {
  const { user } = useAuth();
  const canEdit = user?.role === 'Admin';

  const [students, setStudents] = useState([]);
  const [classes, setClasses]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [pagination, setPagination] = useState({ page:1, total:0, totalPages:1 });

  const [search,    setSearch]    = useState('');
  const [classId,   setClassId]   = useState('');
  const [status,    setStatus]    = useState('');
  const [gender,    setGender]    = useState('');

  const [showForm,   setShowForm]   = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editData,   setEditData]   = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await studentService.getAll({ search, class_id: classId, status, gender, page: pagination.page, limit: 15 });
      setStudents(res.data.students || []);
      setPagination(p => ({ ...p, total: res.data.total || 0, totalPages: res.data.totalPages || 1 }));
    } catch { toast.error('Gagal memuat data siswa'); }
    finally { setLoading(false); }
  }, [search, classId, status, gender, pagination.page]);

  useEffect(() => { loadStudents(); }, [loadStudents]);
  useEffect(() => { classService.getAll().then(r => setClasses(r.data)); }, []);
  useEffect(() => { setPagination(p => ({ ...p, page: 1 })); }, [search, classId, status, gender]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) { await studentService.update(editData.id, form); toast.success('Data siswa diperbarui'); }
      else          { await studentService.create(form);              toast.success('Siswa berhasil ditambahkan'); }
      setShowForm(false); setEditData(null); setForm(emptyForm); loadStudents();
    } catch (err) { toast.error(err.response?.data?.message || 'Gagal menyimpan'); }
  };

  const openEdit = (s) => { setEditData(s); setForm({ name:s.name, nis:s.nis||'', nisn:s.nisn||'', gender:s.gender, class_id:s.class_id||'', status:s.status, birth_date:s.birth_date||'', address:s.address||'', parent_name:s.parent_name||'', parent_phone:s.parent_phone||'', parent_email:s.parent_email||'' }); setShowForm(true); };
  const openDetail = (s) => { setDetailData(s); setShowDetail(true); };

  const handleDelete = async (s) => {
    if (!confirm(`Nonaktifkan ${s.name}?`)) return;
    try { await studentService.delete(s.id); toast.success('Dinonaktifkan'); loadStudents(); }
    catch { toast.error('Gagal'); }
  };

  // Stats
  const totalAktif   = students.filter(s => s.status === 'active').length;
  const totalL       = students.filter(s => s.gender === 'L').length;
  const totalP       = students.filter(s => s.gender === 'P').length;

  const stats = [
    { label:'Total Siswa', value: pagination.total, icon: HiOutlineUsers, color:'bg-blue-500' },
    { label:'Siswa Aktif', value: totalAktif, icon: HiOutlineCheckCircle, color:'bg-emerald-500' },
    { label:'Laki-laki',   value: totalL, icon: HiOutlineAcademicCap, color:'bg-indigo-500' },
    { label:'Perempuan',   value: totalP, icon: HiOutlineAcademicCap, color:'bg-pink-500' },
  ];

  return (
    <div>
      <PageHeader
        title="Data Kesiswaan"
        subtitle="Kelola data siswa, informasi orang tua, dan status keaktifan"
        breadcrumb="Akademik / Kesiswaan"
        actions={canEdit && (
          <button onClick={() => { setEditData(null); setForm(emptyForm); setShowForm(true); }} className="btn-primary">
            <HiOutlineUserAdd size={16} /> Tambah Siswa
          </button>
        )}
      />

      <StatsRow stats={stats} />

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-5">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <HiOutlineSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, NIS, atau NISN..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="input-field pl-9 text-sm"
            />
          </div>
          <select value={classId} onChange={e => setClassId(e.target.value)} className="input-field w-auto text-sm">
            <option value="">Semua Kelas</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)} className="input-field w-auto text-sm">
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="transferred">Pindah</option>
            <option value="graduated">Lulus</option>
            <option value="dropped">Keluar</option>
          </select>
          <select value={gender} onChange={e => setGender(e.target.value)} className="input-field w-auto text-sm">
            <option value="">Semua Gender</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
          {(search || classId || status || gender) && (
            <button onClick={() => { setSearchInput(''); setClassId(''); setStatus(''); setGender(''); }} className="btn-secondary text-sm">
              Reset
            </button>
          )}
          <span className="text-xs text-slate-400 ml-auto">{pagination.total} siswa ditemukan</span>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Memuat data...</p>
            </div>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-20">
            <HiOutlineUsers size={48} className="mx-auto text-slate-200 mb-3" />
            <p className="text-slate-400 font-medium">Tidak ada siswa ditemukan</p>
            <p className="text-slate-300 text-sm mt-1">Coba ubah filter pencarian</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                {['No','NIS','Nama Siswa','Gender','Kelas','Status','Orang Tua','Aksi'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map((s, i) => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-400">{(pagination.page-1)*15+i+1}</td>
                  <td className="px-4 py-3 font-mono text-sm font-medium text-slate-600">{s.nis}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {s.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{s.name}</p>
                        {s.nisn && <p className="text-xs text-slate-400">NISN: {s.nisn}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{genderLabels[s.gender]}</td>
                  <td className="px-4 py-3">
                    {s.Class ? <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium">{s.Class.name}</span> : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[s.status]}`}>{statusLabels[s.status]}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-slate-700">{s.parent_name || '—'}</p>
                    {s.parent_phone && <p className="text-xs text-slate-400">{s.parent_phone}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openDetail(s)} title="Detail" className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <HiOutlineEye size={15} />
                      </button>
                      {canEdit && (
                        <>
                          <button onClick={() => openEdit(s)} title="Edit" className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                            <HiOutlinePencil size={15} />
                          </button>
                          <button onClick={() => handleDelete(s)} title="Nonaktifkan" className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <HiOutlineTrash size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Menampilkan {(pagination.page-1)*15+1}–{Math.min(pagination.page*15, pagination.total)} dari {pagination.total} siswa
            </p>
            <div className="flex gap-1">
              <button onClick={() => setPagination(p=>({...p,page:Math.max(1,p.page-1)}))} disabled={pagination.page===1}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors">
                ← Prev
              </button>
              {Array.from({length: Math.min(5, pagination.totalPages)}, (_,i) => {
                const p = pagination.page <= 3 ? i+1 : pagination.page-2+i;
                if (p < 1 || p > pagination.totalPages) return null;
                return (
                  <button key={p} onClick={() => setPagination(prev=>({...prev,page:p}))}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${p===pagination.page ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 hover:bg-slate-50'}`}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => setPagination(p=>({...p,page:Math.min(p.totalPages,p.page+1)}))} disabled={pagination.page===pagination.totalPages}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors">
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===== MODAL TAMBAH/EDIT ===== */}
      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditData(null); }} title={editData ? `Edit Data: ${editData.name}` : 'Tambah Siswa Baru'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">Nama Lengkap *</label>
              <input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input-field" placeholder="Nama lengkap siswa" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">NIS *</label>
              <input type="text" value={form.nis} onChange={e=>setForm({...form,nis:e.target.value})} className="input-field" placeholder="Nomor Induk Siswa" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">NISN</label>
              <input type="text" value={form.nisn} onChange={e=>setForm({...form,nisn:e.target.value})} className="input-field" placeholder="Nomor Induk Siswa Nasional" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Jenis Kelamin *</label>
              <select value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})} className="input-field">
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Kelas *</label>
              <select value={form.class_id} onChange={e=>setForm({...form,class_id:e.target.value})} className="input-field" required>
                <option value="">— Pilih Kelas —</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Tanggal Lahir</label>
              <input type="date" value={form.birth_date} onChange={e=>setForm({...form,birth_date:e.target.value})} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
              <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="input-field">
                <option value="active">Aktif</option>
                <option value="transferred">Pindah</option>
                <option value="graduated">Lulus</option>
                <option value="dropped">Keluar</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Alamat</label>
            <textarea rows={2} value={form.address} onChange={e=>setForm({...form,address:e.target.value})} className="input-field" placeholder="Alamat lengkap" />
          </div>
          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Informasi Orang Tua / Wali</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-medium text-slate-600 mb-1">Nama Orang Tua / Wali</label>
                <input type="text" value={form.parent_name} onChange={e=>setForm({...form,parent_name:e.target.value})} className="input-field" placeholder="Nama lengkap" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Nomor HP Orang Tua</label>
                <input type="text" value={form.parent_phone} onChange={e=>setForm({...form,parent_phone:e.target.value})} className="input-field" placeholder="08xxxxxxxxxx" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Email Orang Tua <span className="text-blue-500">(untuk akses portal)</span></label>
                <input type="email" value={form.parent_email} onChange={e=>setForm({...form,parent_email:e.target.value})} className="input-field" placeholder="email@contoh.com" />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={() => { setShowForm(false); setEditData(null); }} className="btn-secondary">Batal</button>
            <button type="submit" className="btn-primary">{editData ? 'Simpan Perubahan' : 'Tambah Siswa'}</button>
          </div>
        </form>
      </Modal>

      {/* ===== MODAL DETAIL ===== */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Detail Siswa">
        {detailData && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
              <div className="w-14 h-14 rounded-xl bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow">
                {detailData.name?.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{detailData.name}</h3>
                <p className="text-sm text-slate-500">{detailData.nis} {detailData.nisn ? `· NISN: ${detailData.nisn}` : ''}</p>
                <div className="flex gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[detailData.status]}`}>{statusLabels[detailData.status]}</span>
                  {detailData.Class && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{detailData.Class.name}</span>}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label:'Gender',       value: genderLabels[detailData.gender] },
                { label:'Tanggal Lahir',value: detailData.birth_date || '—' },
                { label:'Alamat',       value: detailData.address || '—' },
                { label:'Email Siswa',  value: detailData.User?.email || '—' },
              ].map((r,i) => (
                <div key={i} className={`${r.label==='Alamat' || r.label==='Email Siswa' ? 'col-span-2' : ''} bg-slate-50 rounded-lg p-3`}>
                  <p className="text-xs text-slate-400">{r.label}</p>
                  <p className="font-medium text-slate-700 mt-0.5">{r.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Orang Tua / Wali</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label:'Nama',  value: detailData.parent_name || '—' },
                  { label:'No. HP',value: detailData.parent_phone || '—' },
                  { label:'Email (Portal Orang Tua)', value: detailData.parent_email || '—' },
                ].map((r,i) => (
                  <div key={i} className={`${r.label.includes('Email') ? 'col-span-2' : ''}`}>
                    <p className="text-xs text-slate-400">{r.label}</p>
                    <p className="font-medium text-slate-700 mt-0.5">{r.value}</p>
                  </div>
                ))}
              </div>
            </div>
            {canEdit && (
              <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                <button onClick={() => { setShowDetail(false); openEdit(detailData); }} className="btn-secondary">
                  <HiOutlinePencil size={14} /> Edit Data
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentsPage;
