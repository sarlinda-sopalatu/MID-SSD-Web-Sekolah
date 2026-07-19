const { Class, AcademicYear, Teacher, ActivityLog } = require('../models');

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.findAll({
      include: [
        { model: AcademicYear, attributes: ['id', 'year'] },
        { model: Teacher, as: 'HomeroomTeacher', attributes: ['id', 'name'] }
      ],
      order: [['grade_level', 'ASC'], ['name', 'ASC']]
    });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const cls = await Class.findByPk(req.params.id, {
      include: [
        { model: AcademicYear, attributes: ['id', 'year'] },
        { model: Teacher, as: 'HomeroomTeacher', attributes: ['id', 'name'] }
      ]
    });

    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json(cls);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createClass = async (req, res) => {
  try {
    const cls = await Class.create(req.body);

    await ActivityLog.create({
      user_id: req.user.id,
      action: 'create_class',
      module: 'kesiswaan',
      description: `Created class: ${cls.name}`
    });

    res.status(201).json({ message: 'Class created successfully', class: cls });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const cls = await Class.findByPk(req.params.id);

    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }

    await cls.update(req.body);

    res.json({ message: 'Class updated successfully', class: cls });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const cls = await Class.findByPk(req.params.id);

    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }

    await cls.destroy();

    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
