const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/', auth, journalController.getAllJournals);
router.get('/recap', auth, journalController.getJournalRecap);
router.get('/:id', auth, journalController.getJournalById);
router.post('/', auth, authorize('Admin', 'Guru', 'Wali Kelas'), journalController.createJournal);
router.put('/:id', auth, authorize('Admin', 'Guru'), journalController.updateJournal);
router.delete('/:id', auth, authorize('Admin'), journalController.deleteJournal);

module.exports = router;
