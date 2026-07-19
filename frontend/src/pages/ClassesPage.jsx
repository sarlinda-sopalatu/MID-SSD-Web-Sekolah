import React, { useState, useEffect } from 'react';
import { classService, teacherService, studentService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { HiOutlineUserGroup, HiOutlinePlus, HiOutlineUsers, HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';

const emptyForm = { name:'', grade_level:'', capacity:36, homeroom_teacher_id:'' };

const ClassesPage = () => {
  const { user } = useAuth();
  const canEdit = user?.role === 'Admin';

  const [classes,  setClasses]  = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editData, setEditData]   = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [classSiswa, setClassSiswa] = useState([]);
  const [loadSiswa, setLoadSiswa]   = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    try { const r = await classService.getAll(); setClasses(r.data); }
    catch { toast.error('Gagal memuat data kelas'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    load();
    teacherService.getAll().then(r => setTeachers(r.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) { await classService.update(editData.id, form); toast.success('Kelas diperbarui'); }
      else          { await classService.create(form);              toast.success('Kelas ditambahkan'); }
      setShowForm(false); setEditData(null); setForm(emptyForm); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Gagal menyimpan'); }
  };

  const openDetail = async (c) => {
    setDetailData(c); setShowDetail(true);
    setLoadSiswa(true);
    try {
      const r = await studentService.getAll({ class_id: c.id, limit: 100 });
      setClassSiswa(r.data.students || []);
    } catch { setClassSiswa([]); }
    finally { setLoadSiswa(false); }
  };

  const gradeGroups = {};
  classes.forEach(c => {
    const g = c.grade_level || 'Lain';
    if (!gradeGroups[g]) gradeGroups[g] = [];
    gradeGroups[g].push(c);
  });

  return (
    <div>
      <PageHeader
        title="Data Kelas"
        subtitle="Kelola daftar kelas, tingkat, kapasitas, dan penugasan wali kelas"
        breadcrumb="Akademik / Kelas"
        actions={canEdit && (
          <button onClick={() => { setEditData(null); setForm(emptyForm); setShowForm(true); }} className="btn-primary">
            <HiOutlinePlus size={16} /> Tambah Kelas
          </button>
        )}
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{classes.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total Kelas</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{[...new Set(classes.map(c=>c.grade_level))].length}</p>
          <p className="text-xs text-slate-500 mt-1">Tingkat / Angkatan</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{classes.filter(c=>c.homeroom_teacher_id).length}</p>
          <p className="text-xs text-slate-500 mt-1">Sudah Ada Wali Kelas</p>
        </div>
      </div>

      {/* Kelas per Tingkat */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/></div>
      ) : (
        <div className="space-y-6">
          {Object.keys(gradeGroups).sort().map(grade => (
            <div key={grade}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm font-bold">{grade}</div>
                <h3 className="font-semibold text-slate-700">Tingkat {grade}</h3>
                <span className="text-xs text-slate-400">({gradeGroups[grade].length} kelas)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gradeGroups[grade].map(c => (
                  <div key={c.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                          <HiOutlineUserGroup size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{c.name}</p>
                          <p className="text-xs text-slate-400">Tingkat {c.grade_level} · Kapasitas {c.capacity}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-3">
                      <HiOutlineUsers size={13}/>
                      Wali Kelas: <span className="font-medium text-slate-700">{c.HomeroomTeacher?.name || <span className="text-red-400">Belum ditentukan</span>}</span>
                    </div>
                    <div className="flex gap-1.5 pt-3 border-t border-slate-100">
                      <button onClick={() => openDetail(c)} className="flex-1 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1">
                        <HiOutlineEye size={13}/> Lihat Siswa
                      </button>
                      {canEdit && (
                        <>
                          <button onClick={() => { setEditData(c); setForm({name:c.name, grade_level:c.grade_level, capacity:c.capacity, homeroom_teacher_id:c.homeroom_teacher_id||''}); setShowForm(true); }}
                            className="flex-1 py-1.5 text-xs font-medium text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors flex items-center justify-center gap-1">
                            <HiOutlinePencil size={13}/> Edit
                          </button>
                          <button onClick={async()=>{if(confirm(`Hapus kelas ${c.name}?`)){await classService.delete(c.id);load();toast.success('Dihapus');}}}
                            className="flex-1 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-1">
                            <HiOutlineTrash size={13}/> Hapus
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditData(null); }} title={editData ? `Edit Kelas: ${editData.name}` : 'Tambah Kelas Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Nama Kelas * <span className="text-slate-400">(contoh: X-A, XI-IPA-1)</span></label>
            <input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input-field" required placeholder="X-A" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Tingkat * <span className="text-slate-400">(10/11/12)</span></label>
              <input type="number" value={form.grade_level} onChange={e=>setForm({...form,grade_level:e.target.value})} className="input-field" required placeholder="10" min={1} max={12} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Kapasitas</label>
              <input type="number" value={form.capacity} onChange={e=>setForm({...form,capacity:e.target.value})} className="input-field" min={1} max={50} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Wali Kelas</label>
            <select value={form.homeroom_teacher_id} onChange={e=>setForm({...form,homeroom_teacher_id:e.target.value})} className="input-field">
              <option value="">— Pilih Wali Kelas —</option>
              {teachers.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={() => { setShowForm(false); setEditData(null); }} className="btn-secondary">Batal</button>
            <button type="submit" className="btn-primary">{editData ? 'Simpan Perubahan' : 'Tambah Kelas'}</button>
          </div>
        </form>
      </Modal>

      {/* Modal Detail Siswa */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title={`Daftar Siswa — ${detailData?.name}`} size="lg">
        {detailData && (
          <div>
            <div className="flex gap-4 mb-4 p-3 bg-blue-50 rounded-xl text-sm">
              <div><p className="text-xs text-slate-400">Wali Kelas</p><p className="font-semibold">{detailData.HomeroomTeacher?.name || '—'}</p></div>
              <div><p className="text-xs text-slate-400">Kapasitas</p><p className="font-semibold">{detailData.capacity} siswa</p></div>
              <div><p className="text-xs text-slate-400">Terdaftar</p><p className="font-semibold">{classSiswa.length} siswa</p></div>
            </div>
            {loadSiswa ? (
              <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/></div>
            ) : classSiswa.length === 0 ? (
              <p className="text-center text-slate-400 py-8">Tidak ada siswa di kelas ini</p>
            ) : (
              <div className="space-y-1.5 max-h-80 overflow-y-auto">
                {classSiswa.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50">
                    <span className="text-xs text-slate-400 w-6 text-right">{i+1}</span>
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">{s.name?.charAt(0)}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{s.name}</p>
                      <p className="text-xs text-slate-400">{s.nis}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.gender==='L' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                      {s.gender==='L' ? 'L' : 'P'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ClassesPage;
