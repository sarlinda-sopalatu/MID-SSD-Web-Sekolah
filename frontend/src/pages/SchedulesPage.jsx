import React, { useState, useEffect } from 'react';
import { scheduleService, classService, subjectService, teacherService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

const DAYS = [
  { key: 'monday', label: 'Senin' },
  { key: 'tuesday', label: 'Selasa' },
  { key: 'wednesday', label: 'Rabu' },
  { key: 'thursday', label: 'Kamis' },
  { key: 'friday', label: 'Jumat' },
  { key: 'saturday', label: 'Sabtu' },
];

const SchedulesPage = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [filter, setFilter] = useState({ class_id: '', day: '' });
  const [form, setForm] = useState({ teacher_id: '', class_id: '', subject_id: '', day: 'monday', start_time: '07:00', end_time: '08:00', semester_id: 1 });

  const canEdit = ['Admin'].includes(user?.role);

  useEffect(() => {
    loadSchedules();
    classService.getAll().then(res => setClasses(res.data));
    subjectService.getAll().then(res => setSubjects(res.data));
    if (canEdit) teacherService.getAll().then(res => setTeachers(res.data));
  }, [filter]);

  const loadSchedules = async () => {
    try {
      const res = await scheduleService.getAll(filter);
      setSchedules(res.data || []);
    } catch { toast.error('Gagal memuat jadwal'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await scheduleService.create(form);
      toast.success('Jadwal berhasil ditambahkan');
      setShowModal(false);
      setForm({ teacher_id: '', class_id: '', subject_id: '', day: 'monday', start_time: '07:00', end_time: '08:00', semester_id: 1 });
      loadSchedules();
    } catch (err) { toast.error(err.response?.data?.message || 'Gagal menyimpan'); }
  };

  const handleDelete = async (s) => {
    if (!confirm(`Hapus jadwal ${s.Subject?.name} - ${s.Class?.name}?`)) return;
    try {
      await scheduleService.delete(s.id);
      toast.success('Jadwal dihapus');
      loadSchedules();
    } catch { toast.error('Gagal menghapus'); }
  };

  // Group schedules by day
  const grouped = {};
  DAYS.forEach(d => { grouped[d.key] = []; });
  schedules.forEach(s => { if (grouped[s.day]) grouped[s.day].push(s); });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Jadwal Pelajaran</h1>
          <p className="text-sm text-gray-500">{canEdit ? 'Kelola jadwal pelajaran semua kelas' : 'Lihat jadwal pelajaran'}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')} className="btn-secondary text-sm">
            {viewMode === 'grid' ? '📋 Tampilan Tabel' : '📅 Tampilan Grid'}
          </button>
          {canEdit && (
            <button onClick={() => setShowModal(true)} className="btn-primary">+ Tambah Jadwal</button>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="card mb-5">
        <div className="flex flex-wrap gap-3">
          <select value={filter.class_id} onChange={e => setFilter({ ...filter, class_id: e.target.value })} className="input-field max-w-xs">
            <option value="">Semua Kelas</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={filter.day} onChange={e => setFilter({ ...filter, day: e.target.value })} className="input-field max-w-xs">
            <option value="">Semua Hari</option>
            {DAYS.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
          </select>
          {(filter.class_id || filter.day) && (
            <button onClick={() => setFilter({ class_id: '', day: '' })} className="btn-secondary text-sm">Reset Filter</button>
          )}
        </div>
      </div>

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAYS.map(d => (
            <div key={d.key} className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-primary-700">{d.label}</h3>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{grouped[d.key].length} jam</span>
              </div>
              {grouped[d.key].length > 0 ? (
                <div className="space-y-2">
                  {grouped[d.key]
                    .sort((a, b) => a.start_time.localeCompare(b.start_time))
                    .map((s, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg group relative">
                        <div className="text-center min-w-[54px]">
                          <p className="text-xs font-mono font-bold text-blue-700">{s.start_time}</p>
                          <p className="text-xs font-mono text-gray-400">{s.end_time}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{s.Subject?.name}</p>
                          <p className="text-xs text-gray-500">{s.Class?.name}</p>
                          <p className="text-xs text-gray-400">{s.Teacher?.name}</p>
                        </div>
                        {canEdit && (
                          <button onClick={() => handleDelete(s)} className="text-red-400 hover:text-red-600 text-xs opacity-0 group-hover:opacity-100 flex-shrink-0">✕</button>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-3">Tidak ada jadwal</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="card overflow-x-auto">
          {schedules.length === 0 ? (
            <p className="text-center py-10 text-gray-400">Tidak ada jadwal untuk filter ini.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>{['No','Hari','Jam','Kelas','Mata Pelajaran','Guru', canEdit ? 'Aksi' : ''].filter(Boolean).map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {schedules
                  .sort((a, b) => DAYS.findIndex(d => d.key === a.day) - DAYS.findIndex(d => d.key === b.day) || a.start_time.localeCompare(b.start_time))
                  .map((s, i) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-400">{i+1}</td>
                      <td className="px-4 py-3 text-sm font-medium">{DAYS.find(d => d.key === s.day)?.label}</td>
                      <td className="px-4 py-3 text-sm font-mono">{s.start_time} – {s.end_time}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs">{s.Class?.name}</span></td>
                      <td className="px-4 py-3 text-sm">{s.Subject?.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.Teacher?.name}</td>
                      {canEdit && (
                        <td className="px-4 py-3">
                          <button onClick={() => handleDelete(s)} className="text-xs text-red-500 hover:underline">Hapus</button>
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal Tambah Jadwal */}
      {canEdit && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Tambah Jadwal Pelajaran">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div><label className="text-xs text-gray-500">Kelas *</label>
              <select value={form.class_id} onChange={e => setForm({...form,class_id:e.target.value})} className="input-field" required>
                <option value="">Pilih Kelas</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select></div>
            <div><label className="text-xs text-gray-500">Mata Pelajaran *</label>
              <select value={form.subject_id} onChange={e => setForm({...form,subject_id:e.target.value})} className="input-field" required>
                <option value="">Pilih Mata Pelajaran</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select></div>
            <div><label className="text-xs text-gray-500">Guru Pengajar *</label>
              <select value={form.teacher_id} onChange={e => setForm({...form,teacher_id:e.target.value})} className="input-field" required>
                <option value="">Pilih Guru</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select></div>
            <div><label className="text-xs text-gray-500">Hari *</label>
              <select value={form.day} onChange={e => setForm({...form,day:e.target.value})} className="input-field">
                {DAYS.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
              </select></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-gray-500">Jam Mulai *</label>
                <input type="time" value={form.start_time} onChange={e => setForm({...form,start_time:e.target.value})} className="input-field" required /></div>
              <div><label className="text-xs text-gray-500">Jam Selesai *</label>
                <input type="time" value={form.end_time} onChange={e => setForm({...form,end_time:e.target.value})} className="input-field" required /></div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Batal</button>
              <button type="submit" className="btn-primary">Simpan Jadwal</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default SchedulesPage;
