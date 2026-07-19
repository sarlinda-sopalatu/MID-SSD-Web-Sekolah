const { Teacher, ActivityLog } = require('../models');

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      order: [['name', 'ASC']]
    });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.create(req.body);

    await ActivityLog.create({
      user_id: req.user.id,
      action: 'create_teacher',
      module: 'teacher_management',
      description: `Created teacher: ${teacher.name}`
    });

    res.status(201).json({ message: 'Teacher created successfully', teacher });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    await teacher.update(req.body);

    await ActivityLog.create({
      user_id: req.user.id,
      action: 'update_teacher',
      module: 'teacher_management',
      description: `Updated teacher: ${teacher.name}`
    });

    res.json({ message: 'Teacher updated successfully', teacher });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    await teacher.destroy();

    await ActivityLog.create({
      user_id: req.user.id,
      action: 'delete_teacher',
      module: 'teacher_management',
      description: `Deleted teacher: ${teacher.name}`
    });

    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
