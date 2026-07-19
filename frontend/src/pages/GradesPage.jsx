import React, { useState, useEffect } from 'react';
import { gradeService, studentService, subjectService, classService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { HiOutlineChartBar, HiOutlinePlus, HiOutlinePencil, HiOutlineAcademicCap } from 'react-icons/hi';

const gradeColors = { A:'bg-emerald-100 text-emerald-700', B:'bg-blue-100 text-blue-700', C:'bg-amber-100 text-amber-700', D:'bg-orange-100 text-orange-700', E:'bg-red-100 text-red-700' };

const GradesPage = () => {
  const { user } = useAuth();
  const canEdit = ['Admin','Guru','Wali Kelas'].includes(user?.role);
  const isStudent = user?.role === 'Siswa';
  const isParent  = user?.role === 'Orang Tua';

  const [grades,   setGrades]   = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes,  setClasses]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editGrade, setEditGrade] = useState(null);
  const [filterClassId,   setFilterClassId]   = useState('');
  const [filterSubjectId, setFilterSubjectId] = useState('');
  const [form, setForm] = useState({ student_id:'', subject_id:'', semester_id:1, quiz_score:'', assignment_score:'', mid_exam_score:'', final_exam_score:'' });

  useEffect(() => {
    loadGrades();
    classService.getAll().then(r => setClasses(r.data));
    subjectService.getAll().then(r => setSubjects(r.data));
    if (canEdit) studentService.getAll({}).then(r => setStudents(r.data.students || r.data));
  }, [filterClassId, filterSubjectId]);

  const loadGrades = async () => {
    setLoading(true);
    try {
      const r = await gradeService.getAll({ class_id: filterClassId, subject_id: filterSubjectId });
      setGrades(r.data.grades || []);
    } catch { toast.error('Gagal memuat data nilai'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form };
      Object.keys(data).forEach(k => { if (data[k] === '') data[k] = null; });
      if (editGrade) { await gradeService.update(editGrade.id, data); toast.success('Nilai diperbarui'); }
      else           { await gradeService.create(data);                toast.success('Nilai disimpan'); }
      setShowModal(false); setEditGrade(null);
      setForm({ student_id:'', subject_id:'', semester_id:1, quiz_score:'', assignment_score:'', mid_exam_score:'', final_exam_score:'' });
      loadGrades();
    } catch (err) { toast.error(err.response?.data?.message || 'Gagal menyimpan'); }
  };

  const openEdit = (g) => {
    setEditGrade(g);
    setForm({ student_id:g.student_id, subject_id:g.subject_id, semester_id:g.semester_id||1, quiz_score:g.quiz_score??'', assignment_score:g.assignment_score??'', mid_exam_score:g.mid_exam_score??'', final_exam_score:g.final_exam_score??'' });
    setShowModal(true);
  };

  // Summary
  const total = grades.length;
  const avg = total > 0 ? (grades.reduce((s,g) => s + parseFloat(g.final_score||0), 0) / total).toFixed(1) : 0;
  const dist = { A:0, B:0, C:0, D:0, E:0 };
  grades.forEach(g => { if (g.grade_letter && dist[g.grade_letter] !== undefined) dist[g.grade_letter]++; });
  const maxDist = Math.max(...Object.values(dist), 1);

  return (
    <div>
      <PageHeader
        title={isStudent ? 'Nilai Saya' : isParent ? 'Nilai Anak' : 'Manajemen Nilai'}
        subtitle={canEdit ? 'Input dan kelola nilai siswa per mata pelajaran dan semester' : 'Lihat rekap nilai akademik'}
        breadcrumb="Akademik / Penilaian"
        actions={canEdit && (
          <button onClick={() => { setEditGrade(null); setForm({ student_id:'', subject_id:'', semester_id:1, quiz_score:'', assignment_score:'', mid_exam_score:'', final_exam_score:'' }); setShowModal(true); }} className="btn-primary">
            <HiOutlinePlus size={16}/> Input Nilai
          </button>
        )}
      />

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-5">
        <div className="flex flex-wrap gap-3 items-center">
          <select value={filterClassId} onChange={e=>setFilterClassId(e.target.value)} className="input-field w-auto text-sm">
            <option value="">Semua Kelas</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={filterSubjectId} onChange={e=>setFilterSubjectId(e.target.value)} className="input-field w-auto text-sm">
            <option value="">Semua Mata Pelajaran</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          {(filterClassId || filterSubjectId) && <button onClick={() => { setFilterClassId(''); setFilterSubjectId(''); }} className="btn-secondary text-sm">Reset</button>}
          <span className="text-xs text-slate-400 ml-auto">{total} data nilai</span>
        </div>
      </div>

      {/* Summary Cards */}
      {total > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-7 gap-3 mb-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center lg:col-span-2">
            <p className="text-3xl font-bold text-blue-600">{avg}</p>
            <p className="text-xs text-slate-500 mt-1">Rata-rata Nilai</p>
            <p className="text-xs text-slate-400">{total} data</p>
          </div>
          {Object.entries(dist).map(([letter, count]) => (
            <div key={letter} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 text-center">
              <div className="relative h-8 flex items-end justify-center mb-1">
                <div className={`w-full rounded-t ${gradeColors[letter].split(' ')[0]} transition-all`} style={{height: `${Math.max(8, (count/maxDist)*32)}px`}} />
              </div>
              <p className={`text-lg font-bold ${gradeColors[letter].split(' ')[1]}`}>{count}</p>
              <p className="text-xs text-slate-400">Grade {letter}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabel */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/></div>
        ) : grades.length === 0 ? (
          <div className="text-center py-16">
            <HiOutlineAcademicCap size={48} className="mx-auto text-slate-200 mb-3"/>
            <p className="text-slate-400">Belum ada data nilai</p>
            {canEdit && <p className="text-sm text-slate-300 mt-1">Klik "+ Input Nilai" untuk menambahkan</p>}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                {['No','Siswa','Mata Pelajaran','Quiz','Tugas','UTS','UAS','Nilai Akhir','Grade',...(canEdit?['Aksi']:[])].map(h=>(
                  <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {grades.map((g, i) => (
                <tr key={g.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-3 py-3 text-sm text-slate-400">{i+1}</td>
                  <td className="px-3 py-3">
                    <p className="font-medium text-sm text-slate-800">{g.Student?.name}</p>
                    <p className="text-xs text-slate-400">{g.Student?.nis}</p>
                  </td>
                  <td className="px-3 py-3 text-sm text-slate-700">{g.Subject?.name}</td>
                  <td className="px-3 py-3 text-sm text-center font-mono">{g.quiz_score ?? '—'}</td>
                  <td className="px-3 py-3 text-sm text-center font-mono">{g.assignment_score ?? '—'}</td>
                  <td className="px-3 py-3 text-sm text-center font-mono">{g.mid_exam_score ?? '—'}</td>
                  <td className="px-3 py-3 text-sm text-center font-mono">{g.final_exam_score ?? '—'}</td>
                  <td className="px-3 py-3 text-center">
                    <span className="text-sm font-bold text-slate-800">{g.final_score ?? '—'}</span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    {g.grade_letter ? <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${gradeColors[g.grade_letter]}`}>{g.grade_letter}</span> : '—'}
                  </td>
                  {canEdit && (
                    <td className="px-3 py-3">
                      <button onClick={() => openEdit(g)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                        <HiOutlinePencil size={14}/>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Input/Edit */}
      {canEdit && (
        <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditGrade(null); }} title={editGrade ? 'Edit Nilai Siswa' : 'Input Nilai Siswa'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {editGrade ? (
              <div className="bg-blue-50 p-3 rounded-xl text-sm">
                <p className="font-semibold text-slate-700">{editGrade.Student?.name}</p>
                <p className="text-slate-500">{editGrade.Subject?.name}</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Siswa *</label>
                  <select value={form.student_id} onChange={e=>setForm({...form,student_id:e.target.value})} className="input-field" required>
                    <option value="">— Pilih Siswa —</option>
                    {students.map(s=><option key={s.id} value={s.id}>{s.name} — {s.nis}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Mata Pelajaran *</label>
                  <select value={form.subject_id} onChange={e=>setForm({...form,subject_id:e.target.value})} className="input-field" required>
                    <option value="">— Pilih Mata Pelajaran —</option>
                    {subjects.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              {[
                { key:'quiz_score',       label:'Nilai Quiz',    info:'Bobot 20%' },
                { key:'assignment_score', label:'Nilai Tugas',   info:'Bobot 20%' },
                { key:'mid_exam_score',   label:'Nilai UTS',     info:'Bobot 30%' },
                { key:'final_exam_score', label:'Nilai UAS',     info:'Bobot 30%' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-slate-600 mb-1">{f.label} <span className="text-slate-400">({f.info})</span></label>
                  <input type="number" min={0} max={100} value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})} className="input-field" placeholder="0 – 100" />
                </div>
              ))}
            </div>

            {/* Preview nilai akhir */}
            {(form.quiz_score || form.assignment_score || form.mid_exam_score || form.final_exam_score) && (
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                {(() => {
                  const q = parseFloat(form.quiz_score)||0, t = parseFloat(form.assignment_score)||0, uts = parseFloat(form.mid_exam_score)||0, uas = parseFloat(form.final_exam_score)||0;
                  const final = (q*0.2 + t*0.2 + uts*0.3 + uas*0.3).toFixed(1);
                  const letter = final >= 85 ? 'A' : final >= 75 ? 'B' : final >= 65 ? 'C' : final >= 55 ? 'D' : 'E';
                  return (
                    <div className="flex items-center justify-center gap-3">
                      <div><p className="text-xs text-slate-400">Estimasi Nilai Akhir</p><p className="text-2xl font-bold text-slate-800">{final}</p></div>
                      <div><p className="text-xs text-slate-400">Grade</p><span className={`text-2xl font-bold ${gradeColors[letter]?.split(' ')[1]}`}>{letter}</span></div>
                    </div>
                  );
                })()}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => { setShowModal(false); setEditGrade(null); }} className="btn-secondary">Batal</button>
              <button type="submit" className="btn-primary">{editGrade ? 'Simpan Perubahan' : 'Simpan Nilai'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default GradesPage;
