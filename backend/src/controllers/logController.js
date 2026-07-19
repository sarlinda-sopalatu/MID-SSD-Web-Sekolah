const { ActivityLog, User, Role } = require('../models');

exports.getAllLogs = async (req, res) => {
  try {
    const { user_id, module, action, page = 1, limit = 50 } = req.query;
    const where = {};

    if (user_id) where.user_id = user_id;
    if (module) where.module = module;
    if (action) where.action = action;

    const offset = (page - 1) * limit;
    const { count, rows } = await ActivityLog.findAndCountAll({
      where,
      include: [{ model: User, attributes: ['id', 'name', 'email'], include: [{ model: Role, attributes: ['name'] }] }],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      logs: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getLogsByUser = async (req, res) => {
  try {
    const logs = await ActivityLog.findAll({
      where: { user_id: req.params.userId },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']],
      limit: 100
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createLog = async (req, res) => {
  try {
    const log = await ActivityLog.create({
      user_id: req.user.id,
      ...req.body
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
