const { Attendance, Student, Schedule, Teacher, ActivityLog } = require('../models');

exports.getAllAttendance = async (req, res) => {
  try {
    const { student_id, date, class_id, status, page = 1, limit = 20 } = req.query;
    const where = {};

    if (student_id) where.student_id = student_id;
    if (date) where.date = date;
    if (status) where.status = status;

    const offset = (page - 1) * limit;

    let include = [
      { model: Student, attributes: ['id', 'name', 'nis'] }
    ];

    if (class_id) {
      include[0].where = { class_id };
    }

    const { count, rows } = await Attendance.findAndCountAll({
      where,
      include,
      limit: parseInt(limit),
      offset,
      order: [['date', 'DESC']]
    });

    res.json({
      attendance: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createAttendance = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });

    const attendance = await Attendance.create({
      ...req.body,
      recorded_by: teacher?.id || req.body.recorded_by
    });

    await ActivityLog.create({
      user_id: req.user.id,
      action: 'create_attendance',
      module: 'absensi',
      description: `Recorded attendance for student #${req.body.student_id}`
    });

    res.status(201).json({ message: 'Attendance recorded', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.bulkCreateAttendance = async (req, res) => {
  try {
    const { attendance_records } = req.body;

    if (!Array.isArray(attendance_records) || attendance_records.length === 0) {
      return res.status(400).json({ message: 'No attendance data provided' });
    }

    const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });

    const records = attendance_records.map(record => ({
      ...record,
      recorded_by: teacher?.id || record.recorded_by
    }));

    const created = await Attendance.bulkCreate(records);

    await ActivityLog.create({
      user_id: req.user.id,
      action: 'bulk_create_attendance',
      module: 'absensi',
      description: `Bulk recorded ${created.length} attendance records`
    });

    res.status(201).json({ message: `${created.length} attendance records created`, attendance: created });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getStudentAttendanceReport = async (req, res) => {
  try {
    const { student_id } = req.params;
    const { month, year } = req.query;

    const where = { student_id };
    if (month && year) {
      const { Op } = require('sequelize');
      where.date = {
        [Op.and]: [
          { [Op.gte]: `${year}-${String(month).padStart(2, '0')}-01` },
          { [Op.lt]: `${year}-${String(parseInt(month) + 1).padStart(2, '0')}-01` }
        ]
      };
    }

    const attendance = await Attendance.findAll({
      where,
      order: [['date', 'ASC']]
    });

    const summary = {
      present: attendance.filter(a => a.status === 'present').length,
      absent: attendance.filter(a => a.status === 'absent').length,
      late: attendance.filter(a => a.status === 'late').length,
      sick: attendance.filter(a => a.status === 'sick').length,
      excused: attendance.filter(a => a.status === 'excused').length,
      total: attendance.length
    };

    res.json({ attendance, summary });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
