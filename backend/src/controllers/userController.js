const bcrypt = require('bcryptjs');
const { User, Role, ActivityLog } = require('../models');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Role, attributes: ['id', 'name'] }],
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Role, attributes: ['id', 'name'] }],
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { email, password, name, role_id } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role_id
    });

    await ActivityLog.create({
      user_id: req.user.id,
      action: 'create_user',
      module: 'user_management',
      description: `Created user: ${user.name}`
    });

    const role = await Role.findByPk(role_id);

    res.status(201).json({
      message: 'User created successfully',
      user: { id: user.id, name: user.name, email: user.email, role: role.name }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email, role_id, is_active } = req.body;

    await user.update({ name, email, role_id, is_active });

    await ActivityLog.create({
      user_id: req.user.id,
      action: 'update_user',
      module: 'user_management',
      description: `Updated user: ${user.name}`
    });

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ is_active: false });

    await ActivityLog.create({
      user_id: req.user.id,
      action: 'deactivate_user',
      module: 'user_management',
      description: `Deactivated user: ${user.name}`
    });

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const defaultPassword = 'password123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    await user.update({ password: hashedPassword });

    await ActivityLog.create({
      user_id: req.user.id,
      action: 'reset_password',
      module: 'user_management',
      description: `Reset password for user: ${user.name}`
    });

    res.json({ message: 'Password reset to default', defaultPassword });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
