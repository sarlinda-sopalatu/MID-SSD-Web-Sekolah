import React, { useState, useEffect } from 'react';
import { reportService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { COLOR, LABEL, getAvatarClass } from '../config/design';
import toast from 'react-hot-toast';
import { HiOutlineChartBar, HiOutlineEye, HiOutlineCalendar, HiOutlineHeart, HiOutlineAcademicCap } from 'react-icons/hi';

/* ─── Komponen internal ──────────────────────────────────── */
const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-xs text-slate-400 leading-tight">{label}</p>
    <p className="text-sm font-medium text-slate-700 mt-0.5">{value || '—'}</p>
  </div>
);

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

/* ─── ProfilePage ────────────────────────────────────────── */
const ProfilePage = () => {
  const { user }  = useAuth();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState('nilai');

  useEffect(() => {
    reportService.getStudentProfile()
      .then(r => setData(r.data))
      .catch(() => toast.error('Gagal memuat profil'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!data?.student) return (
    <div className="card text-center py-16">
      <p className="text-slate-400">Data profil tidak ditemukan. Hubungi Administrator.</p>
    </div>
  );

  const { student, grades, attendance, schedules, bkCases } = data;
  const presentCount    = attendance.filter(a => a.status === 'present').length;
  const absentCount     = attendance.filter(a => a.status === 'absent').length;
  const lateCount       = attendance.filter(a => a.status === 'late').length;
  const attendanceRate  = attendance.length > 0
    ? Math.round(presentCount / attendance.length * 100) : 0;
  const avgGrade        = grades.length > 0
    ? (grades.reduce((s, g) => s + parseFloat(g.final_score || 0), 0) / grades.length).toFixed(1) : '—';

  const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday'];
  const dayLabel = { monday:'Senin', tuesday:'Selasa', wednesday:'Rabu', thursday:'Kamis', friday:'Jumat', saturday:'Sabtu' };

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* ── HERO CARD ─────────────────────────────────────── */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden">
        <div className="px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg">
            {student.name?.charAt(0)}
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white leading-tight">{student.name}</h2>
            <p className="text-slate-400 text-sm mt-0.5">
              {student.nis} &nbsp;·&nbsp; Kelas {student.Class?.name || '—'} &nbsp;·&nbsp; Wali: {student.Class?.HomeroomTeacher?.name || '—'}
            </p>
            <div className="flex gap-2 mt-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-600 text-white">Siswa Aktif</span>
              {student.nisn && <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/10 text-slate-300">NISN {student.nisn}</span>}
            </div>
          </div>
          {/* Quick stats */}
          <div className="flex sm:flex-col gap-4 sm:gap-2 text-right">
            <div>
              <p className="text-2xl font-bold text-white">{avgGrade}</p>
              <p className="text-xs text-slate-500">Rata-rata Nilai</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{attendanceRate}%</p>
              <p className="text-xs text-slate-500">Kehadiran</p>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 border-t border-white/5">
          {[
            { label:'Total Nilai',   value: grades.length,    icon: HiOutlineChartBar },
            { label:'Hadir',         value: presentCount,     icon: HiOutlineEye },
            { label:'Tidak Hadir',   value: absentCount,      icon: HiOutlineEye },
            { label:'Terlambat',     value: lateCount,        icon: HiOutlineEye },
          ].map((s, i) => (
            <div key={i} className={`px-4 py-3 text-center ${i > 0 ? 'border-l border-white/5' : ''}`}>
              <p className="text-lg font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── TABS ──────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 overflow-x-auto">
          {[
            { key:'nilai',     label:`Nilai (${grades.length})`          },
            { key:'absensi',   label:`Absensi (${attendance.length})`    },
            { key:'jadwal',    label:`Jadwal (${schedules.length})`      },
            { key:'bk',        label:`Catatan BK (${bkCases.length})`    },
          ].map(t => (
            <TabBtn key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>{t.label}</TabBtn>
          ))}
        </div>

        <div className="p-5">

          {/* ── TAB NILAI ── */}
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
                      <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-3 py-3 font-medium text-sm text-slate-800">{g.Subject?.name}</td>
                        <td className="px-3 py-3 text-sm text-slate-500">{g.Semester?.name || '—'}</td>
                        {[g.quiz_score, g.assignment_score, g.mid_exam_score, g.final_exam_score].map((v, j) => (
                          <td key={j} className="px-3 py-3 text-sm text-center font-mono text-slate-600">{v ?? '—'}</td>
                        ))}
                        <td className="px-3 py-3 text-center">
                          <span className="font-bold text-sm text-slate-900">{g.final_score ?? '—'}</span>
                        </td>
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

          {/* ── TAB ABSENSI ── */}
          {tab === 'absensi' && (
            attendance.length === 0 ? <EmptyState text="Belum ada data absensi" /> : (
              <div className="space-y-2">
                {/* Ringkasan */}
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {Object.entries(LABEL.attendance).map(([k, v]) => {
                    const count = attendance.filter(a => a.status === k).length;
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
                      {['Tanggal','Status','Catatan'].map(h => (
                        <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody className="divide-y divide-slate-50">
                      {attendance.map((a, i) => {
                        const c = COLOR.attendance[a.status];
                        return (
                          <tr key={i} className="hover:bg-slate-50/60">
                            <td className="px-3 py-2.5 text-sm text-slate-700">{a.date}</td>
                            <td className="px-3 py-2.5">
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${c?.bg} ${c?.text}`}>
                                {LABEL.attendance[a.status]}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-sm text-slate-500">{a.notes || '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )}

          {/* ── TAB JADWAL ── */}
          {tab === 'jadwal' && (
            schedules.length === 0 ? <EmptyState text="Belum ada jadwal pelajaran" /> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {DAYS.map(day => {
                  const daySchedules = schedules.filter(s => s.day === day).sort((a,b) => a.start_time.localeCompare(b.start_time));
                  return (
                    <div key={day} className="bg-slate-50 rounded-xl p-3.5">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">{dayLabel[day]}</p>
                      {daySchedules.length === 0 ? (
                        <p className="text-xs text-slate-300 text-center py-2">Tidak ada jadwal</p>
                      ) : (
                        <div className="space-y-2">
                          {daySchedules.map((s, i) => (
                            <div key={i} className="bg-white rounded-lg p-2.5 border border-slate-100 flex items-start gap-2">
                              <div className="min-w-[44px] text-center">
                                <p className="text-xs font-mono font-semibold text-blue-600">{s.start_time?.slice(0,5)}</p>
                                <p className="text-xs font-mono text-slate-400">{s.end_time?.slice(0,5)}</p>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-800 truncate">{s.Subject?.name}</p>
                                <p className="text-xs text-slate-400 truncate">{s.Teacher?.name}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* ── TAB BK ── */}
          {tab === 'bk' && (
            bkCases.length === 0 ? <EmptyState text="Tidak ada catatan bimbingan konseling" /> : (
              <div className="space-y-3">
                {bkCases.map((c, i) => {
                  const sc = COLOR.caseStatus[c.status];
                  return (
                    <div key={i} className="border border-slate-100 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-sm text-slate-800">{c.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{c.case_type} · {c.date}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium flex-shrink-0 ${sc?.bg} ${sc?.text}`}>
                          {c.status}
                        </span>
                      </div>
                      {c.description && <p className="text-sm text-slate-600 mt-2 leading-relaxed">{c.description}</p>}
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

export default ProfilePage;
