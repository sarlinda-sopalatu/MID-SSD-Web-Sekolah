const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { AcademicYear, Semester } = require('../models');

router.get('/years', auth, async (req, res) => {
  try {
    const years = await AcademicYear.findAll({ order: [['year', 'DESC']] });
    res.json(years);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/years', auth, async (req, res) => {
  try {
    const year = await AcademicYear.create(req.body);
    res.status(201).json(year);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/years/:id', auth, async (req, res) => {
  try {
    const year = await AcademicYear.findByPk(req.params.id);
    if (!year) return res.status(404).json({ message: 'Year not found' });
    await year.update(req.body);
    res.json(year);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/semesters', auth, async (req, res) => {
  try {
    const semesters = await Semester.findAll({
      include: [{ model: AcademicYear, attributes: ['id', 'year'] }],
      order: [['semester_number', 'ASC']]
    });
    res.json(semesters);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/semesters', auth, async (req, res) => {
  try {
    const semester = await Semester.create(req.body);
    res.status(201).json(semester);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
