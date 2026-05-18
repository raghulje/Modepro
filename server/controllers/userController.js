const { User } = require('../models');
const { hashPassword } = require('../utils/password');
const status = require('../helpers/response');

// Get all users
exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['passwordHash'] },
      order: [['createdAt', 'DESC']]
    });
    return status.successResponse(res, "Retrieved", users);
  } catch (error) {
    console.error('Get Users Error:', error);
    return status.errorResponse(res, error.message);
  }
};

// Get user by ID
exports.getById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['passwordHash'] }
    });
    if (!user) {
      return status.notFoundResponse(res, "User not found");
    }
    return status.successResponse(res, "Retrieved", user);
  } catch (error) {
    console.error('Get User Error:', error);
    return status.errorResponse(res, error.message);
  }
};

// Create user
exports.create = async (req, res) => {
  try {
    const { username, email, password, fullName, role, permissions } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return status.badRequestResponse(res, "Username, email, and password are required");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { email } 
    });
    if (existingUser) {
      return status.badRequestResponse(res, "Email already registered");
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ 
      where: { username } 
    });
    if (existingUsername) {
      return status.badRequestResponse(res, "Username already taken");
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await User.create({
      username,
      email,
      passwordHash,
      fullName: fullName || null,
      role: role || 'editor',
      isActive: true,
      permissions: permissions || null
    });

    // Return user without password
    const userResponse = user.toJSON();
    delete userResponse.passwordHash;

    return status.createdResponse(res, "User created successfully", userResponse);
  } catch (error) {
    console.error('Create User Error:', error);
    return status.errorResponse(res, error.message);
  }
};

// Update user
exports.update = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return status.notFoundResponse(res, "User not found");
    }

    const { username, email, fullName, role, isActive, password, permissions } = req.body;

    // Check if email is being changed and already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return status.badRequestResponse(res, "Email already registered");
      }
    }

    // Check if username is being changed and already exists
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ where: { username } });
      if (existingUsername) {
        return status.badRequestResponse(res, "Username already taken");
      }
    }

    // Update user fields
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (fullName !== undefined) updateData.fullName = fullName;
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (permissions !== undefined) updateData.permissions = permissions; // Can be null to reset to role defaults
    
    // Update password if provided
    if (password) {
      updateData.passwordHash = await hashPassword(password);
    }

    await user.update(updateData);

    // Return user without password
    const userResponse = user.toJSON();
    delete userResponse.passwordHash;

    return status.successResponse(res, "User updated successfully", userResponse);
  } catch (error) {
    console.error('Update User Error:', error);
    return status.errorResponse(res, error.message);
  }
};

// Delete user
exports.delete = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return status.notFoundResponse(res, "User not found");
    }

    // Prevent deleting yourself
    if (req.user && req.user.id === parseInt(req.params.id)) {
      return status.badRequestResponse(res, "Cannot delete your own account");
    }

    await user.destroy();
    return status.successResponse(res, "User deleted successfully");
  } catch (error) {
    console.error('Delete User Error:', error);
    return status.errorResponse(res, error.message);
  }
};

