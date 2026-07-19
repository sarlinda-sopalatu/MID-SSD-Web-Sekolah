import React, { useState, useEffect } from 'react';
import { journalService, classService, subjectService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

const JournalsPage = () => {
  const { user } = useAuth();
  const [journals, setJournals] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailJournal, setDetailJournal] = useState(null);
  const [editJournal, setEditJournal] = useState(null);
  const [filter, setFilter] = useState({ class_id: '', subject_id: '', status: '' });
  const [form, setForm] = useState({ class_id: '', subject_id: '', date: new Date().toISOString().split('T')[0], material: '', method: '', notes: '' });

  const canEdit = ['Admin', 'Guru', 'Wali Kelas'].includes(user?.role);
  const canApprove = ['Admin', 'Kepala Sekolah'].includes(user?.role);

  useEffect(() => {
    loadJournals();
    classService.getAll().then(res => setClasses(res.data));
    subjectService.getAll().then(res => setSubjects(res.data));
  }, [filter]);

  const loadJournals = async () => {
    try {
      const res = await journalService.getAll(filter);
      setJournals(res.data.journals || []);
    } catch { toast.error('Gagal memuat data'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editJournal) {
        await journalService.update(editJournal.id, form);
        toast.success('Jurnal berhasil diupdate');
      } else {
        await journalService.create(form);
        toast.success('Jurnal berhasil disimpan');
      }
      setShowModal(false); setEditJournal(null); resetForm(); loadJournals();
    } catch (error) { toast.error(error.response?.data?.message || 'Gagal menyimpan'); }
  };

  const handleSubmitJournal = async (journal) => {
    try {
      await journalService.update(journal.id, { ...journal, status: 'submitted' });
      toast.success('Jurnal dikirim untuk persetujuan');
      loadJournals();
    } catch { toast.error('Gagal mengubah status'); }
  };

  const handleApprove = async (journal) => {
    try {
      await journalService.update(journal.id, { ...journal, status: 'approved' });
      toast.success('Jurnal disetujui');
      loadJournals();
    } catch { toast.error('Gagal menyetujui'); }
  };

  const resetForm = () => setForm({ class_id: '', subject_id: '', date: new Date().toISOString().split('T')[0], material: '', method: '', notes: '' });

  const statusLabels = { draft: 'Draft', submitted: 'Menunggu Persetujuan', approved: 'Disetujui' };
  const statusColors = { draft: 'bg-gray-100 text-gray-700', submitted: 'bg-yellow-100 text-yellow-800', approved: 'bg-green-100 text-green-800' };

  // Summary
  const summary = {
    total: journals.length,
    draft: journals.filter(j => j.status === 'draft').length,
    submitted: journals.filter(j => j.status === 'submitted').length,
    approved: journals.filter(j => j.status === 'approved').length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Jurnal Mengajar</h1>
          <p className="text-sm text-gray-500">
            {user?.role === 'Guru' ? 'Isi dan kelola jurnal mengajar Anda' :
             user?.role === 'Kepala Sekolah' ? 'Pantau dan setujui jurnal mengajar guru' :
             'Kelola rekap jurnal mengajar'}
          </p>
        </div>
        {canEdit && (
          <button onClick={() => { resetForm(); setEditJournal(null); setShowModal(true); }} className="btn-primary">+ Isi Jurnal</button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <div className="card text-center py-3"><p className="text-2xl font-bold text-gray-700">{summary.total}</p><p className="text-xs text-gray-500">Total</p></div>
        <div className="card text-center py-3"><p className="text-2xl font-bold text-gray-500">{summary.draft}</p><p className="text-xs text-gray-500">Draft</p></div>
        <div className="card text-center py-3"><p className="text-2xl font-bold text-yellow-600">{summary.submitted}</p><p className="text-xs text-gray-500">Menunggu</p></div>
        <div className="card text-center py-3"><p className="text-2xl font-bold text-green-600">{summary.approved}</p><p className="text-xs text-gray-500">Disetujui</p></div>
      </div>

      {/* Filter */}
      <div className="card mb-4">
        <div className="flex flex-wrap gap-3">
          <select value={filter.class_id} onChange={e => setFilter({ ...filter, class_id: e.target.value })} className="input-field max-w-xs">
            <option value="">Semua Kelas</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={filter.subject_id} onChange={e => setFilter({ ...filter, subject_id: e.target.value })} className="input-field max-w-xs">
            <option value="">Semua Mata Pelajaran</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })} className="input-field max-w-xs">
            <option value="">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="submitted">Menunggu Persetujuan</option>
            <option value="approved">Disetujui</option>
          </select>
        </div>
      </div>

      {/* Tabel */}
      <div className="card overflow-x-auto">
        {journals.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Tidak ada jurnal untuk filter ini.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['No', 'Tanggal', 'Guru', 'Kelas', 'Mata Pelajaran', 'Materi', 'Metode', 'Status', 'Aksi'].map(h => (
                  <th key={h} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {journals.map((j, i) => (
                <tr key={j.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3 text-sm text-gray-500">{i + 1}</td>
                  <td className="px-3 py-3 text-sm">{j.date}</td>
                  <td className="px-3 py-3 text-sm font-medium">{j.Teacher?.name || '-'}</td>
                  <td className="px-3 py-3 text-sm"><span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs">{j.Class?.name}</span></td>
                  <td className="px-3 py-3 text-sm">{j.Subject?.name}</td>
                  <td className="px-3 py-3 text-sm max-w-[180px]"><p className="truncate" title={j.material}>{j.material}</p></td>
                  <td className="px-3 py-3 text-xs text-gray-500">{j.method || '-'}</td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[j.status]}`}>{statusLabels[j.status]}</span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => { setDetailJournal(j); setShowDetailModal(true); }} className="text-xs text-blue-600 hover:underline">Detail</button>
                      {canEdit && j.status === 'draft' && (
                        <>
                          <button onClick={() => { setEditJournal(j); setForm({ class_id: j.class_id, subject_id: j.subject_id, date: j.date, material: j.material, method: j.method || '', notes: j.notes || '' }); setShowModal(true); }} className="text-xs text-yellow-600 hover:underline">Edit</button>
                          <button onClick={() => handleSubmitJournal(j)} className="text-xs text-green-600 hover:underline">Kirim</button>
                        </>
                      )}
                      {canApprove && j.status === 'submitted' && (
                        <button onClick={() => handleApprove(j)} className="text-xs text-green-700 font-semibold hover:underline">Setujui</button>
                      )}
                      {user?.role === 'Admin' && (
                        <button onClick={async () => { if (confirm('Hapus?')) { await journalService.delete(j.id); loadJournals(); toast.success('Dihapus'); } }} className="text-xs text-red-500 hover:underline">Hapus</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Isi Jurnal */}
      {canEdit && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editJournal ? 'Edit Jurnal' : 'Isi Jurnal Mengajar'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Kelas</label>
                <select value={form.class_id} onChange={e => setForm({ ...form, class_id: e.target.value })} className="input-field" required>
                  <option value="">Pilih Kelas</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Mata Pelajaran</label>
                <select value={form.subject_id} onChange={e => setForm({ ...form, subject_id: e.target.value })} className="input-field" required>
                  <option value="">Pilih Mapel</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">Tanggal Mengajar</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="text-xs text-gray-500">Materi Pembelajaran *</label>
              <textarea placeholder="Deskripsikan materi yang diajarkan hari ini..." value={form.material} onChange={e => setForm({ ...form, material: e.target.value })} className="input-field" rows="3" required />
            </div>
            <div>
              <label className="text-xs text-gray-500">Metode Pembelajaran</label>
              <input type="text" placeholder="Misal: Ceramah, Diskusi Kelompok, Praktikum" value={form.method} onChange={e => setForm({ ...form, method: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="text-xs text-gray-500">Catatan / Hambatan</label>
              <textarea placeholder="Catatan tambahan, hambatan, atau saran" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="input-field" rows="2" />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Batal</button>
              <button type="submit" className="btn-primary">Simpan sebagai Draft</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Detail */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Detail Jurnal Mengajar">
        {detailJournal && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-gray-400 text-xs">Tanggal</p><p className="font-medium">{detailJournal.date}</p></div>
              <div><p className="text-gray-400 text-xs">Status</p><span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[detailJournal.status]}`}>{statusLabels[detailJournal.status]}</span></div>
              <div><p className="text-gray-400 text-xs">Guru</p><p className="font-medium">{detailJournal.Teacher?.name || '-'}</p></div>
              <div><p className="text-gray-400 text-xs">Kelas</p><p className="font-medium">{detailJournal.Class?.name || '-'}</p></div>
              <div><p className="text-gray-400 text-xs">Mata Pelajaran</p><p className="font-medium">{detailJournal.Subject?.name || '-'}</p></div>
              <div><p className="text-gray-400 text-xs">Metode</p><p className="font-medium">{detailJournal.method || '-'}</p></div>
            </div>
            <div><p className="text-gray-400 text-xs mb-1">Materi Pembelajaran</p><p className="text-sm bg-gray-50 p-3 rounded">{detailJournal.material}</p></div>
            {detailJournal.notes && <div><p className="text-gray-400 text-xs mb-1">Catatan</p><p className="text-sm bg-gray-50 p-3 rounded">{detailJournal.notes}</p></div>}
            {canApprove && detailJournal.status === 'submitted' && (
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button onClick={() => { handleApprove(detailJournal); setShowDetailModal(false); }} className="btn-primary">Setujui Jurnal</button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default JournalsPage;
