const { Grade, Student, Subject, Teacher, Semester, ActivityLog } = require('../models');

exports.getAllGrades = async (req, res) => {
  try {
    const { student_id, subject_id, semester_id, page = 1, limit = 20 } = req.query;
    const where = {};

    if (student_id) where.student_id = student_id;
    if (subject_id) where.subject_id = subject_id;
    if (semester_id) where.semester_id = semester_id;

    const offset = (page - 1) * limit;
    const { count, rows } = await Grade.findAndCountAll({
      where,
      include: [
        { model: Student, attributes: ['id', 'name', 'nis'] },
        { model: Subject, attributes: ['id', 'name'] },
        { model: Teacher, attributes: ['id', 'name'] },
        { model: Semester, attributes: ['id', 'name'] }
      ],
      limit: parseInt(limit),
      offset,
      order: [['student_id', 'ASC']]
    });

    res.json({
      grades: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createGrade = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });

    const { quiz_score, assignment_score, mid_exam_score, final_exam_score } = req.body;
    const scores = [quiz_score, assignment_score, mid_exam_score, final_exam_score].filter(s => s != null);
    const final_score = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

    let grade_letter = null;
    if (final_score !== null) {
      if (final_score >= 90) grade_letter = 'A';
      else if (final_score >= 80) grade_letter = 'B';
      else if (final_score >= 70) grade_letter = 'C';
      else if (final_score >= 60) grade_letter = 'D';
      else grade_letter = 'E';
    }

    const grade = await Grade.create({
      ...req.body,
      teacher_id: teacher?.id || req.body.teacher_id,
      final_score,
      grade_letter
    });

    await ActivityLog.create({
      user_id: req.user.id,
      action: 'create_grade',
      module: 'nilai',
      description: `Recorded grade for student #${req.body.student_id}`
    });

    res.status(201).json({ message: 'Grade recorded', grade });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateGrade = async (req, res) => {
  try {
    const grade = await Grade.findByPk(req.params.id);

    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    const scores = [req.body.quiz_score, req.body.assignment_score, req.body.mid_exam_score, req.body.final_exam_score]
      .filter(s => s != null);
    const final_score = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : grade.final_score;

    let grade_letter = grade.grade_letter;
    if (final_score !== null) {
      if (final_score >= 90) grade_letter = 'A';
      else if (final_score >= 80) grade_letter = 'B';
      else if (final_score >= 70) grade_letter = 'C';
      else if (final_score >= 60) grade_letter = 'D';
      else grade_letter = 'E';
    }

    await grade.update({ ...req.body, final_score, grade_letter });

    await ActivityLog.create({
      user_id: req.user.id,
      action: 'update_grade',
      module: 'nilai',
      description: `Updated grade #${grade.id}`
    });

    res.json({ message: 'Grade updated', grade });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getStudentGrades = async (req, res) => {
  try {
    const { student_id } = req.params;
    const { semester_id } = req.query;

    const where = { student_id };
    if (semester_id) where.semester_id = semester_id;

    const grades = await Grade.findAll({
      where,
      include: [
        { model: Subject, attributes: ['id', 'name'] },
        { model: Semester, attributes: ['id', 'name'] }
      ],
      order: [['subject_id', 'ASC']]
    });

    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
