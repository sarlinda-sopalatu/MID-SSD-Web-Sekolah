const { Schedule, Teacher, Class, Subject, Semester } = require('../models');

exports.getAllSchedules = async (req, res) => {
  try {
    const { class_id, teacher_id, day, semester_id } = req.query;
    const where = {};

    if (class_id) where.class_id = class_id;
    if (teacher_id) where.teacher_id = teacher_id;
    if (day) where.day = day;
    if (semester_id) where.semester_id = semester_id;

    const schedules = await Schedule.findAll({
      where,
      include: [
        { model: Teacher, attributes: ['id', 'name'] },
        { model: Class, attributes: ['id', 'name'] },
        { model: Subject, attributes: ['id', 'name'] },
        { model: Semester, attributes: ['id', 'name'] }
      ],
      order: [['day', 'ASC'], ['start_time', 'ASC']]
    });

    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.create(req.body);
    res.status(201).json({ message: 'Schedule created', schedule });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    await schedule.update(req.body);
    res.json({ message: 'Schedule updated', schedule });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    await schedule.destroy();
    res.json({ message: 'Schedule deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
