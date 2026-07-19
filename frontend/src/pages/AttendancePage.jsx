import React, { useState, useEffect } from 'react';
import { attendanceService, studentService, classService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { HiOutlineEye, HiOutlinePlus, HiOutlineUserGroup, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineClock } from 'react-icons/hi';

const statusColors = { present:'bg-emerald-100 text-emerald-700', absent:'bg-red-100 text-red-700', late:'bg-amber-100 text-amber-700', sick:'bg-blue-100 text-blue-700', excused:'bg-purple-100 text-purple-700' };
const statusLabels = { present:'Hadir', absent:'Tidak Hadir', late:'Terlambat', sick:'Sakit', excused:'Izin' };

const today = () => new Date().toISOString().split('T')[0];

const AttendancePage = () => {
  const { user } = useAuth();
  const canEdit  = ['Admin','Guru','Wali Kelas'].includes(user?.role);
  const isStudent = user?.role === 'Siswa';
  const isParent  = user?.role === 'Orang Tua';

  const [attendance,  setAttendance]  = useState([]);
  const [students,    setStudents]    = useState([]);
  const [classes,     setClasses]     = useState([]);
  const [loading,     setLoading]     = useState(true);

  const [filterDate,    setFilterDate]    = useState(today());
  const [filterClassId, setFilterClassId] = useState('');

  const [showSingle,  setShowSingle]  = useState(false);
  const [showBulk,    setShowBulk]    = useState(false);
  const [bulkDate,    setBulkDate]    = useState(today());
  const [bulkClassId, setBulkClassId] = useState('');
  const [bulkRows,    setBulkRows]    = useState([]);
  const [loadingBulk, setLoadingBulk] = useState(false);
  const [singleForm,  setSingleForm]  = useState({ student_id:'', date:today(), status:'present', notes:'' });

  useEffect(() => { loadAttendance(); }, [filterDate, filterClassId]);
  useEffect(() => {
    if (!isStudent && !isParent) {
      classService.getAll().then(r => setClasses(r.data));
      studentService.getAll({}).then(r => setStudents(r.data.students || r.data));
    }
  }, []);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const r = await attendanceService.getAll({ date: filterDate, class_id: filterClassId, limit: 100 });
      setAttendance(r.data.attendance || r.data || []);
    } catch { toast.error('Gagal memuat data'); }
    finally { setLoading(false); }
  };

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    try { await attendanceService.create(singleForm); toast.success('Absensi dicatat'); setShowSingle(false); loadAttendance(); }
    catch (err) { toast.error(err.response?.data?.message || 'Gagal'); }
  };

  const openBulk = async () => {
    if (!bulkClassId) return toast.error('Pilih kelas terlebih dahulu');
    setLoadingBulk(true);
    try {
      const r = await studentService.getAll({ class_id: bulkClassId, limit: 100 });
      const list = (r.data.students || r.data).map(s => ({ student_id:s.id, name:s.name, nis:s.nis, status:'present', notes:'' }));
      setBulkRows(list);
      setShowBulk(true);
    } catch { toast.error('Gagal memuat siswa'); }
    finally { setLoadingBulk(false); }
  };

  const handleBulkSubmit = async () => {
    try {
      let ok = 0;
      for (const row of bulkRows) {
        await attendanceService.create({ student_id:row.student_id, date:bulkDate, status:row.status, notes:row.notes });
        ok++;
      }
      toast.success(`${ok} absensi berhasil dicatat`);
      setShowBulk(false); loadAttendance();
    } catch { toast.error('Gagal menyimpan sebagian data'); }
  };

  const setBulkAll = (status) => setBulkRows(rows => rows.map(r => ({ ...r, status })));

  // Summary
  const summary = {
    hadir:     attendance.filter(a=>a.status==='present').length,
    absen:     attendance.filter(a=>a.status==='absent').length,
    terlambat: attendance.filter(a=>a.status==='late').length,
    sakit:     attendance.filter(a=>a.status==='sick').length,
    izin:      attendance.filter(a=>a.status==='excused').length,
  };
  const total = Object.values(summary).reduce((a,b) => a+b, 0);

  return (
    <div>
      <PageHeader
        title={isStudent ? 'Absensi Saya' : isParent ? 'Absensi Anak' : 'Manajemen Absensi'}
        subtitle={canEdit ? 'Catat kehadiran siswa per hari atau per kelas sekaligus' : 'Lihat riwayat kehadiran'}
        breadcrumb="Akademik / Absensi"
        actions={canEdit && (
          <div className="flex gap-2">
            <button onClick={() => setShowSingle(true)} className="btn-secondary text-sm">
              <HiOutlinePlus size={15}/> Per Siswa
            </button>
            <button onClick={openBulk} className="btn-primary">
              <HiOutlineUserGroup size={15}/> Absen Kelas
            </button>
          </div>
        )}
      />

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-5">
        <div className="flex flex-wrap gap-3 items-center">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Tanggal</label>
            <input type="date" value={filterDate} onChange={e=>setFilterDate(e.target.value)} className="input-field text-sm" />
          </div>
          {!isStudent && !isParent && (
            <>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Kelas</label>
                <select value={filterClassId} onChange={e=>setFilterClassId(e.target.value)} className="input-field text-sm">
                  <option value="">Semua Kelas</option>
                  {classes.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              {canEdit && (
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Kelas untuk Absen Massal</label>
                  <div className="flex gap-2">
                    <select value={bulkClassId} onChange={e=>setBulkClassId(e.target.value)} className="input-field text-sm">
                      <option value="">— Pilih Kelas —</option>
                      {classes.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button onClick={openBulk} disabled={!bulkClassId || loadingBulk} className="btn-primary text-sm disabled:opacity-40">
                      {loadingBulk ? '...' : 'Mulai'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      {total > 0 && (
        <div className="grid grid-cols-5 gap-3 mb-5">
          {[
            { key:'hadir',     label:'Hadir',      color:'text-emerald-600', bg:'bg-emerald-50 border-emerald-100' },
            { key:'absen',     label:'Absen',       color:'text-red-600',     bg:'bg-red-50 border-red-100' },
            { key:'terlambat', label:'Terlambat',   color:'text-amber-600',   bg:'bg-amber-50 border-amber-100' },
            { key:'sakit',     label:'Sakit',       color:'text-blue-600',    bg:'bg-blue-50 border-blue-100' },
            { key:'izin',      label:'Izin',        color:'text-purple-600',  bg:'bg-purple-50 border-purple-100' },
          ].map(s => (
            <div key={s.key} className={`rounded-2xl border ${s.bg} p-3 text-center`}>
              <p className={`text-2xl font-bold ${s.color}`}>{summary[s.key]}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              <p className="text-xs text-slate-400">{total > 0 ? Math.round(summary[s.key]/total*100) : 0}%</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabel */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/></div>
        ) : attendance.length === 0 ? (
          <div className="text-center py-16">
            <HiOutlineEye size={48} className="mx-auto text-slate-200 mb-3"/>
            <p className="text-slate-400">Tidak ada data absensi</p>
            <p className="text-slate-300 text-sm mt-1">untuk {filterDate}</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                {['No','Siswa','NIS','Tanggal','Status','Catatan'].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {attendance.map((a, i) => (
                <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-400">{i+1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">{a.Student?.name?.charAt(0)}</div>
                      <span className="text-sm font-medium text-slate-800">{a.Student?.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-slate-500">{a.Student?.nis}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{a.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors[a.status]}`}>{statusLabels[a.status]}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{a.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Per Siswa */}
      <Modal isOpen={showSingle} onClose={() => setShowSingle(false)} title="Catat Absensi Siswa">
        <form onSubmit={handleSingleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Siswa *</label>
            <select value={singleForm.student_id} onChange={e=>setSingleForm({...singleForm,student_id:e.target.value})} className="input-field" required>
              <option value="">— Pilih Siswa —</option>
              {students.map(s=><option key={s.id} value={s.id}>{s.name} — {s.nis}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Tanggal *</label>
              <input type="date" value={singleForm.date} onChange={e=>setSingleForm({...singleForm,date:e.target.value})} className="input-field" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Status *</label>
              <select value={singleForm.status} onChange={e=>setSingleForm({...singleForm,status:e.target.value})} className="input-field">
                {Object.entries(statusLabels).map(([k,v])=><option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Catatan</label>
            <input type="text" value={singleForm.notes} onChange={e=>setSingleForm({...singleForm,notes:e.target.value})} className="input-field" placeholder="Keterangan (opsional)" />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={() => setShowSingle(false)} className="btn-secondary">Batal</button>
            <button type="submit" className="btn-primary">Simpan</button>
          </div>
        </form>
      </Modal>

      {/* Modal Absen Massal */}
      <Modal isOpen={showBulk} onClose={() => setShowBulk(false)} title={`Absen Massal — ${classes.find(c=>c.id==bulkClassId)?.name}`} size="lg">
        <div className="space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">Tanggal</label>
              <input type="date" value={bulkDate} onChange={e=>setBulkDate(e.target.value)} className="input-field text-sm" />
            </div>
            <div className="flex gap-1.5 pt-4">
              <button onClick={() => setBulkAll('present')} className="px-3 py-1.5 text-xs bg-emerald-100 text-emerald-700 rounded-lg font-medium hover:bg-emerald-200 transition-colors">Semua Hadir</button>
              <button onClick={() => setBulkAll('absent')} className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors">Semua Absen</button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-1.5 border border-slate-100 rounded-xl p-2">
            {bulkRows.map((row, i) => (
              <div key={row.student_id} className="flex items-center gap-3 p-2.5 bg-white hover:bg-slate-50 rounded-lg">
                <span className="text-xs text-slate-400 w-5">{i+1}</span>
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">{row.name?.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{row.name}</p>
                  <p className="text-xs text-slate-400">{row.nis}</p>
                </div>
                <select
                  value={row.status}
                  onChange={e => { const d=[...bulkRows]; d[i].status=e.target.value; setBulkRows(d); }}
                  className={`text-xs px-2 py-1.5 rounded-lg border font-medium ${statusColors[row.status]} focus:outline-none`}
                >
                  {Object.entries(statusLabels).map(([k,v])=><option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-400">{bulkRows.filter(r=>r.status==='present').length} hadir · {bulkRows.filter(r=>r.status!=='present').length} tidak hadir</p>
            <div className="flex gap-2">
              <button onClick={() => setShowBulk(false)} className="btn-secondary">Batal</button>
              <button onClick={handleBulkSubmit} className="btn-primary">Simpan {bulkRows.length} Absensi</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AttendancePage;
