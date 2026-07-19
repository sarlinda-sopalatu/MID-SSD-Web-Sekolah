const Role = require('./Role');
const User = require('./User');

exports.seedDatabase = async () => {
  try {
    const roles = await Role.bulkCreate([
      { id: 1, name: 'Admin', description: 'System administrator' },
      { id: 2, name: 'Kepala Sekolah', description: 'School principal' },
      { id: 3, name: 'Guru', description: 'Teacher' },
      { id: 4, name: 'Guru BK', description: 'Counseling teacher' },
      { id: 5, name: 'Wali Kelas', description: 'Homeroom teacher' },
      { id: 6, name: 'Siswa', description: 'Student' },
      { id: 7, name: 'Orang Tua', description: 'Parent' }
    ], { ignoreDuplicates: true });

    const bcrypt = require('bcryptjs');
    const defaultPassword = await bcrypt.hash('password123', 10);

    const users = [
      { email: 'admin@sekolah.test', password: defaultPassword, name: 'Admin Utama', role_id: 1 },
      { email: 'kepsek@sekolah.test', password: defaultPassword, name: 'Dr. Budi Santoso', role_id: 2 },
      { email: 'guru@sekolah.test', password: defaultPassword, name: 'Siti Rahayu, S.Pd', role_id: 3 },
      { email: 'bk@sekolah.test', password: defaultPassword, name: 'Ahmad Fauzi, S.Pd', role_id: 4 },
      { email: 'walikelas@sekolah.test', password: defaultPassword, name: 'Dewi Lestari, S.Pd', role_id: 5 },
      { email: 'siswa@sekolah.test', password: defaultPassword, name: 'Rizki Pratama', role_id: 6 },
      { email: 'ortu@sekolah.test', password: defaultPassword, name: 'Joko Pratama', role_id: 7 }
    ];

    for (const userData of users) {
      await User.findOrCreate({
        where: { email: userData.email },
        defaults: userData
      });
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Seeding error:', error);
  }
};
