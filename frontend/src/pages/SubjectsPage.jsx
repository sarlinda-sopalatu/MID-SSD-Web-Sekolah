import React, { useState, useEffect } from 'react';
import { subjectService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { HiOutlineBookOpen, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';

const emptyForm = { code:'', name:'', description:'', grade_level:'' };

const SubjectsPage = () => {
  const { user } = useAuth();
  const canEdit = user?.role === 'Admin';

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch]     = useState('');
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    try { const r = await subjectService.getAll(); setSubjects(r.data); }
    catch { toast.error('Gagal memuat data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) { await subjectService.update(editData.id, form); toast.success('Mata pelajaran diperbarui'); }
      else          { await subjectService.create(form);              toast.success('Mata pelajaran ditambahkan'); }
      setShowForm(false); setEditData(null); setForm(emptyForm); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Gagal menyimpan'); }
  };

  const filtered = subjects.filter(s =>
    !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.code?.toLowerCase().includes(search.toLowerCase())
  );

  // Kelompokkan per tingkat
  const grouped = {};
  filtered.forEach(s => {
    const g = s.grade_level || 'Umum';
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(s);
  });

  const colorPalette = ['bg-blue-500','bg-purple-500','bg-emerald-500','bg-amber-500','bg-pink-500','bg-indigo-500','bg-teal-500','bg-orange-500','bg-rose-500','bg-cyan-500'];

  return (
    <div>
      <PageHeader
        title="Mata Pelajaran"
        subtitle="Kelola daftar mata pelajaran berdasarkan tingkat kelas"
        breadcrumb="Akademik / Kurikulum"
        actions={canEdit && (
          <button onClick={() => { setEditData(null); setForm(emptyForm); setShowForm(true); }} className="btn-primary">
            <HiOutlinePlus size={16}/> Tambah Mapel
          </button>
        )}
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{subjects.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total Mata Pelajaran</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{[...new Set(subjects.map(s=>s.grade_level).filter(Boolean))].length}</p>
          <p className="text-xs text-slate-500 mt-1">Tingkat Kelas</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{subjects.filter(s=>s.grade_level).length}</p>
          <p className="text-xs text-slate-500 mt-1">Sudah Dikategorikan</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-5">
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" placeholder="Cari nama atau kode mapel..." value={search} onChange={e=>setSearch(e.target.value)} className="input-field pl-9 text-sm" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/></div>
      ) : (
        <div className="space-y-6">
          {Object.keys(grouped).sort().map(grade => (
            <div key={grade}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs font-bold">{grade}</div>
                <h3 className="font-semibold text-slate-700">Tingkat {grade}</h3>
                <span className="text-xs text-slate-400">({grouped[grade].length} mapel)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {grouped[grade].map((s, i) => (
                  <div key={s.id} className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl ${colorPalette[i % colorPalette.length]} text-white flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                        {s.code?.slice(0,3) || s.name?.slice(0,2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm">{s.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{s.code} · Tingkat {s.grade_level || '—'}</p>
                        {s.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{s.description}</p>}
                      </div>
                    </div>
                    {canEdit && (
                      <div className="flex gap-1.5 mt-3 pt-3 border-t border-slate-100">
                        <button onClick={() => { setEditData(s); setForm({code:s.code||'', name:s.name, description:s.description||'', grade_level:s.grade_level||''}); setShowForm(true); }}
                          className="flex-1 py-1.5 text-xs font-medium text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors flex items-center justify-center gap-1">
                          <HiOutlinePencil size={13}/> Edit
                        </button>
                        <button onClick={async()=>{if(confirm(`Hapus ${s.name}?`)){await subjectService.delete(s.id);load();toast.success('Dihapus');}}}
                          className="flex-1 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-1">
                          <HiOutlineTrash size={13}/> Hapus
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditData(null); }} title={editData ? `Edit: ${editData.name}` : 'Tambah Mata Pelajaran'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Kode Mapel *</label>
              <input type="text" value={form.code} onChange={e=>setForm({...form,code:e.target.value})} className="input-field" placeholder="MAT-10" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Untuk Tingkat</label>
              <input type="number" value={form.grade_level} onChange={e=>setForm({...form,grade_level:e.target.value})} className="input-field" placeholder="10 / 11 / 12" min={1} max={12} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Nama Mata Pelajaran *</label>
            <input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input-field" placeholder="Matematika Wajib" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Deskripsi</label>
            <textarea rows={2} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="input-field" placeholder="Keterangan singkat mata pelajaran" />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={() => { setShowForm(false); setEditData(null); }} className="btn-secondary">Batal</button>
            <button type="submit" className="btn-primary">{editData ? 'Simpan Perubahan' : 'Tambah Mapel'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubjectsPage;
