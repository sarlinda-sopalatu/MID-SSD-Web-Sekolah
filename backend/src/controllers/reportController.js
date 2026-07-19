const { Student, Teacher, Class, Subject, TeachingJournal, BkCase, BkCounselingNote, StudentViolation, StudentAchievement, Attendance, Grade, AcademicYear, Semester, Schedule, ActivityLog, User } = require('../models');
const { Op } = require('sequelize');

function getDayName(dateStr) {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date(dateStr).getDay()];
}

exports.getDashboard = async (req, res) => {
  try {
    const role = req.userRole;
    const activeAcademicYear = await AcademicYear.findOne({ where: { is_active: true } });
    const activeSemester = await Semester.findOne({ where: { is_active: true } });
    const today = new Date().toISOString().split('T')[0];

    const baseData = {
      academicInfo: { activeYear: activeAcademicYear, activeSemester }
    };

    // ADMIN & KEPALA SEKOLAH
    if (role === 'Admin' || role === 'Kepala Sekolah') {
      const [totalStudents, totalTeachers, totalClasses, totalSubjects, todayJournals, openCases, todayAttendance, totalJournals, totalCases] = await Promise.all([
        Student.count({ where: { status: 'active' } }),
        Teacher.count(),
        Class.count(),
        Subject.count(),
        TeachingJournal.count({ where: { date: today } }),
        BkCase.count({ where: { status: { [Op.in]: ['open', 'in_progress'] } } }),
        Attendance.count({ where: { date: today } }),
        TeachingJournal.count(),
        BkCase.count()
      ]);
      const recentLogs = await ActivityLog.findAll({
        limit: 10, order: [['createdAt', 'DESC']],
        include: [{ model: User, attributes: ['name'] }]
      });
      return res.json({
        ...baseData,
        overview: { totalStudents, totalTeachers, totalClasses, totalSubjects, todayJournals, openCases, todayAttendance, totalJournals, totalCases },
        recentLogs
      });
    }

    // GURU & WALI KELAS
    if (role === 'Guru' || role === 'Wali Kelas') {
      const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });
      if (!teacher) return res.json({ ...baseData, overview: {}, recentJournals: [], todaySchedule: [] });

      const [myJournals, myTodayJournals, mySchedules, myClasses] = await Promise.all([
        TeachingJournal.count({ where: { teacher_id: teacher.id } }),
        TeachingJournal.count({ where: { teacher_id: teacher.id, date: today } }),
        Schedule.count({ where: { teacher_id: teacher.id } }),
        Class.count({ where: { homeroom_teacher_id: teacher.id } })
      ]);
      const recentJournals = await TeachingJournal.findAll({
        where: { teacher_id: teacher.id },
        include: [{ model: Class, attributes: ['name'] }, { model: Subject, attributes: ['name'] }],
        order: [['date', 'DESC']], limit: 5
      });
      const todaySchedule = await Schedule.findAll({
        where: { teacher_id: teacher.id, day: getDayName(today) },
        include: [{ model: Class, attributes: ['name'] }, { model: Subject, attributes: ['name'] }],
        order: [['start_time', 'ASC']]
      });
      return res.json({
        ...baseData,
        overview: { myJournals, myTodayJournals, mySchedules, myClasses },
        recentJournals, todaySchedule
      });
    }

    // GURU BK
    if (role === 'Guru BK') {
      const [totalCases, openCases, resolvedCases, totalViolations, totalAchievements] = await Promise.all([
        BkCase.count(),
        BkCase.count({ where: { status: { [Op.in]: ['open', 'in_progress'] } } }),
        BkCase.count({ where: { status: 'resolved' } }),
        StudentViolation.count(),
        StudentAchievement.count()
      ]);
      const recentCases = await BkCase.findAll({
        include: [{ model: Student, attributes: ['name', 'nis'] }, { model: Teacher, as: 'Counselor', attributes: ['name'] }],
        order: [['date', 'DESC']], limit: 5
      });
      const recentViolations = await StudentViolation.findAll({
        include: [{ model: Student, attributes: ['name', 'nis'] }],
        order: [['date', 'DESC']], limit: 5
      });
      const recentAchievements = await StudentAchievement.findAll({
        include: [{ model: Student, attributes: ['name', 'nis'] }],
        order: [['date', 'DESC']], limit: 5
      });
      return res.json({
        ...baseData,
        overview: { totalCases, openCases, resolvedCases, totalViolations, totalAchievements },
        recentCases, recentViolations, recentAchievements
      });
    }

    // SISWA
    if (role === 'Siswa') {
      const student = await Student.findOne({ where: { user_id: req.user.id } });
      if (!student) return res.json({ ...baseData, overview: {} });

      const [totalAttendance, presentCount, absentCount, lateCount, totalGrades] = await Promise.all([
        Attendance.count({ where: { student_id: student.id } }),
        Attendance.count({ where: { student_id: student.id, status: 'present' } }),
        Attendance.count({ where: { student_id: student.id, status: 'absent' } }),
        Attendance.count({ where: { student_id: student.id, status: 'late' } }),
        Grade.count({ where: { student_id: student.id } })
      ]);
      const avgScoreRows = await Grade.findAll({ where: { student_id: student.id }, attributes: ['final_score'] });
      const average = avgScoreRows.length > 0
        ? (avgScoreRows.reduce((s, g) => s + parseFloat(g.final_score || 0), 0) / avgScoreRows.length).toFixed(1)
        : 0;
      const classInfo = await Class.findByPk(student.class_id, {
        include: [{ model: Teacher, as: 'HomeroomTeacher', attributes: ['name'] }]
      });
      const recentGrades = await Grade.findAll({
        where: { student_id: student.id },
        include: [{ model: Subject, attributes: ['name'] }],
        order: [['createdAt', 'DESC']], limit: 6
      });
      const todaySchedule = await Schedule.findAll({
        where: { class_id: student.class_id, day: getDayName(today) },
        include: [{ model: Subject, attributes: ['name'] }, { model: Teacher, attributes: ['name'] }],
        order: [['start_time', 'ASC']]
      });
      return res.json({
        ...baseData,
        studentInfo: { ...student.toJSON(), className: classInfo?.name, homeroomTeacher: classInfo?.HomeroomTeacher?.name },
        overview: { totalAttendance, presentCount, absentCount, lateCount, totalGrades, average },
        recentGrades, todaySchedule
      });
    }

    // ORANG TUA
    if (role === 'Orang Tua') {
      const parentUser = await User.findByPk(req.user.id);
      const student = await Student.findOne({ where: { parent_email: parentUser.email } });
      if (!student) return res.json({ ...baseData, overview: {}, message: 'Tidak ada data anak yang terhubung' });

      const [totalAttendance, presentCount, absentCount, lateCount, totalGrades] = await Promise.all([
        Attendance.count({ where: { student_id: student.id } }),
        Attendance.count({ where: { student_id: student.id, status: 'present' } }),
        Attendance.count({ where: { student_id: student.id, status: 'absent' } }),
        Attendance.count({ where: { student_id: student.id, status: 'late' } }),
        Grade.count({ where: { student_id: student.id } })
      ]);
      const avgScoreRows = await Grade.findAll({ where: { student_id: student.id }, attributes: ['final_score'] });
      const average = avgScoreRows.length > 0
        ? (avgScoreRows.reduce((s, g) => s + parseFloat(g.final_score || 0), 0) / avgScoreRows.length).toFixed(1)
        : 0;
      const classInfo = await Class.findByPk(student.class_id, {
        include: [{ model: Teacher, as: 'HomeroomTeacher', attributes: ['name'] }]
      });
      const recentGrades = await Grade.findAll({
        where: { student_id: student.id },
        include: [{ model: Subject, attributes: ['name'] }],
        order: [['createdAt', 'DESC']], limit: 6
      });
      const bkCases = await BkCase.findAll({
        where: { student_id: student.id },
        order: [['date', 'DESC']], limit: 5
      });
      return res.json({
        ...baseData,
        studentInfo: { ...student.toJSON(), className: classInfo?.name, homeroomTeacher: classInfo?.HomeroomTeacher?.name },
        overview: { totalAttendance, presentCount, absentCount, lateCount, totalGrades, average },
        recentGrades, bkCases
      });
    }

    res.json(baseData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAcademicReport = async (req, res) => {
  try {
    const { class_id, subject_id, semester_id } = req.query;
    const where = {};
    if (semester_id) where.semester_id = semester_id;
    const grades = await Grade.findAll({
      where,
      include: [
        { model: Student, attributes: ['id', 'name'], where: class_id ? { class_id } : {} },
        { model: Subject, attributes: ['id', 'name'], where: subject_id ? { id: subject_id } : {} }
      ]
    });
    const summary = {
      total: grades.length,
      averageScore: grades.length > 0
        ? (grades.reduce((sum, g) => sum + (parseFloat(g.final_score) || 0), 0) / grades.length).toFixed(2) : 0,
      gradeDistribution: {
        A: grades.filter(g => g.grade_letter === 'A').length,
        B: grades.filter(g => g.grade_letter === 'B').length,
        C: grades.filter(g => g.grade_letter === 'C').length,
        D: grades.filter(g => g.grade_letter === 'D').length,
        E: grades.filter(g => g.grade_letter === 'E').length
      }
    };
    res.json({ grades, summary });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { user_id: req.user.id },
      include: [{ model: Class, include: [{ model: Teacher, as: 'HomeroomTeacher', attributes: ['name'] }] }]
    });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });
    const [grades, attendance, schedules, bkCases] = await Promise.all([
      Grade.findAll({ where: { student_id: student.id }, include: [{ model: Subject }, { model: Semester }] }),
      Attendance.findAll({ where: { student_id: student.id }, order: [['date', 'DESC']], limit: 30 }),
      Schedule.findAll({ where: { class_id: student.class_id }, include: [{ model: Teacher, attributes: ['name'] }, { model: Subject, attributes: ['name'] }], order: [['day', 'ASC'], ['start_time', 'ASC']] }),
      BkCase.findAll({ where: { student_id: student.id }, order: [['date', 'DESC']] })
    ]);
    res.json({ student, grades, attendance, schedules, bkCases });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getChildProfile = async (req, res) => {
  try {
    const parentUser = await User.findByPk(req.user.id);
    const student = await Student.findOne({
      where: { parent_email: parentUser.email },
      include: [{ model: Class, include: [{ model: Teacher, as: 'HomeroomTeacher', attributes: ['name'] }] }]
    });
    if (!student) return res.status(404).json({ message: 'Anak tidak ditemukan' });
    const [grades, attendance, bkCases, violations, achievements] = await Promise.all([
      Grade.findAll({ where: { student_id: student.id }, include: [{ model: Subject }, { model: Semester }] }),
      Attendance.findAll({ where: { student_id: student.id }, order: [['date', 'DESC']], limit: 30 }),
      BkCase.findAll({ where: { student_id: student.id }, order: [['date', 'DESC']] }),
      StudentViolation.findAll({ where: { student_id: student.id }, order: [['date', 'DESC']] }),
      StudentAchievement.findAll({ where: { student_id: student.id }, order: [['date', 'DESC']] })
    ]);
    res.json({ student, grades, attendance, bkCases, violations, achievements });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
