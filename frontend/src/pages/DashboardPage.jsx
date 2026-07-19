import React, { useState, useEffect } from 'react';
import { reportService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { COLOR, LABEL, SCHOOL } from '../config/design';
import {
  HiOutlineUsers, HiOutlineAcademicCap, HiOutlineUserGroup, HiOutlineBookOpen,
  HiOutlineClipboardList, HiOutlineHeart, HiOutlineEye, HiOutlineChartBar,
  HiOutlineCalendar, HiOutlineDocumentText, HiOutlineCheckCircle,
  HiOutlineExclamationCircle, HiOutlineBadgeCheck
} from 'react-icons/hi';

// Kartu statistik — warna konsisten (biru & slate)
const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
    <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
      <Icon size={20} />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide leading-tight">{label}</p>
      <p className="text-xl font-bold text-slate-800 mt-0.5">{value}</p>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
    </div>
  </div>
);

// Kartu panel putih
const Panel = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
    <p className="text-sm font-semibold text-slate-700 mb-4">{title}</p>
    {children}
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportService.getDashboard()
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // ── ADMIN & KEPALA SEKOLAH ────────────────────────────────────
  if (user?.role === 'Admin' || user?.role === 'Kepala Sekolah') {
    const o = data?.overview || {};
    const stats = [
      { label:'Siswa Aktif',      value: o.totalStudents||0,  icon:HiOutlineUsers,         color:'bg-blue-600'  },
      { label:'Total Guru',       value: o.totalTeachers||0,  icon:HiOutlineAcademicCap,   color:'bg-slate-600' },
      { label:'Total Kelas',      value: o.totalClasses||0,   icon:HiOutlineUserGroup,     color:'bg-blue-500'  },
      { label:'Mata Pelajaran',   value: o.totalSubjects||0,  icon:HiOutlineBookOpen,      color:'bg-slate-500' },
      { label:'Jurnal Hari Ini',  value: o.todayJournals||0,  icon:HiOutlineClipboardList, color:'bg-blue-400'  },
      { label:'Kasus BK Aktif',   value: o.openCases||0,      icon:HiOutlineHeart,         color:'bg-slate-400' },
    ];
    return (
      <div>
        {/* Greeting */}
        <div className="mb-6">
          <p className="text-xs text-slate-400 uppercase tracking-wide">{SCHOOL.name}</p>
          <h1 className="text-xl font-bold text-slate-800 mt-0.5">Selamat Datang, {user.name}</h1>
          <p className="text-sm text-slate-500 mt-0.5">Dashboard {user.role} — ringkasan data sekolah hari ini</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {stats.map((s,i) => <StatCard key={i} {...s} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Panel title="Tahun Ajaran Aktif">
            {data?.academicInfo?.activeYear ? (
              <div className="space-y-2.5">
                {[
                  { label:'Tahun Ajaran',    value: data.academicInfo.activeYear.name },
                  { label:'Semester Aktif',  value: data.academicInfo.activeSemester?.name || '—' },
                  { label:'Total Jurnal',    value: `${o.totalJournals||0} jurnal` },
                  { label:'Absensi Hari Ini',value: `${o.todayAttendance||0} catatan` },
                ].map((r,i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <span className="text-sm text-slate-500">{r.label}</span>
                    <span className="text-sm font-semibold text-slate-800">{r.value}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-slate-400">Tidak ada tahun ajaran aktif</p>}
          </Panel>

          <Panel title="Aktivitas Terbaru">
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {(data?.recentLogs||[]).length === 0 ? (
                <p className="text-sm text-slate-400">Belum ada aktivitas</p>
              ) : (data?.recentLogs||[]).map((log,i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {log.User?.name?.charAt(0)||'?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 truncate">{log.User?.name} <span className="font-normal text-slate-500">— {log.description}</span></p>
                    <p className="text-xs text-slate-400">{new Date(log.createdAt).toLocaleString('id-ID',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    );
  }

  // ── GURU & WALI KELAS ─────────────────────────────────────────
  if (user?.role === 'Guru' || user?.role === 'Wali Kelas') {
    const o = data?.overview || {};
    const stats = [
      { label:'Total Jurnal Saya', value: o.myJournals||0,      icon:HiOutlineClipboardList, color:'bg-blue-600'  },
      { label:'Jurnal Hari Ini',   value: o.myTodayJournals||0, icon:HiOutlineDocumentText,  color:'bg-slate-600' },
      { label:'Jadwal Mengajar',   value: o.mySchedules||0,     icon:HiOutlineCalendar,      color:'bg-blue-500'  },
      { label:'Kelas Wali',        value: o.myClasses||0,       icon:HiOutlineUserGroup,     color:'bg-slate-500' },
    ];
    return (
      <div>
        <div className="mb-6">
          <p className="text-xs text-slate-400 uppercase tracking-wide">{SCHOOL.name}</p>
          <h1 className="text-xl font-bold text-slate-800 mt-0.5">Selamat Datang, {user.name}</h1>
          <p className="text-sm text-slate-500">Dashboard {user.role}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s,i) => <StatCard key={i} {...s} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Panel title="Jadwal Mengajar Hari Ini">
            {(data?.todaySchedule||[]).length === 0 ? (
              <p className="text-sm text-slate-400">Tidak ada jadwal mengajar hari ini</p>
            ) : (
              <div className="space-y-2">
                {data.todaySchedule.map((s,i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="text-center min-w-[52px]">
                      <p className="text-xs font-mono font-bold text-blue-600">{s.start_time?.slice(0,5)}</p>
                      <p className="text-xs font-mono text-slate-400">{s.end_time?.slice(0,5)}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{s.Subject?.name}</p>
                      <p className="text-xs text-slate-500">Kelas {s.Class?.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Jurnal Terbaru">
            {(data?.recentJournals||[]).length === 0 ? (
              <p className="text-sm text-slate-400">Belum ada jurnal</p>
            ) : (
              <div className="space-y-2">
                {data.recentJournals.map((j,i) => {
                  const sc = COLOR.journalStatus[j.status];
                  return (
                    <div key={i} className="flex items-start justify-between gap-2 py-2 border-b border-slate-50 last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{j.Subject?.name}</p>
                        <p className="text-xs text-slate-500">Kelas {j.Class?.name} · {j.date}</p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{j.material}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-medium flex-shrink-0 ${sc?.bg} ${sc?.text}`}>{j.status}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
        </div>
      </div>
    );
  }

  // ── GURU BK ───────────────────────────────────────────────────
  if (user?.role === 'Guru BK') {
    const o = data?.overview || {};
    const stats = [
      { label:'Total Kasus',     value: o.totalCases||0,       icon:HiOutlineHeart,             color:'bg-blue-600'  },
      { label:'Kasus Aktif',     value: o.openCases||0,        icon:HiOutlineExclamationCircle, color:'bg-slate-700' },
      { label:'Kasus Selesai',   value: o.resolvedCases||0,    icon:HiOutlineCheckCircle,       color:'bg-blue-500'  },
      { label:'Pelanggaran',     value: o.totalViolations||0,  icon:HiOutlineExclamationCircle, color:'bg-slate-500' },
      { label:'Prestasi',        value: o.totalAchievements||0,icon:HiOutlineBadgeCheck,        color:'bg-blue-400'  },
    ];
    return (
      <div>
        <div className="mb-6">
          <p className="text-xs text-slate-400 uppercase tracking-wide">{SCHOOL.name}</p>
          <h1 className="text-xl font-bold text-slate-800 mt-0.5">Selamat Datang, {user.name}</h1>
          <p className="text-sm text-slate-500">Dashboard Guru Bimbingan Konseling</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {stats.map((s,i) => <StatCard key={i} {...s} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Panel title="Kasus BK Terbaru">
            {(data?.recentCases||[]).length === 0 ? (
              <p className="text-sm text-slate-400">Tidak ada kasus</p>
            ) : (
              <div className="space-y-2">
                {data.recentCases.map((c,i) => {
                  const sc = COLOR.caseStatus[c.status];
                  return (
                    <div key={i} className="py-2 border-b border-slate-50 last:border-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-slate-800">{c.Student?.name}</p>
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${sc?.bg} ${sc?.text}`}>{c.status}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{c.case_type} · {c.date}</p>
                      <p className="text-xs text-slate-600 truncate mt-1">{c.description}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>

          <Panel title="Pelanggaran & Prestasi Terbaru">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Pelanggaran</p>
              {(data?.recentViolations||[]).length === 0 ? (
                <p className="text-xs text-slate-300 mb-3">Tidak ada data</p>
              ) : (data.recentViolations).map((v,i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-xs font-medium text-slate-700">{v.Student?.name}</span>
                  <span className="text-xs text-slate-500">{v.violation_type} · {v.date}</span>
                </div>
              ))}
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 pt-3">Prestasi</p>
              {(data?.recentAchievements||[]).length === 0 ? (
                <p className="text-xs text-slate-300">Tidak ada data</p>
              ) : (data.recentAchievements).map((a,i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                  <span className="text-xs font-medium text-slate-700">{a.Student?.name}</span>
                  <span className="text-xs text-slate-500">{a.achievement_type} · {a.date}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    );
  }

  // ── SISWA ─────────────────────────────────────────────────────
  if (user?.role === 'Siswa') {
    const o = data?.overview || {};
    const si = data?.studentInfo || {};
    const rate = o.totalAttendance > 0 ? Math.round(o.presentCount/o.totalAttendance*100) : 0;
    const stats = [
      { label:'Kehadiran',    value:`${rate}%`,          icon:HiOutlineEye,       color:'bg-blue-600',  sub:`${o.presentCount||0} dari ${o.totalAttendance||0}` },
      { label:'Absen',        value: o.absentCount||0,   icon:HiOutlineEye,       color:'bg-slate-600'  },
      { label:'Terlambat',    value: o.lateCount||0,     icon:HiOutlineEye,       color:'bg-slate-500'  },
      { label:'Rata-rata',    value: o.average||0,       icon:HiOutlineChartBar,  color:'bg-blue-500',  sub:`dari ${o.totalGrades||0} mapel` },
    ];
    return (
      <div>
        {/* Student info bar */}
        <div className="bg-slate-900 rounded-2xl px-5 py-4 flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold">{si.name?.charAt(0)}</div>
          <div>
            <h2 className="text-base font-bold text-white">{si.name||user.name}</h2>
            <p className="text-sm text-slate-400">{si.nis} · Kelas {si.className} · Wali: {si.homeroomTeacher||'—'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s,i) => <StatCard key={i} {...s} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Panel title="Jadwal Hari Ini">
            {(data?.todaySchedule||[]).length === 0 ? (
              <p className="text-sm text-slate-400">Tidak ada jadwal hari ini</p>
            ) : (
              <div className="space-y-2">
                {data.todaySchedule.map((s,i)=>(
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="text-center min-w-[50px]">
                      <p className="text-xs font-mono font-bold text-blue-600">{s.start_time?.slice(0,5)}</p>
                      <p className="text-xs font-mono text-slate-400">{s.end_time?.slice(0,5)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{s.Subject?.name}</p>
                      <p className="text-xs text-slate-500">{s.Teacher?.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Nilai Terbaru">
            {(data?.recentGrades||[]).length === 0 ? (
              <p className="text-sm text-slate-400">Belum ada nilai</p>
            ) : (
              <div className="space-y-2">
                {data.recentGrades.map((g,i) => {
                  const gc = COLOR.grade[g.grade_letter];
                  return (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{g.Subject?.name}</p>
                        <p className="text-xs text-slate-400">Nilai Akhir: {g.final_score}</p>
                      </div>
                      {g.grade_letter && (
                        <span className={`px-3 py-1 rounded-xl text-sm font-bold ${gc?.bg} ${gc?.text}`}>{g.grade_letter}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
        </div>
      </div>
    );
  }

  // ── ORANG TUA ────────────────────────────────────────────────
  if (user?.role === 'Orang Tua') {
    const o = data?.overview || {};
    const si = data?.studentInfo || {};
    const rate = o.totalAttendance > 0 ? Math.round(o.presentCount/o.totalAttendance*100) : 0;

    if (!si.id && data?.message) return (
      <div className="card text-center py-16 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl mx-auto mb-4">👨‍👩‍👧</div>
        <h3 className="font-semibold text-slate-700 mb-2">Data Anak Tidak Ditemukan</h3>
        <p className="text-slate-400 text-sm">Hubungi Administrator untuk menghubungkan akun ini dengan data siswa.</p>
      </div>
    );

    const stats = [
      { label:'Kehadiran',  value:`${rate}%`,        icon:HiOutlineEye,      color:'bg-blue-600',  sub:`${o.presentCount||0}/${o.totalAttendance||0}` },
      { label:'Absen',      value: o.absentCount||0, icon:HiOutlineEye,      color:'bg-slate-600' },
      { label:'Terlambat',  value: o.lateCount||0,   icon:HiOutlineEye,      color:'bg-slate-500' },
      { label:'Rata-rata',  value: o.average||0,     icon:HiOutlineChartBar, color:'bg-blue-500' },
    ];

    return (
      <div>
        <div className="bg-slate-900 rounded-2xl px-5 py-4 flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-slate-600 flex items-center justify-center text-white text-xl font-bold">{si.name?.charAt(0)}</div>
          <div>
            <p className="text-xs text-slate-500">Putra/Putri Anda</p>
            <h2 className="text-base font-bold text-white">{si.name}</h2>
            <p className="text-sm text-slate-400">{si.nis} · Kelas {si.className} · Wali: {si.homeroomTeacher||'—'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s,i) => <StatCard key={i} {...s} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Panel title="Nilai Terbaru">
            {(data?.recentGrades||[]).length === 0 ? (
              <p className="text-sm text-slate-400">Belum ada nilai</p>
            ) : (
              <div className="space-y-2">
                {data.recentGrades.map((g,i) => {
                  const gc = COLOR.grade[g.grade_letter];
                  return (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{g.Subject?.name}</p>
                        <p className="text-xs text-slate-400">Nilai Akhir: {g.final_score}</p>
                      </div>
                      {g.grade_letter && <span className={`px-3 py-1 rounded-xl text-sm font-bold ${gc?.bg} ${gc?.text}`}>{g.grade_letter}</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>

          <Panel title="Catatan BK">
            {(data?.bkCases||[]).length === 0 ? (
              <p className="text-sm text-slate-400">Tidak ada catatan BK</p>
            ) : (
              <div className="space-y-2">
                {data.bkCases.map((c,i) => {
                  const sc = COLOR.caseStatus[c.status];
                  return (
                    <div key={i} className="py-2 border-b border-slate-50 last:border-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-800">{c.case_type}</p>
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${sc?.bg} ${sc?.text}`}>{c.status}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{c.date} — {c.description}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
        </div>
      </div>
    );
  }

  return (
    <div className="card text-center py-12">
      <p className="text-slate-400">Dashboard tidak tersedia</p>
    </div>
  );
};

export default DashboardPage;
