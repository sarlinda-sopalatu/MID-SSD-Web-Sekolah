require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, Role, User, AcademicYear, Semester, Subject, Class, Teacher, Student, Schedule, TeachingJournal, BkCase, BkCounselingNote, StudentViolation, StudentAchievement, Attendance, Grade } = require('../models');

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    // Sync database tables first before seeding
    await sequelize.sync({ force: true });
    console.log('Database tables recreated successfully');

    // Roles
    await Role.bulkCreate([
      { id: 1, name: 'Admin', description: 'System administrator' },
      { id: 2, name: 'Kepala Sekolah', description: 'School principal' },
      { id: 3, name: 'Guru', description: 'Teacher' },
      { id: 4, name: 'Guru BK', description: 'Counseling teacher' },
      { id: 5, name: 'Wali Kelas', description: 'Homeroom teacher' },
      { id: 6, name: 'Siswa', description: 'Student' },
      { id: 7, name: 'Orang Tua', description: 'Parent' }
    ], { ignoreDuplicates: true });
    console.log('Roles seeded');

    const pw = await bcrypt.hash('password123', 10);

    // Users
    const usersData = [
      { email: 'admin@sekolah.test', password: pw, name: 'Admin Utama', role_id: 1 },
      { email: 'kepsek@sekolah.test', password: pw, name: 'Dr. Budi Santoso, M.Pd', role_id: 2 },
      { email: 'guru@sekolah.test', password: pw, name: 'Siti Rahayu, S.Pd', role_id: 3 },
      { email: 'guru2@sekolah.test', password: pw, name: 'Rina Marlina, S.Pd', role_id: 3 },
      { email: 'bk@sekolah.test', password: pw, name: 'Ahmad Fauzi, S.Pd', role_id: 4 },
      { email: 'walikelas@sekolah.test', password: pw, name: 'Dewi Lestari, S.Pd', role_id: 5 },
      { email: 'siswa@sekolah.test', password: pw, name: 'Rizki Pratama', role_id: 6 },
      { email: 'siswa2@sekolah.test', password: pw, name: 'Anisa Putri', role_id: 6 },
      { email: 'ortu@sekolah.test', password: pw, name: 'Joko Pratama', role_id: 7 },
    ];
    for (const u of usersData) {
      await User.findOrCreate({ where: { email: u.email }, defaults: u });
    }
    console.log('Users seeded');

    // Academic Year & Semester
    const [ay] = await AcademicYear.findOrCreate({
      where: { year: '2025/2026' },
      defaults: { year: '2025/2026', start_date: '2025-07-14', end_date: '2026-06-30', is_active: true }
    });
    const [sem1] = await Semester.findOrCreate({
      where: { academic_year_id: ay.id, semester_number: 1 },
      defaults: { academic_year_id: ay.id, name: 'Ganjil', semester_number: 1, start_date: '2025-07-14', end_date: '2025-12-20', is_active: true }
    });
    console.log('Academic year & semester seeded');

    // Subjects
    const subjectsData = [
      { code: 'MTK', name: 'Matematika', description: 'Matematika Wajib', grade_level: 10 },
      { code: 'BIN', name: 'Bahasa Indonesia', description: 'Bahasa Indonesia', grade_level: 10 },
      { code: 'BIG', name: 'Bahasa Inggris', description: 'Bahasa Inggris', grade_level: 10 },
      { code: 'FIS', name: 'Fisika', description: 'Fisika', grade_level: 10 },
      { code: 'KIM', name: 'Kimia', description: 'Kimia', grade_level: 10 },
      { code: 'BIO', name: 'Biologi', description: 'Biologi', grade_level: 10 },
      { code: 'IPS', name: 'Ilmu Pengetahuan Sosial', description: 'IPS', grade_level: 10 },
      { code: 'PKN', name: 'Pendidikan Kewarganegaraan', description: 'PKN', grade_level: 10 },
      { code: 'SKI', name: 'Sejarah Kebudayaan Islam', description: 'SKI', grade_level: 10 },
      { code: 'PJOK', name: 'Pendidikan Jasmani', description: 'PJOK', grade_level: 10 },
    ];
    const subjects = [];
    for (const s of subjectsData) {
      const [subj] = await Subject.findOrCreate({ where: { code: s.code }, defaults: s });
      subjects.push(subj);
    }
    console.log('Subjects seeded');

    // Teachers
    const [guruSiti] = await Teacher.findOrCreate({
      where: { nip: '198501012010011001' },
      defaults: { user_id: 3, nip: '198501012010011001', name: 'Siti Rahayu, S.Pd', gender: 'P', phone: '081234567890', address: 'Jl. Merdeka No. 10', subject_id: subjects[0].id }
    });
    const [guruRina] = await Teacher.findOrCreate({
      where: { nip: '198801012010011003' },
      defaults: { user_id: 4, nip: '198801012010011003', name: 'Rina Marlina, S.Pd', gender: 'P', phone: '081234567892', address: 'Jl. Sudirman No. 25', subject_id: subjects[1].id }
    });
    const [guruAhmad] = await Teacher.findOrCreate({
      where: { nip: '198701012010011002' },
      defaults: { user_id: 5, nip: '198701012010011002', name: 'Ahmad Fauzi, S.Pd', gender: 'L', phone: '081234567891', address: 'Jl. Pahlawan No. 5', subject_id: subjects[2].id }
    });
    const [guruDewi] = await Teacher.findOrCreate({
      where: { nip: '198601012010011004' },
      defaults: { user_id: 6, nip: '198601012010011004', name: 'Dewi Lestari, S.Pd', gender: 'P', phone: '081234567893', address: 'Jl. Mawar No. 12', subject_id: subjects[3].id }
    });
    console.log('Teachers seeded');

    // Classes
    const [clsX_A] = await Class.findOrCreate({
      where: { name: 'X-A', academic_year_id: ay.id },
      defaults: { name: 'X-A', grade_level: 10, academic_year_id: ay.id, homeroom_teacher_id: guruDewi.id, capacity: 36 }
    });
    const [clsX_B] = await Class.findOrCreate({
      where: { name: 'X-B', academic_year_id: ay.id },
      defaults: { name: 'X-B', grade_level: 10, academic_year_id: ay.id, homeroom_teacher_id: guruSiti.id, capacity: 36 }
    });
    const [clsXI_A] = await Class.findOrCreate({
      where: { name: 'XI-A', academic_year_id: ay.id },
      defaults: { name: 'XI-A', grade_level: 11, academic_year_id: ay.id, capacity: 36 }
    });
    console.log('Classes seeded');

    // Students (with parent link to users)
    const studentsData = [
      { user_id: 7, nis: '2025001', nisn: '0081234001', name: 'Rizki Pratama', gender: 'L', birth_date: '2009-05-15', birth_place: 'Jakarta', class_id: clsX_A.id, status: 'active', parent_name: 'Joko Pratama', parent_phone: '081111222333', parent_email: 'ortu@sekolah.test' },
      { user_id: 8, nis: '2025002', nisn: '0081234002', name: 'Anisa Putri', gender: 'P', birth_date: '2009-03-20', birth_place: 'Bandung', class_id: clsX_A.id, status: 'active', parent_name: 'Budi Putra', parent_phone: '081111222444' },
      { nis: '2025003', nisn: '0081234003', name: 'Dimas Aditya', gender: 'L', birth_date: '2009-08-10', birth_place: 'Surabaya', class_id: clsX_A.id, status: 'active', parent_name: 'Andi Aditya', parent_phone: '081111222555' },
      { nis: '2025004', nisn: '0081234004', name: 'Salsa Zahra', gender: 'P', birth_date: '2009-11-25', birth_place: 'Yogyakarta', class_id: clsX_B.id, status: 'active', parent_name: 'Hendra Zahra', parent_phone: '081111222666' },
      { nis: '2025005', nisn: '0081234005', name: 'Fajar Nugroho', gender: 'L', birth_date: '2009-07-05', birth_place: 'Semarang', class_id: clsX_B.id, status: 'active', parent_name: 'Rudi Nugroho', parent_phone: '081111222777' },
      { nis: '2025006', nisn: '0081234006', name: 'Maya Sari', gender: 'P', birth_date: '2009-12-01', birth_place: 'Malang', class_id: clsX_A.id, status: 'active', parent_name: 'Hendra Sari', parent_phone: '081111222888' },
      { nis: '2025007', nisn: '0081234007', name: 'Bayu Pratama', gender: 'L', birth_date: '2009-02-14', birth_place: 'Bekasi', class_id: clsXI_A.id, status: 'active', parent_name: 'Agus Pratama', parent_phone: '081111222999' },
      { nis: '2025008', nisn: '0081234008', name: 'Putri Ayu', gender: 'P', birth_date: '2009-06-30', birth_place: 'Depok', class_id: clsXI_A.id, status: 'active', parent_name: 'Dedi Ayu', parent_phone: '081111223000' },
    ];
    const students = [];
    for (const s of studentsData) {
      const [st] = await Student.findOrCreate({ where: { nis: s.nis }, defaults: s });
      students.push(st);
    }
    console.log('Students seeded');

    // Schedules (full weekly for X-A Matematika)
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const times = [
      { start: '07:00', end: '08:30' },
      { start: '08:30', end: '10:00' },
      { start: '10:15', end: '11:45' },
      { start: '12:30', end: '14:00' },
      { start: '14:00', end: '15:30' },
    ];
    for (let i = 0; i < 5; i++) {
      await Schedule.findOrCreate({
        where: { teacher_id: guruSiti.id, class_id: clsX_A.id, subject_id: subjects[0].id, day: days[i], semester_id: sem1.id },
        defaults: { teacher_id: guruSiti.id, class_id: clsX_A.id, subject_id: subjects[0].id, day: days[i], start_time: times[0].start, end_time: times[0].end, semester_id: sem1.id }
      });
      await Schedule.findOrCreate({
        where: { teacher_id: guruRina.id, class_id: clsX_A.id, subject_id: subjects[1].id, day: days[i], semester_id: sem1.id },
        defaults: { teacher_id: guruRina.id, class_id: clsX_A.id, subject_id: subjects[1].id, day: days[i], start_time: times[1].start, end_time: times[1].end, semester_id: sem1.id }
      });
      await Schedule.findOrCreate({
        where: { teacher_id: guruSiti.id, class_id: clsX_B.id, subject_id: subjects[0].id, day: days[i], semester_id: sem1.id },
        defaults: { teacher_id: guruSiti.id, class_id: clsX_B.id, subject_id: subjects[0].id, day: days[i], start_time: times[2].start, end_time: times[2].end, semester_id: sem1.id }
      });
      await Schedule.findOrCreate({
        where: { teacher_id: guruAhmad.id, class_id: clsX_A.id, subject_id: subjects[2].id, day: days[i], semester_id: sem1.id },
        defaults: { teacher_id: guruAhmad.id, class_id: clsX_A.id, subject_id: subjects[2].id, day: days[i], start_time: times[3].start, end_time: times[3].end, semester_id: sem1.id }
      });
      await Schedule.findOrCreate({
        where: { teacher_id: guruDewi.id, class_id: clsX_A.id, subject_id: subjects[3].id, day: days[i], semester_id: sem1.id },
        defaults: { teacher_id: guruDewi.id, class_id: clsX_A.id, subject_id: subjects[3].id, day: days[i], start_time: times[4].start, end_time: times[4].end, semester_id: sem1.id }
      });
    }
    console.log('Schedules seeded');

    // Teaching Journals (multiple entries)
    const journalEntries = [
      { teacher_id: guruSiti.id, class_id: clsX_A.id, subject_id: subjects[0].id, date: '2025-07-15', material: 'Aljabar - Persamaan Linear', method: 'Ceramah & Latihan', notes: 'Siswa antusias', status: 'approved' },
      { teacher_id: guruSiti.id, class_id: clsX_A.id, subject_id: subjects[0].id, date: '2025-07-16', material: 'Fungsi dan Grafik', method: 'Diskusi Kelompok', notes: 'Perlu pengulangan', status: 'approved' },
      { teacher_id: guruSiti.id, class_id: clsX_A.id, subject_id: subjects[0].id, date: '2025-07-17', material: 'Matematika Dasar - Bilangan', method: 'Ceramah Interaktif', notes: 'Hasil belajar baik', status: 'submitted' },
      { teacher_id: guruSiti.id, class_id: clsX_B.id, subject_id: subjects[0].id, date: '2025-07-15', material: 'Aljabar Dasar', method: 'Ceramah', notes: 'Kelas lancar', status: 'approved' },
      { teacher_id: guruSiti.id, class_id: clsX_B.id, subject_id: subjects[0].id, date: '2025-07-16', material: 'Persamaan Kuadrat', method: 'Praktikum', notes: 'Siswa perlu bimbingan', status: 'approved' },
      { teacher_id: guruRina.id, class_id: clsX_A.id, subject_id: subjects[1].id, date: '2025-07-15', material: 'Teks Eksposisi', method: 'Diskusi', notes: 'Aktif', status: 'approved' },
      { teacher_id: guruRina.id, class_id: clsX_A.id, subject_id: subjects[1].id, date: '2025-07-17', material: 'Cerpen Indonesia', method: 'Reading & Writing', notes: 'Kreatif', status: 'draft' },
      { teacher_id: guruAhmad.id, class_id: clsX_A.id, subject_id: subjects[2].id, date: '2025-07-15', material: 'Greetings and Introductions', method: 'Role Play', notes: 'Fun learning', status: 'approved' },
      { teacher_id: guruDewi.id, class_id: clsX_A.id, subject_id: subjects[3].id, date: '2025-07-16', material: 'Gerak Lurus', method: 'Demonstrasi', notes: 'Praktikum berhasil', status: 'submitted' },
      { teacher_id: guruSiti.id, class_id: clsX_A.id, subject_id: subjects[0].id, date: '2025-07-18', material: 'Sistem Persamaan Linear Dua Variabel', method: 'Ceramah dan Diskusi', notes: 'Siswa cukup antusias', status: 'submitted' },
    ];
    for (const j of journalEntries) {
      await TeachingJournal.findOrCreate({
        where: { teacher_id: j.teacher_id, class_id: j.class_id, subject_id: j.subject_id, date: j.date },
        defaults: j
      });
    }
    console.log('Teaching journals seeded');

    // BK Cases
    const bkCasesData = [
      { student_id: students[0].id, counselor_id: guruAhmad.id, case_type: 'counseling', title: 'Motivasi Belajar Rendah', description: 'Rizki menunjukkan penurunan motivasi belajar dalam 2 minggu terakhir', date: '2025-07-15', priority: 'medium', status: 'in_progress' },
      { student_id: students[1].id, counselor_id: guruAhmad.id, case_type: 'violation', title: 'Terlambat Masuk Kelas', description: 'Anisa tercatat terlambat 3 kali dalam seminggu', date: '2025-07-14', priority: 'low', status: 'resolved' },
      { student_id: students[2].id, counselor_id: guruAhmad.id, case_type: 'counseling', title: 'Konflik dengan Teman', description: 'Dimas memiliki konflik dengan salah satu teman sekelas', date: '2025-07-16', priority: 'high', status: 'open' },
      { student_id: students[3].id, counselor_id: guruAhmad.id, case_type: 'achievement', title: 'Juara Olimpiade Matematika Tingkat Kabupaten', description: 'Salsa berhasil meraih juara 2 olimpiade matematika', date: '2025-07-10', priority: 'low', status: 'closed' },
      { student_id: students[0].id, counselor_id: guruAhmad.id, case_type: 'violation', title: 'Tidak Mengerjakan PR', description: 'Rizki tidak mengerjakan PR selama 2 minggu berturut-turut', date: '2025-07-17', priority: 'medium', status: 'open' },
      { student_id: students[4].id, counselor_id: guruAhmad.id, case_type: 'counseling', title: 'Adaptasi Siswa Baru', description: 'Fajar masih dalam masa adaptasi setelah pindahan dari sekolah lain', date: '2025-07-12', priority: 'medium', status: 'in_progress' },
    ];
    const bkCases = [];
    for (const c of bkCasesData) {
      const [bkCase] = await BkCase.findOrCreate({
        where: { student_id: c.student_id, title: c.title },
        defaults: c
      });
      bkCases.push(bkCase);
    }
    console.log('BK cases seeded');

    // BK Counseling Notes
    const notesData = [
      { case_id: bkCases[0].id, counselor_id: guruAhmad.id, note: 'Sesi konseling pertama: Rizki merasa tertekan dengan target orang tua', action_taken: 'Memberikan motivasi dan strategi belajar', next_steps: 'Follow up dalam 1 minggu', date: '2025-07-15' },
      { case_id: bkCases[0].id, counselor_id: guruAhmad.id, note: 'Rizki mulai menunjukkan perbaikan', action_taken: 'Koordinasi dengan wali kelas dan guru mapel', next_steps: 'Monitor perkembangan', date: '2025-07-17' },
      { case_id: bkCases[2].id, counselor_id: guruAhmad.id, note: 'Mediasi antara Dimas dan temannya', action_taken: 'Mediasi dan pembinaan', next_steps: 'Evaluasi dalam 3 hari', date: '2025-07-16' },
    ];
    for (const n of notesData) {
      await BkCounselingNote.findOrCreate({
        where: { case_id: n.case_id, date: n.date },
        defaults: n
      });
    }
    console.log('BK counseling notes seeded');

    // Student Violations
    const violationsData = [
      { student_id: students[0].id, reported_by: guruSiti.id, violation_type: 'Terlambat', description: 'Terlambat masuk kelas 15 menit', date: '2025-07-15', punishment: 'Teguran lisan', status: 'processed' },
      { student_id: students[2].id, reported_by: guruRina.id, violation_type: 'Tidak Mengerjakan PR', description: 'Tidak membawa PR Bahasa Indonesia', date: '2025-07-16', punishment: 'Mengarang 500 kata', status: 'processed' },
      { student_id: students[4].id, reported_by: guruSiti.id, violation_type: 'Rambut Panjang', description: 'Rambut tidak sesuai peraturan sekolah', date: '2025-07-17', punishment: 'Teguran tertulis', status: 'pending' },
    ];
    for (const v of violationsData) {
      await StudentViolation.findOrCreate({
        where: { student_id: v.student_id, violation_type: v.violation_type, date: v.date },
        defaults: v
      });
    }
    console.log('Violations seeded');

    // Student Achievements
    const achievementsData = [
      { student_id: students[1].id, awarded_by: guruSiti.id, title: 'Juara 1 Lomba Matematika Tingkat Sekolah', description: 'Meraih juara 1 dalam lomba matematika tingkat sekolah', date: '2025-06-20', level: 'school' },
      { student_id: students[3].id, awarded_by: guruRina.id, title: 'Juara 2 Olimpiade Matematika Kabupaten', description: 'Meraih juara 2 olimpiade matematika tingkat kabupaten', date: '2025-07-05', level: 'regional' },
      { student_id: students[0].id, awarded_by: guruDewi.id, title: 'Siswa Berprestasi Bulan Juni', description: 'Dipilih sebagai siswa berprestasi bulan Juni', date: '2025-06-30', level: 'school' },
    ];
    for (const a of achievementsData) {
      await StudentAchievement.findOrCreate({
        where: { student_id: a.student_id, title: a.title },
        defaults: a
      });
    }
    console.log('Achievements seeded');

    // Attendance (multiple days for X-A students)
    const attendanceDates = ['2025-07-14', '2025-07-15', '2025-07-16', '2025-07-17', '2025-07-18'];
    const x_a_students = students.filter(s => s.class_id === clsX_A.id);
    const statuses = ['present', 'present', 'present', 'late', 'sick'];
    for (const date of attendanceDates) {
      for (let i = 0; i < x_a_students.length; i++) {
        const statusIdx = (i + attendanceDates.indexOf(date)) % statuses.length;
        await Attendance.findOrCreate({
          where: { student_id: x_a_students[i].id, date },
          defaults: { student_id: x_a_students[i].id, date, status: statuses[statusIdx], recorded_by: guruSiti.id, notes: '' }
        });
      }
    }
    console.log('Attendance seeded');

    // Grades
    const gradeEntries = [];
    for (const student of students) {
      for (const subj of subjects.slice(0, 5)) {
        const quiz = Math.floor(Math.random() * 30) + 70;
        const assignment = Math.floor(Math.random() * 30) + 70;
        const mid = Math.floor(Math.random() * 30) + 65;
        const final = Math.floor(Math.random() * 30) + 65;
        const avg = ((quiz + assignment + mid + final) / 4).toFixed(2);
        let letter = 'E';
        if (avg >= 90) letter = 'A';
        else if (avg >= 80) letter = 'B';
        else if (avg >= 70) letter = 'C';
        else if (avg >= 60) letter = 'D';

        await Grade.findOrCreate({
          where: { student_id: student.id, subject_id: subj.id, semester_id: sem1.id },
          defaults: {
            student_id: student.id, subject_id: subj.id, teacher_id: guruSiti.id, semester_id: sem1.id,
            quiz_score: quiz, assignment_score: assignment, mid_exam_score: mid, final_exam_score: final,
            final_score: avg, grade_letter: letter, status: 'approved'
          }
        });
      }
    }
    console.log('Grades seeded');

    console.log('\n=== SEMUA DATA BERHASIL DISEED ===');
    console.log('\nAkun Login:');
    console.log('Admin       : admin@sekolah.test / password123');
    console.log('Kepsek      : kepsek@sekolah.test / password123');
    console.log('Guru        : guru@sekolah.test / password123');
    console.log('Guru 2      : guru2@sekolah.test / password123');
    console.log('Guru BK     : bk@sekolah.test / password123');
    console.log('Wali Kelas  : walikelas@sekolah.test / password123');
    console.log('Siswa       : siswa@sekolah.test / password123');
    console.log('Siswa 2     : siswa2@sekolah.test / password123');
    console.log('Orang Tua   : ortu@sekolah.test / password123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
