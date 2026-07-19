import React, { useState, useEffect } from 'react';
import { reportService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { COLOR, LABEL } from '../config/design';
import toast from 'react-hot-toast';
import { HiOutlineAcademicCap } from 'react-icons/hi';

const TabBtn = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
      ${active ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
  >
    {children}
  </button>
);

const EmptyState = ({ text }) => (
  <div className="flex flex-col items-center justify-center py-12 text-slate-400">
    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
      <HiOutlineAcademicCap size={22} className="text-slate-300" />
    </div>
    <p className="text-sm">{text}</p>
  </div>
);

const ChildViewPage = () => {
  const { user }  = useAuth();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState('nilai');

  useEffect(() => {
    reportService.getChildProfile()
      .then(r => setData(r.data))
      .catch(() => toast.error('Gagal memuat data anak'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!data?.student) return (
    <div className="card text-center py-16 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl mx-auto mb-4">👨‍👩‍👧</div>
      <h3 className="font-semibold text-slate-700 mb-2">Data Anak Tidak Ditemukan</h3>
      <p className="text-slate-400 text-sm">Hubungi Administrator untuk menghubungkan akun ini dengan data siswa.</p>
    </div>
  );

  const { student, grades, attendance, bkCases, violations, achievements } = data;
  const presentCount   = attendance.filter(a => a.status === 'present').length;
  const attendanceRate = attendance.length > 0 ? Math.round(presentCount / attendance.length * 100) : 0;
  const avgGrade       = grades.length > 0
    ? (grades.reduce((s, g) => s + parseFloat(g.final_score || 0), 0) / grades.length).toFixed(1) : '—';

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* ── HERO CARD ─────────────────────────────── */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden">
        <div className="px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-slate-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg">
            {student.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 mb-1">Putra/Putri Anda</p>
            <h2 className="text-xl font-bold text-white leading-tight">{student.name}</h2>
            <p className="text-slate-400 text-sm mt-0.5">
              {student.nis} &nbsp;·&nbsp; Kelas {student.Class?.name || '—'} &nbsp;·&nbsp; Wali: {student.Class?.HomeroomTeacher?.name || '—'}
            </p>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-700 text-slate-300">
                {LABEL.gender[student.gender] || '—'}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/10 text-slate-300">
                Aktif
              </span>
            </div>
          </div>
          <div className="flex sm:flex-col gap-4 sm:gap-2 text-right">
            <div><p className="text-2xl font-bold text-white">{avgGrade}</p><p className="text-xs text-slate-500">Rata-rata Nilai</p></div>
            <div><p className="text-2xl font-bold text-white">{attendanceRate}%</p><p className="text-xs text-slate-500">Kehadiran</p></div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 border-t border-white/5">
          {[
            { label:'Total Nilai',   value: grades.length },
            { label:'Pelanggaran',   value: violations?.length || 0 },
            { label:'Prestasi',      value: achievements?.length || 0 },
            { label:'Kasus BK',      value: bkCases?.length || 0 },
          ].map((s, i) => (
            <div key={i} className={`px-4 py-3 text-center ${i > 0 ? 'border-l border-white/5' : ''}`}>
              <p className="text-lg font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── TABS ──────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 overflow-x-auto">
          {[
            { key:'nilai',        label:`Nilai (${grades.length})` },
            { key:'absensi',      label:`Absensi (${attendance.length})` },
            { key:'pelanggaran',  label:`Pelanggaran (${violations?.length||0})` },
            { key:'prestasi',     label:`Prestasi (${achievements?.length||0})` },
            { key:'bk',           label:`Catatan BK (${bkCases?.length||0})` },
          ].map(t => (
            <TabBtn key={t.key} active={tab===t.key} onClick={() => setTab(t.key)}>{t.label}</TabBtn>
          ))}
        </div>

        <div className="p-5">

          {/* ── NILAI ── */}
          {tab === 'nilai' && (
            grades.length === 0 ? <EmptyState text="Belum ada data nilai" /> : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead><tr>
                    {['Mata Pelajaran','Semester','Quiz','Tugas','UTS','UAS','Nilai Akhir','Grade'].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {grades.map((g, i) => (
                      <tr key={i} className="hover:bg-slate-50/60">
                        <td className="px-3 py-3 font-medium text-sm text-slate-800">{g.Subject?.name}</td>
                        <td className="px-3 py-3 text-sm text-slate-500">{g.Semester?.name||'—'}</td>
                        {[g.quiz_score,g.assignment_score,g.mid_exam_score,g.final_exam_score].map((v,j)=>(
                          <td key={j} className="px-3 py-3 text-sm text-center font-mono text-slate-600">{v??'—'}</td>
                        ))}
                        <td className="px-3 py-3 text-center font-bold text-sm text-slate-900">{g.final_score??'—'}</td>
                        <td className="px-3 py-3 text-center">
                          {g.grade_letter ? (
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${COLOR.grade[g.grade_letter]?.bg} ${COLOR.grade[g.grade_letter]?.text}`}>
                              {g.grade_letter}
                            </span>
                          ) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* ── ABSENSI ── */}
          {tab === 'absensi' && (
            attendance.length === 0 ? <EmptyState text="Belum ada data absensi" /> : (
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(LABEL.attendance).map(([k,v]) => {
                    const count = attendance.filter(a => a.status===k).length;
                    const c = COLOR.attendance[k];
                    return (
                      <div key={k} className={`${c.bg} rounded-xl p-3 text-center`}>
                        <p className={`text-xl font-bold ${c.text}`}>{count}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{v}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100">
                    <thead><tr>
                      {['Tanggal','Status','Catatan'].map(h=>(
                        <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody className="divide-y divide-slate-50">
                      {attendance.map((a,i)=>{
                        const c = COLOR.attendance[a.status];
                        return (
                          <tr key={i} className="hover:bg-slate-50/60">
                            <td className="px-3 py-2.5 text-sm text-slate-700">{a.date}</td>
                            <td className="px-3 py-2.5"><span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${c?.bg} ${c?.text}`}>{LABEL.attendance[a.status]}</span></td>
                            <td className="px-3 py-2.5 text-sm text-slate-500">{a.notes||'—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )}

          {/* ── PELANGGARAN ── */}
          {tab === 'pelanggaran' && (
            (violations?.length||0) === 0 ? <EmptyState text="Tidak ada catatan pelanggaran" /> : (
              <div className="space-y-3">
                {violations.map((v,i)=>(
                  <div key={i} className="border border-slate-100 rounded-xl p-4 bg-slate-50">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-700">{v.violation_type}</span>
                        <p className="text-xs text-slate-500 mt-1">{v.date}</p>
                      </div>
                      {v.points && <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">−{v.points} poin</span>}
                    </div>
                    <p className="text-sm text-slate-700">{v.description}</p>
                    {v.punishment && <p className="text-xs text-slate-500 mt-1.5 border-t border-slate-200 pt-1.5">Sanksi: {v.punishment}</p>}
                  </div>
                ))}
              </div>
            )
          )}

          {/* ── PRESTASI ── */}
          {tab === 'prestasi' && (
            (achievements?.length||0) === 0 ? <EmptyState text="Belum ada catatan prestasi" /> : (
              <div className="space-y-3">
                {achievements.map((a,i)=>(
                  <div key={i} className="border border-slate-100 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-sm text-slate-800">{a.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{a.achievement_type} · {a.date}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-700 flex-shrink-0">{a.level}</span>
                    </div>
                    {a.description && <p className="text-sm text-slate-600 mt-2">{a.description}</p>}
                  </div>
                ))}
              </div>
            )
          )}

          {/* ── BK ── */}
          {tab === 'bk' && (
            (bkCases?.length||0) === 0 ? <EmptyState text="Tidak ada catatan BK" /> : (
              <div className="space-y-3">
                {bkCases.map((c,i)=>{
                  const sc = COLOR.caseStatus[c.status];
                  return (
                    <div key={i} className="border border-slate-100 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-sm text-slate-800">{c.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{c.case_type} · {c.date}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium flex-shrink-0 ${sc?.bg} ${sc?.text}`}>{c.status}</span>
                      </div>
                      {c.description && <p className="text-sm text-slate-600 mt-2">{c.description}</p>}
                    </div>
                  );
                })}
              </div>
            )
          )}

        </div>
      </div>
    </div>
  );
};

export default ChildViewPage;
