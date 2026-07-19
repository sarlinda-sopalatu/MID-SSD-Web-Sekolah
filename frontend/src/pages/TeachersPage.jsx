import React, { useState, useEffect } from 'react';
import { teacherService, subjectService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import StatsRow from '../components/StatsRow';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { HiOutlineAcademicCap, HiOutlineUserAdd, HiOutlineEye, HiOutlinePencil, HiOutlineTrash, HiOutlinePhone, HiOutlineIdentification, HiOutlineUsers } from 'react-icons/hi';

const emptyForm = { name:'', nip:'', gender:'L', phone:'', address:'', subject_id:'' };

const TeachersPage = () => {
  const { user } = useAuth();
  const canEdit = user?.role === 'Admin';

  const [teachers, setTeachers]   = useState([]);
  const [subjects, setSubjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showForm, setShowForm]   = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editData, setEditData]   = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { const t = setTimeout(() => setSearch(searchInput), 400); return () => clearTimeout(t); }, [searchInput]);

  const load = async () => {
    setLoading(true);
    try { const r = await teacherService.getAll(); setTeachers(r.data); }
    catch { toast.error('Gagal memuat data guru'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); subjectService.getAll().then(r => setSubjects(r.data)); }, []);

  const filtered = teachers.filter(t =>
    !search || t.name?.toLowerCase().includes(search.toLowerCase()) || t.nip?.includes(search)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) { await teacherService.update(editData.id, form); toast.success('Data guru diperbarui'); }
      else          { await teacherService.create(form);              toast.success('Guru berhasil ditambahkan'); }
      setShowForm(false); setEditData(null); setForm(emptyForm); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Gagal menyimpan'); }
  };

  const openEdit   = (t) => { setEditData(t); setForm({ name:t.name, nip:t.nip||'', gender:t.gender||'L', phone:t.phone||'', address:t.address||'', subject_id:t.subject_id||'' }); setShowForm(true); };
  const openDetail = (t) => { setDetailData(t); setShowDetail(true); };

  const stats = [
    { label:'Total Guru', value: teachers.length, icon: HiOutlineAcademicCap, color:'bg-blue-500' },
    { label:'Laki-laki',  value: teachers.filter(t=>t.gender==='L').length, icon: HiOutlineUsers, color:'bg-indigo-500' },
    { label:'Perempuan',  value: teachers.filter(t=>t.gender==='P').length, icon: HiOutlineUsers, color:'bg-pink-500' },
    { label:'Wali Kelas', value: teachers.filter(t=>t.HomeroomClasses?.length>0).length, icon: HiOutlineIdentification, color:'bg-emerald-500' },
  ];

  return (
    <div>
      <PageHeader
        title="Data Guru"
        subtitle="Kelola data tenaga pengajar dan informasi kepegawaian"
        breadcrumb="Akademik / Guru"
        actions={canEdit && (
          <button onClick={() => { setEditData(null); setForm(emptyForm); setShowForm(true); }} className="btn-primary">
            <HiOutlineUserAdd size={16} /> Tambah Guru
          </button>
        )}
      />

      <StatsRow stats={stats} />

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-5">
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" placeholder="Cari nama atau NIP..." value={searchInput} onChange={e=>setSearchInput(e.target.value)} className="input-field pl-9 text-sm" />
        </div>
      </div>

      {/* Grid Cards */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
          <HiOutlineAcademicCap size={48} className="mx-auto text-slate-200 mb-3"/>
          <p className="text-slate-400">Tidak ada guru ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(t => (
            <div key={t.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-sm ${t.gender==='P' ? 'bg-gradient-to-br from-pink-400 to-pink-600' : 'bg-gradient-to-br from-blue-500 to-blue-700'}`}>
                  {t.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 leading-tight">{t.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{t.nip || 'NIP belum diisi'}</p>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.gender==='L' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                      {t.gender==='L' ? 'Laki-laki' : 'Perempuan'}
                    </span>
                    {t.Subject && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">{t.Subject.name}</span>}
                  </div>
                </div>
              </div>
              {t.phone && (
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-50 text-xs text-slate-500">
                  <HiOutlinePhone size={13}/> {t.phone}
                </div>
              )}
              <div className="flex gap-1.5 mt-3 pt-3 border-t border-slate-100">
                <button onClick={() => openDetail(t)} className="flex-1 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1">
                  <HiOutlineEye size={13}/> Detail
                </button>
                {canEdit && (
                  <>
                    <button onClick={() => openEdit(t)} className="flex-1 py-1.5 text-xs font-medium text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors flex items-center justify-center gap-1">
                      <HiOutlinePencil size={13}/> Edit
                    </button>
                    <button onClick={async()=>{if(confirm(`Hapus ${t.name}?`)){await teacherService.delete(t.id);load();toast.success('Dihapus');}}} className="flex-1 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-1">
                      <HiOutlineTrash size={13}/> Hapus
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditData(null); }} title={editData ? `Edit: ${editData.name}` : 'Tambah Guru Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Nama Lengkap *</label>
            <input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input-field" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">NIP</label>
              <input type="text" value={form.nip} onChange={e=>setForm({...form,nip:e.target.value})} className="input-field" placeholder="Nomor Induk Pegawai" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Jenis Kelamin</label>
              <select value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})} className="input-field">
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">No. Telepon</label>
              <input type="text" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Mata Pelajaran Utama</label>
              <select value={form.subject_id} onChange={e=>setForm({...form,subject_id:e.target.value})} className="input-field">
                <option value="">— Pilih Mapel —</option>
                {subjects.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Alamat</label>
            <textarea rows={2} value={form.address} onChange={e=>setForm({...form,address:e.target.value})} className="input-field" />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={() => { setShowForm(false); setEditData(null); }} className="btn-secondary">Batal</button>
            <button type="submit" className="btn-primary">{editData ? 'Simpan Perubahan' : 'Tambah Guru'}</button>
          </div>
        </form>
      </Modal>

      {/* Modal Detail */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Detail Guru">
        {detailData && (
          <div className="space-y-4">
            <div className={`flex items-center gap-4 p-4 rounded-xl ${detailData.gender==='P' ? 'bg-pink-50' : 'bg-blue-50'}`}>
              <div className={`w-16 h-16 rounded-xl text-white text-2xl font-bold flex items-center justify-center shadow ${detailData.gender==='P' ? 'bg-gradient-to-br from-pink-400 to-pink-600' : 'bg-gradient-to-br from-blue-500 to-blue-700'}`}>
                {detailData.name?.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{detailData.name}</h3>
                <p className="text-sm text-slate-500">{detailData.nip || 'NIP belum diisi'}</p>
                {detailData.Subject && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 mt-1 inline-block">{detailData.Subject.name}</span>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                {label:'Gender', value: detailData.gender==='L'?'Laki-laki':'Perempuan'},
                {label:'No. HP', value: detailData.phone||'—'},
                {label:'Alamat', value: detailData.address||'—'},
              ].map((r,i)=>(
                <div key={i} className={`bg-slate-50 rounded-lg p-3 ${r.label==='Alamat'?'col-span-2':''}`}>
                  <p className="text-xs text-slate-400">{r.label}</p>
                  <p className="font-medium text-slate-700 mt-0.5">{r.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TeachersPage;
