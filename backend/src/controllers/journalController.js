const { TeachingJournal, Teacher, Class, Subject, ActivityLog, User } = require('../models');
const { sendNotification } = require('./notificationController');

exports.getAllJournals = async (req, res) => {
  try {
    const { teacher_id, class_id, subject_id, date, status, page = 1, limit = 20 } = req.query;
    const where = {};

    if (teacher_id) where.teacher_id = teacher_id;
    if (class_id) where.class_id = class_id;
    if (subject_id) where.subject_id = subject_id;
    if (date) where.date = date;
    if (status) where.status = status;

    if (req.userRole === 'Guru') {
      const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });
      if (teacher) where.teacher_id = teacher.id;
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await TeachingJournal.findAndCountAll({
      where,
      include: [
        { model: Teacher, attributes: ['id', 'name'] },
        { model: Class, attributes: ['id', 'name'] },
        { model: Subject, attributes: ['id', 'name'] }
      ],
      limit: parseInt(limit),
      offset,
      order: [['date', 'DESC']]
    });

    res.json({ journals: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getJournalById = async (req, res) => {
  try {
    const journal = await TeachingJournal.findByPk(req.params.id, {
      include: [
        { model: Teacher, attributes: ['id', 'name'] },
        { model: Class, attributes: ['id', 'name'] },
        { model: Subject, attributes: ['id', 'name'] }
      ]
    });
    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    res.json(journal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createJournal = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });
    const journal = await TeachingJournal.create({
      ...req.body,
      teacher_id: teacher?.id || req.body.teacher_id,
      status: 'draft'
    });
    await ActivityLog.create({ user_id: req.user.id, action: 'create', module: 'journals', description: `Membuat jurnal mengajar tanggal ${req.body.date}` });
    res.status(201).json({ message: 'Journal created successfully', journal });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateJournal = async (req, res) => {
  try {
    const journal = await TeachingJournal.findByPk(req.params.id, {
      include: [{ model: Teacher, attributes: ['id', 'name', 'user_id'] }]
    });
    if (!journal) return res.status(404).json({ message: 'Journal not found' });

    if (req.userRole === 'Guru') {
      const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });
      if (teacher && journal.teacher_id !== teacher.id) {
        return res.status(403).json({ message: 'Not authorized to edit this journal' });
      }
    }

    const oldStatus = journal.status;
    await journal.update(req.body);
    await ActivityLog.create({ user_id: req.user.id, action: 'update', module: 'journals', description: `Update jurnal #${journal.id}` });

    // Notifikasi: jika status berubah ke submitted -> kirim ke Kepala Sekolah
    if (req.body.status === 'submitted' && oldStatus !== 'submitted') {
      const kepsekUsers = await User.findAll({ include: [{ model: require('../models').Role, where: { name: 'Kepala Sekolah' } }] });
      for (const ks of kepsekUsers) {
        await sendNotification(ks.id, 'Jurnal Mengajar Baru', `${journal.Teacher?.name || 'Guru'} mengirim jurnal tanggal ${journal.date} untuk disetujui`, 'info', '/journals');
      }
      // Juga notif ke Admin
      const adminUsers = await User.findAll({ include: [{ model: require('../models').Role, where: { name: 'Admin' } }] });
      for (const admin of adminUsers) {
        await sendNotification(admin.id, 'Jurnal Menunggu Persetujuan', `${journal.Teacher?.name || 'Guru'} mengirim jurnal tanggal ${journal.date}`, 'info', '/journals');
      }
    }

    // Notifikasi: jika diapprove -> kirim ke guru pemilik jurnal
    if (req.body.status === 'approved' && oldStatus !== 'approved') {
      if (journal.Teacher?.user_id) {
        await sendNotification(journal.Teacher.user_id, 'Jurnal Disetujui', `Jurnal Anda tanggal ${journal.date} telah disetujui`, 'success', '/journals');
      }
    }

    res.json({ message: 'Journal updated successfully', journal });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteJournal = async (req, res) => {
  try {
    const journal = await TeachingJournal.findByPk(req.params.id);
    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    await journal.destroy();
    await ActivityLog.create({ user_id: req.user.id, action: 'delete', module: 'journals', description: `Hapus jurnal #${req.params.id}` });
    res.json({ message: 'Journal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getJournalRecap = async (req, res) => {
  try {
    const { teacher_id, class_id, month, year } = req.query;
    const where = {};
    if (teacher_id) where.teacher_id = teacher_id;
    if (class_id) where.class_id = class_id;
    if (month && year) {
      const { Op } = require('sequelize');
      where.date = { [Op.and]: [{ [Op.gte]: `${year}-${String(month).padStart(2, '0')}-01` }, { [Op.lt]: `${year}-${String(parseInt(month) + 1).padStart(2, '0')}-01` }] };
    }
    const journals = await TeachingJournal.findAll({ where, include: [{ model: Teacher }, { model: Class }, { model: Subject }], order: [['date', 'DESC']] });
    res.json(journals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
