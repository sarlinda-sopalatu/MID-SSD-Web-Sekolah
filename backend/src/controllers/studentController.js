const { Student, Class, ActivityLog } = require('../models');

exports.getAllStudents = async (req, res) => {
  try {
    const { class_id, status, search, page = 1, limit = 20 } = req.query;
    const where = {};

    if (class_id) where.class_id = class_id;
    if (status) where.status = status;
    if (search) {
      const { Op } = require('sequelize');
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { nis: { [Op.like]: `%${search}%` } },
        { nisn: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await Student.findAndCountAll({
      where,
      include: [{ model: Class, attributes: ['id', 'name'] }],
      limit: parseInt(limit),
      offset,
      order: [['name', 'ASC']]
    });

    res.json({
      students: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [{ model: Class, attributes: ['id', 'name'] }]
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);

    await ActivityLog.create({
      user_id: req.user.id,
      action: 'create_student',
      module: 'kesiswaan',
      description: `Created student: ${student.name}`
    });

    res.status(201).json({ message: 'Student created successfully', student });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.update(req.body);

    await ActivityLog.create({
      user_id: req.user.id,
      action: 'update_student',
      module: 'kesiswaan',
      description: `Updated student: ${student.name}`
    });

    res.json({ message: 'Student updated successfully', student });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.update({ status: 'dropped' });

    await ActivityLog.create({
      user_id: req.user.id,
      action: 'delete_student',
      module: 'kesiswaan',
      description: `Deactivated student: ${student.name}`
    });

    res.json({ message: 'Student deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.importStudents = async (req, res) => {
  try {
    const { students } = req.body;

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: 'No students data provided' });
    }

    const created = await Student.bulkCreate(students);

    await ActivityLog.create({
      user_id: req.user.id,
      action: 'import_students',
      module: 'kesiswaan',
      description: `Imported ${created.length} students`
    });

    res.status(201).json({ message: `${created.length} students imported`, students: created });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.exportStudents = async (req, res) => {
  try {
    const { class_id, status } = req.query;
    const where = {};
    if (class_id) where.class_id = class_id;
    if (status) where.status = status;

    const students = await Student.findAll({
      where,
      include: [{ model: Class, attributes: ['id', 'name'] }],
      order: [['name', 'ASC']]
    });

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
