const { BkCase, BkCounselingNote, Student, Teacher, StudentViolation, StudentAchievement, ActivityLog } = require('../models');

exports.getAllCases = async (req, res) => {
  try {
    const { student_id, case_type, status, page = 1, limit = 20 } = req.query;
    const where = {};

    if (student_id) where.student_id = student_id;
    if (case_type) where.case_type = case_type;
    if (status) where.status = status;

    if (req.userRole === 'Guru BK') {
      const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });
      if (teacher) where.counselor_id = teacher.id;
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await BkCase.findAndCountAll({
      where,
      include: [
        { model: Student, attributes: ['id', 'name', 'nis'] },
        { model: Teacher, as: 'Counselor', attributes: ['id', 'name'] }
      ],
      limit: parseInt(limit),
      offset,
      order: [['date', 'DESC']]
    });

    res.json({
      cases: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getCaseById = async (req, res) => {
  try {
    const bkCase = await BkCase.findByPk(req.params.id, {
      include: [
        { model: Student, attributes: ['id', 'name', 'nis'] },
        { model: Teacher, as: 'Counselor', attributes: ['id', 'name'] },
        { model: BkCounselingNote }
      ]
    });

    if (!bkCase) {
      return res.status(404).json({ message: 'BK case not found' });
    }

    res.json(bkCase);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createCase = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });

    const bkCase = await BkCase.create({
      ...req.body,
      counselor_id: teacher?.id || req.body.counselor_id
    });

    await ActivityLog.create({
      user_id: req.user.id,
      action: 'create_bk_case',
      module: 'bk',
      description: `Created BK case for student #${req.body.student_id}`
    });

    res.status(201).json({ message: 'BK case created successfully', case: bkCase });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateCase = async (req, res) => {
  try {
    const bkCase = await BkCase.findByPk(req.params.id);

    if (!bkCase) {
      return res.status(404).json({ message: 'BK case not found' });
    }

    await bkCase.update(req.body);

    await ActivityLog.create({
      user_id: req.user.id,
      action: 'update_bk_case',
      module: 'bk',
      description: `Updated BK case #${bkCase.id}`
    });

    res.json({ message: 'BK case updated successfully', case: bkCase });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.addCounselingNote = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });

    const note = await BkCounselingNote.create({
      ...req.body,
      counselor_id: teacher?.id || req.body.counselor_id
    });

    await ActivityLog.create({
      user_id: req.user.id,
      action: 'add_counseling_note',
      module: 'bk',
      description: `Added counseling note for case #${req.body.case_id}`
    });

    res.status(201).json({ message: 'Counseling note added', note });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getStudentRecap = async (req, res) => {
  try {
    const { student_id } = req.params;

    const cases = await BkCase.findAll({
      where: { student_id },
      include: [
        { model: Teacher, as: 'Counselor', attributes: ['id', 'name'] },
        { model: BkCounselingNote }
      ],
      order: [['date', 'DESC']]
    });

    const violations = await StudentViolation.findAll({
      where: { student_id },
      order: [['date', 'DESC']]
    });

    const achievements = await StudentAchievement.findAll({
      where: { student_id },
      order: [['date', 'DESC']]
    });

    res.json({ cases, violations, achievements });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllViolations = async (req, res) => {
  try {
    const { student_id, page = 1, limit = 20 } = req.query;
    const where = {};
    if (student_id) where.student_id = student_id;

    const offset = (page - 1) * limit;
    const { count, rows } = await StudentViolation.findAndCountAll({
      where,
      include: [
        { model: Student, attributes: ['id', 'name', 'nis'] },
        { model: Teacher, as: 'Reporter', attributes: ['id', 'name'] }
      ],
      limit: parseInt(limit),
      offset,
      order: [['date', 'DESC']]
    });

    res.json({ violations: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllAchievements = async (req, res) => {
  try {
    const { student_id, page = 1, limit = 20 } = req.query;
    const where = {};
    if (student_id) where.student_id = student_id;

    const offset = (page - 1) * limit;
    const { count, rows } = await StudentAchievement.findAndCountAll({
      where,
      include: [
        { model: Student, attributes: ['id', 'name', 'nis'] }
      ],
      limit: parseInt(limit),
      offset,
      order: [['date', 'DESC']]
    });

    res.json({ achievements: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createViolation = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });
    const violation = await StudentViolation.create({
      ...req.body,
      reported_by: teacher?.id || req.body.reported_by
    });
    await ActivityLog.create({ user_id: req.user.id, action: 'create', module: 'bk', description: `Recorded violation for student #${req.body.student_id}` });
    res.status(201).json({ message: 'Pelanggaran berhasil dicatat', violation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createAchievement = async (req, res) => {
  try {
    const achievement = await StudentAchievement.create({ ...req.body });
    await ActivityLog.create({ user_id: req.user.id, action: 'create', module: 'bk', description: `Recorded achievement for student #${req.body.student_id}` });
    res.status(201).json({ message: 'Prestasi berhasil dicatat', achievement });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
