import React, { useState, useEffect } from 'react';
import { bkService, studentService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

const BkPage = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('cases');
  const [cases, setCases] = useState([]);
  const [violations, setViolations] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [students, setStudents] = useState([]);

  // Modals
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [showVioModal, setShowVioModal] = useState(false);
  const [showAchModal, setShowAchModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [detailCase, setDetailCase] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [filter, setFilter] = useState({ case_type: '', status: '' });

  const [caseForm, setCaseForm] = useState({ student_id: '', case_type: 'counseling', title: '', description: '', date: today(), priority: 'medium' });
  const [vioForm, setVioForm] = useState({ student_id: '', violation_type: '', description: '', date: today(), punishment: '', points: '' });
  const [achForm, setAchForm] = useState({ student_id: '', title: '', achievement_type: '', description: '', date: today(), level: 'sekolah' });
  const [noteForm, setNoteForm] = useState({ note: '', action_taken: '', next_steps: '', date: today() });

  const canEdit = ['Admin', 'Guru BK', 'Wali Kelas'].includes(user?.role);

  function today() { return new Date().toISOString().split('T')[0]; }

  useEffect(() => {
    loadAll();
    studentService.getAll({}).then(res => setStudents(res.data.students || res.data));
  }, [filter]);

  const loadAll = () => {
    bkService.getCases(filter).then(res => setCases(res.data.cases || [])).catch(() => {});
    bkService.getViolations({}).then(res => setViolations(res.data.violations || [])).catch(() => {});
    bkService.getAchievements({}).then(res => setAchievements(res.data.achievements || [])).catch(() => {});
  };

  const handleCaseSubmit = async (e) => {
    e.preventDefault();
    try {
      await bkService.createCase(caseForm);
      toast.success('Kasus BK berhasil dicatat');
      setShowCaseModal(false);
      setCaseForm({ student_id: '', case_type: 'counseling', title: '', description: '', date: today(), priority: 'medium' });
      loadAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Gagal menyimpan'); }
  };

  const handleVioSubmit = async (e) => {
    e.preventDefault();
    try {
      await bkService.createViolation(vioForm);
      toast.success('Pelanggaran berhasil dicatat');
      setShowVioModal(false);
      setVioForm({ student_id: '', violation_type: '', description: '', date: today(), punishment: '', points: '' });
      loadAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Gagal menyimpan'); }
  };

  const handleAchSubmit = async (e) => {
    e.preventDefault();
    try {
      await bkService.createAchievement(achForm);
      toast.success('Prestasi berhasil dicatat');
      setShowAchModal(false);
      setAchForm({ student_id: '', title: '', achievement_type: '', description: '', date: today(), level: 'sekolah' });
      loadAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Gagal menyimpan'); }
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    try {
      await bkService.addNote({ ...noteForm, case_id: selectedCase.id });
      toast.success('Catatan konseling ditambahkan');
      setShowNoteModal(false);
      setNoteForm({ note: '', action_taken: '', next_steps: '', date: today() });
      loadAll();
    } catch (err) { toast.error('Gagal menyimpan catatan'); }
  };

  const handleViewDetail = async (c) => {
    try {
      const res = await bkService.getCaseById(c.id);
      setDetailCase(res.data);
      setShowDetailModal(true);
    } catch { toast.error('Gagal memuat detail'); }
  };

  const handleUpdateStatus = async (c, newStatus) => {
    try {
      await bkService.updateCase(c.id, { ...c, status: newStatus });
      toast.success(`Status diubah ke "${newStatus}"`);
      setShowDetailModal(false);
      loadAll();
    } catch { toast.error('Gagal mengubah status'); }
  };

  const typeLabels = { counseling: 'Konseling', violation: 'Pelanggaran', achievement: 'Prestasi', other: 'Lainnya' };
  const typeColors = { counseling: 'bg-blue-100 text-blue-800', violation: 'bg-red-100 text-red-800', achievement: 'bg-green-100 text-green-800', other: 'bg-gray-100 text-gray-800' };
  const statusColors = { open: 'bg-yellow-100 text-yellow-800', in_progress: 'bg-blue-100 text-blue-800', resolved: 'bg-green-100 text-green-800', closed: 'bg-gray-100 text-gray-800' };
  const statusLabels = { open: 'Buka', in_progress: 'Proses', resolved: 'Selesai', closed: 'Tutup' };
  const prioColors = { low: 'text-gray-500', medium: 'text-yellow-600', high: 'text-orange-600', urgent: 'text-red-700 font-bold' };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bimbingan Konseling</h1>
          <p className="text-sm text-gray-500">
            {canEdit ? 'Kelola kasus, pelanggaran, dan prestasi siswa' : 'Lihat data bimbingan konseling'}
          </p>
        </div>
        {canEdit && (
          <div className="flex gap-2">
            {tab === 'cases' && <button onClick={() => setShowCaseModal(true)} className="btn-primary">+ Kasus BK</button>}
            {tab === 'violations' && <button onClick={() => setShowVioModal(true)} className="btn-primary bg-red-600 hover:bg-red-700">+ Pelanggaran</button>}
            {tab === 'achievements' && <button onClick={() => setShowAchModal(true)} className="btn-primary bg-green-600 hover:bg-green-700">+ Prestasi</button>}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        <div className="card text-center py-3"><p className="text-xl font-bold text-yellow-600">{cases.filter(c => c.status === 'open').length}</p><p className="text-xs text-gray-500">Kasus Baru</p></div>
        <div className="card text-center py-3"><p className="text-xl font-bold text-blue-600">{cases.filter(c => c.status === 'in_progress').length}</p><p className="text-xs text-gray-500">Sedang Proses</p></div>
        <div className="card text-center py-3"><p className="text-xl font-bold text-green-600">{cases.filter(c => c.status === 'resolved').length}</p><p className="text-xs text-gray-500">Selesai</p></div>
        <div className="card text-center py-3"><p className="text-xl font-bold text-red-600">{violations.length}</p><p className="text-xs text-gray-500">Pelanggaran</p></div>
        <div className="card text-center py-3"><p className="text-xl font-bold text-purple-600">{achievements.length}</p><p className="text-xs text-gray-500">Prestasi</p></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b">
        {[
          { key: 'cases', label: `Kasus BK (${cases.length})` },
          { key: 'violations', label: `Pelanggaran (${violations.length})` },
          { key: 'achievements', label: `Prestasi (${achievements.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`pb-2 px-4 font-medium text-sm ${tab === t.key ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Filter (Kasus) */}
      {tab === 'cases' && (
        <div className="card mb-4">
          <div className="flex flex-wrap gap-3">
            <select value={filter.case_type} onChange={e => setFilter({ ...filter, case_type: e.target.value })} className="input-field max-w-xs">
              <option value="">Semua Jenis</option>
              <option value="counseling">Konseling</option>
              <option value="violation">Pelanggaran</option>
              <option value="achievement">Prestasi</option>
              <option value="other">Lainnya</option>
            </select>
            <select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })} className="input-field max-w-xs">
              <option value="">Semua Status</option>
              <option value="open">Buka</option>
              <option value="in_progress">Sedang Proses</option>
              <option value="resolved">Selesai</option>
              <option value="closed">Ditutup</option>
            </select>
          </div>
        </div>
      )}

      {/* TABEL KASUS */}
      {tab === 'cases' && (
        <div className="card overflow-x-auto">
          {cases.length === 0 ? <p className="text-center py-10 text-gray-400">Tidak ada kasus.</p> : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>{['No','Siswa','Jenis','Judul','Tanggal','Prioritas','Status','Aksi'].map(h =>
                  <th key={h} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                )}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cases.map((c, i) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 text-sm text-gray-400">{i+1}</td>
                    <td className="px-3 py-3"><p className="font-medium text-sm">{c.Student?.name}</p><p className="text-xs text-gray-400">{c.Student?.nis}</p></td>
                    <td className="px-3 py-3"><span className={`px-2 py-0.5 rounded text-xs ${typeColors[c.case_type]}`}>{typeLabels[c.case_type]}</span></td>
                    <td className="px-3 py-3 text-sm max-w-[160px]"><p className="truncate">{c.title}</p></td>
                    <td className="px-3 py-3 text-sm text-gray-500">{c.date}</td>
                    <td className="px-3 py-3 text-xs"><span className={prioColors[c.priority]}>{c.priority}</span></td>
                    <td className="px-3 py-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[c.status]}`}>{statusLabels[c.status] || c.status}</span></td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1 flex-wrap">
                        <button onClick={() => handleViewDetail(c)} className="text-xs text-blue-600 hover:underline">Detail</button>
                        {canEdit && c.status !== 'resolved' && c.status !== 'closed' && (
                          <button onClick={() => { setSelectedCase(c); setShowNoteModal(true); }} className="text-xs text-green-600 hover:underline">+ Catatan</button>
                        )}
                        {canEdit && c.status === 'open' && (
                          <button onClick={() => handleUpdateStatus(c, 'in_progress')} className="text-xs text-blue-700 hover:underline">Proses</button>
                        )}
                        {canEdit && c.status === 'in_progress' && (
                          <button onClick={() => handleUpdateStatus(c, 'resolved')} className="text-xs text-green-700 hover:underline">Selesai</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TABEL PELANGGARAN */}
      {tab === 'violations' && (
        <div className="card overflow-x-auto">
          {violations.length === 0 ? <p className="text-center py-10 text-gray-400">Tidak ada data pelanggaran.</p> : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>{['No','Siswa','Jenis Pelanggaran','Deskripsi','Tanggal','Sanksi','Poin'].map(h =>
                  <th key={h} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                )}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {violations.map((v, i) => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 text-sm text-gray-400">{i+1}</td>
                    <td className="px-3 py-3"><p className="font-medium text-sm">{v.Student?.name}</p><p className="text-xs text-gray-400">{v.Student?.nis}</p></td>
                    <td className="px-3 py-3"><span className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-800">{v.violation_type}</span></td>
                    <td className="px-3 py-3 text-sm text-gray-600 max-w-[200px]"><p className="truncate">{v.description}</p></td>
                    <td className="px-3 py-3 text-sm text-gray-500">{v.date}</td>
                    <td className="px-3 py-3 text-sm">{v.punishment || '-'}</td>
                    <td className="px-3 py-3 text-sm font-medium text-red-600">{v.points || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TABEL PRESTASI */}
      {tab === 'achievements' && (
        <div className="card overflow-x-auto">
          {achievements.length === 0 ? <p className="text-center py-10 text-gray-400">Belum ada data prestasi.</p> : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>{['No','Siswa','Judul Prestasi','Jenis','Tanggal','Tingkat','Deskripsi'].map(h =>
                  <th key={h} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                )}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {achievements.map((a, i) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 text-sm text-gray-400">{i+1}</td>
                    <td className="px-3 py-3"><p className="font-medium text-sm">{a.Student?.name}</p><p className="text-xs text-gray-400">{a.Student?.nis}</p></td>
                    <td className="px-3 py-3 text-sm font-medium">{a.title}</td>
                    <td className="px-3 py-3"><span className="px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-800">{a.achievement_type}</span></td>
                    <td className="px-3 py-3 text-sm text-gray-500">{a.date}</td>
                    <td className="px-3 py-3"><span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-800">{a.level}</span></td>
                    <td className="px-3 py-3 text-sm text-gray-600 max-w-[180px]"><p className="truncate">{a.description}</p></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ===== MODAL TAMBAH KASUS ===== */}
      <Modal isOpen={showCaseModal} onClose={() => setShowCaseModal(false)} title="Catat Kasus BK">
        <form onSubmit={handleCaseSubmit} className="space-y-3">
          <div><label className="text-xs text-gray-500">Siswa *</label>
            <select value={caseForm.student_id} onChange={e => setCaseForm({...caseForm,student_id:e.target.value})} className="input-field" required>
              <option value="">Pilih Siswa</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} — {s.nis}</option>)}
            </select></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-500">Jenis Kasus</label>
              <select value={caseForm.case_type} onChange={e => setCaseForm({...caseForm,case_type:e.target.value})} className="input-field">
                <option value="counseling">Konseling</option><option value="violation">Pelanggaran</option>
                <option value="achievement">Prestasi</option><option value="other">Lainnya</option>
              </select></div>
            <div><label className="text-xs text-gray-500">Prioritas</label>
              <select value={caseForm.priority} onChange={e => setCaseForm({...caseForm,priority:e.target.value})} className="input-field">
                <option value="low">Rendah</option><option value="medium">Sedang</option>
                <option value="high">Tinggi</option><option value="urgent">Urgent</option>
              </select></div>
          </div>
          <div><label className="text-xs text-gray-500">Tanggal *</label>
            <input type="date" value={caseForm.date} onChange={e => setCaseForm({...caseForm,date:e.target.value})} className="input-field" required /></div>
          <div><label className="text-xs text-gray-500">Judul Kasus *</label>
            <input type="text" placeholder="Judul singkat kasus" value={caseForm.title} onChange={e => setCaseForm({...caseForm,title:e.target.value})} className="input-field" required /></div>
          <div><label className="text-xs text-gray-500">Deskripsi / Kronologi *</label>
            <textarea rows="3" placeholder="Jelaskan kronologi atau latar belakang kasus..." value={caseForm.description} onChange={e => setCaseForm({...caseForm,description:e.target.value})} className="input-field" required /></div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowCaseModal(false)} className="btn-secondary">Batal</button>
            <button type="submit" className="btn-primary">Simpan Kasus</button>
          </div>
        </form>
      </Modal>

      {/* ===== MODAL TAMBAH PELANGGARAN ===== */}
      <Modal isOpen={showVioModal} onClose={() => setShowVioModal(false)} title="Catat Pelanggaran Siswa">
        <form onSubmit={handleVioSubmit} className="space-y-3">
          <div><label className="text-xs text-gray-500">Siswa *</label>
            <select value={vioForm.student_id} onChange={e => setVioForm({...vioForm,student_id:e.target.value})} className="input-field" required>
              <option value="">Pilih Siswa</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} — {s.nis}</option>)}
            </select></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-500">Jenis Pelanggaran *</label>
              <input type="text" placeholder="Misal: Terlambat, Bolos, dll" value={vioForm.violation_type} onChange={e => setVioForm({...vioForm,violation_type:e.target.value})} className="input-field" required /></div>
            <div><label className="text-xs text-gray-500">Tanggal *</label>
              <input type="date" value={vioForm.date} onChange={e => setVioForm({...vioForm,date:e.target.value})} className="input-field" required /></div>
          </div>
          <div><label className="text-xs text-gray-500">Deskripsi *</label>
            <textarea rows="2" value={vioForm.description} onChange={e => setVioForm({...vioForm,description:e.target.value})} className="input-field" required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-500">Sanksi / Tindakan</label>
              <input type="text" placeholder="Misal: Surat peringatan" value={vioForm.punishment} onChange={e => setVioForm({...vioForm,punishment:e.target.value})} className="input-field" /></div>
            <div><label className="text-xs text-gray-500">Poin Pelanggaran</label>
              <input type="number" placeholder="Misal: 10" value={vioForm.points} onChange={e => setVioForm({...vioForm,points:e.target.value})} className="input-field" min="0" /></div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowVioModal(false)} className="btn-secondary">Batal</button>
            <button type="submit" className="btn-primary bg-red-600 hover:bg-red-700">Simpan Pelanggaran</button>
          </div>
        </form>
      </Modal>

      {/* ===== MODAL TAMBAH PRESTASI ===== */}
      <Modal isOpen={showAchModal} onClose={() => setShowAchModal(false)} title="Catat Prestasi Siswa">
        <form onSubmit={handleAchSubmit} className="space-y-3">
          <div><label className="text-xs text-gray-500">Siswa *</label>
            <select value={achForm.student_id} onChange={e => setAchForm({...achForm,student_id:e.target.value})} className="input-field" required>
              <option value="">Pilih Siswa</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} — {s.nis}</option>)}
            </select></div>
          <div><label className="text-xs text-gray-500">Judul Prestasi *</label>
            <input type="text" placeholder="Misal: Juara 1 OSN Matematika" value={achForm.title} onChange={e => setAchForm({...achForm,title:e.target.value})} className="input-field" required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-500">Jenis Prestasi *</label>
              <input type="text" placeholder="Akademik / Non-Akademik" value={achForm.achievement_type} onChange={e => setAchForm({...achForm,achievement_type:e.target.value})} className="input-field" required /></div>
            <div><label className="text-xs text-gray-500">Tanggal *</label>
              <input type="date" value={achForm.date} onChange={e => setAchForm({...achForm,date:e.target.value})} className="input-field" required /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-500">Tingkat</label>
              <select value={achForm.level} onChange={e => setAchForm({...achForm,level:e.target.value})} className="input-field">
                <option value="sekolah">Sekolah</option><option value="kecamatan">Kecamatan</option>
                <option value="kota">Kota/Kabupaten</option><option value="provinsi">Provinsi</option>
                <option value="nasional">Nasional</option><option value="internasional">Internasional</option>
              </select></div>
            <div><label className="text-xs text-gray-500">Deskripsi</label>
              <input type="text" placeholder="Keterangan tambahan" value={achForm.description} onChange={e => setAchForm({...achForm,description:e.target.value})} className="input-field" /></div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowAchModal(false)} className="btn-secondary">Batal</button>
            <button type="submit" className="btn-primary bg-green-600 hover:bg-green-700">Simpan Prestasi</button>
          </div>
        </form>
      </Modal>

      {/* ===== MODAL CATATAN KONSELING ===== */}
      <Modal isOpen={showNoteModal} onClose={() => setShowNoteModal(false)} title="Tambah Catatan Konseling">
        <form onSubmit={handleNoteSubmit} className="space-y-3">
          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">Kasus: <strong>{selectedCase?.title}</strong> — {selectedCase?.Student?.name}</p>
          <div><label className="text-xs text-gray-500">Catatan Konseling *</label>
            <textarea rows="3" placeholder="Isi catatan konseling..." value={noteForm.note} onChange={e => setNoteForm({...noteForm,note:e.target.value})} className="input-field" required /></div>
          <div><label className="text-xs text-gray-500">Tindakan yang Diambil</label>
            <textarea rows="2" placeholder="Tindakan yang sudah dilakukan..." value={noteForm.action_taken} onChange={e => setNoteForm({...noteForm,action_taken:e.target.value})} className="input-field" /></div>
          <div><label className="text-xs text-gray-500">Rencana Tindak Lanjut</label>
            <textarea rows="2" placeholder="Langkah selanjutnya..." value={noteForm.next_steps} onChange={e => setNoteForm({...noteForm,next_steps:e.target.value})} className="input-field" /></div>
          <div><label className="text-xs text-gray-500">Tanggal</label>
            <input type="date" value={noteForm.date} onChange={e => setNoteForm({...noteForm,date:e.target.value})} className="input-field" /></div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowNoteModal(false)} className="btn-secondary">Batal</button>
            <button type="submit" className="btn-primary">Simpan Catatan</button>
          </div>
        </form>
      </Modal>

      {/* ===== MODAL DETAIL KASUS ===== */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Detail Kasus BK">
        {detailCase && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm bg-gray-50 p-3 rounded">
              <div><p className="text-gray-400 text-xs">Siswa</p><p className="font-semibold">{detailCase.Student?.name}</p></div>
              <div><p className="text-gray-400 text-xs">NIS</p><p className="font-semibold">{detailCase.Student?.nis}</p></div>
              <div><p className="text-gray-400 text-xs">Jenis</p><span className={`px-2 py-0.5 rounded text-xs ${typeColors[detailCase.case_type]}`}>{typeLabels[detailCase.case_type]}</span></div>
              <div><p className="text-gray-400 text-xs">Prioritas</p><p className={`font-semibold ${prioColors[detailCase.priority]}`}>{detailCase.priority}</p></div>
              <div><p className="text-gray-400 text-xs">Status</p><span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[detailCase.status]}`}>{statusLabels[detailCase.status] || detailCase.status}</span></div>
              <div><p className="text-gray-400 text-xs">Tanggal</p><p className="font-semibold">{detailCase.date}</p></div>
            </div>
            <div><p className="text-xs text-gray-400 mb-1">Deskripsi</p><p className="text-sm bg-blue-50 p-3 rounded">{detailCase.description}</p></div>

            {detailCase.BkCounselingNotes?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Catatan Konseling ({detailCase.BkCounselingNotes.length})</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {detailCase.BkCounselingNotes.map((n, i) => (
                    <div key={i} className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-sm">
                      <p className="font-medium">{n.note}</p>
                      {n.action_taken && <p className="text-gray-600 mt-1 text-xs">✅ Tindakan: {n.action_taken}</p>}
                      {n.next_steps && <p className="text-gray-600 text-xs">→ Selanjutnya: {n.next_steps}</p>}
                      <p className="text-gray-400 text-xs mt-1">{n.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {canEdit && (
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <button onClick={() => { setShowDetailModal(false); setSelectedCase(detailCase); setShowNoteModal(true); }} className="btn-secondary text-sm">+ Tambah Catatan</button>
                {detailCase.status === 'open' && <button onClick={() => handleUpdateStatus(detailCase, 'in_progress')} className="btn-primary text-sm bg-blue-600">Tandai: Sedang Proses</button>}
                {detailCase.status === 'in_progress' && <button onClick={() => handleUpdateStatus(detailCase, 'resolved')} className="btn-primary text-sm bg-green-600">Tandai: Selesai</button>}
                {detailCase.status === 'resolved' && <button onClick={() => handleUpdateStatus(detailCase, 'closed')} className="btn-secondary text-sm">Tutup Kasus</button>}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BkPage;
