const { Notification, User } = require('../models');

// GET semua notifikasi milik user yang login
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 30
    });
    const unreadCount = notifications.filter(n => !n.is_read).length;
    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST tandai satu notifikasi sebagai dibaca
exports.markAsRead = async (req, res) => {
  try {
    await Notification.update({ is_read: true }, { where: { id: req.params.id, user_id: req.user.id } });
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST tandai semua sebagai dibaca
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.update({ is_read: true }, { where: { user_id: req.user.id } });
    res.json({ message: 'All marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Utility: kirim notifikasi ke user tertentu (dipanggil dari controller lain)
exports.sendNotification = async (userId, title, message, type = 'info', link = null) => {
  try {
    await Notification.create({ user_id: userId, title, message, type, link });
  } catch (error) {
    console.error('Failed to send notification:', error.message);
  }
};
