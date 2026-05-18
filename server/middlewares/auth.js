const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');
const status = require('../helpers/response');

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return status.unauthorizedResponse(res, 'No token provided');
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return status.unauthorizedResponse(res, 'Invalid or expired token');
    }

    // Get user from database
    const user = await User.findByPk(decoded.id);

    if (!user || !user.isActive) {
      return status.unauthorizedResponse(res, 'User not found or inactive');
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return status.errorResponse(res, 'Authentication failed', 500);
  }
};

// Optional authentication - doesn't fail if no token, but sets req.user if valid token exists
exports.optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided - continue without authentication
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      // Invalid token - continue without authentication
      req.user = null;
      return next();
    }

    // Get user from database
    const user = await User.findByPk(decoded.id);

    if (!user || !user.isActive) {
      // User not found or inactive - continue without authentication
      req.user = null;
      return next();
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    // On any error, continue without authentication
    req.user = null;
    next();
  }
};

exports.requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return status.unauthorizedResponse(res, 'Authentication required');
    }

    // Get role from user - handle Sequelize dataValues if needed
    const userRole = req.user.role || (req.user.dataValues && req.user.dataValues.role) || null;
    
    // Flatten allowedRoles array (handle nested arrays from spread operator)
    const flattenedRoles = allowedRoles.flat(Infinity);
    
    if (!userRole) {
      console.error('User role is missing:', req.user);
      return status.forbiddenResponse(res, 'User role not found');
    }

    // Check if user role is in allowed roles (case-insensitive comparison)
    const normalizedUserRole = String(userRole).toLowerCase().trim();
    const normalizedAllowedRoles = flattenedRoles.map(r => String(r).toLowerCase().trim());
    
    // Only log if access is denied (for debugging)
    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
      console.warn('Authorization denied:', {
        userId: req.user.id,
        userEmail: req.user.email,
        userRole: userRole,
        requiredRoles: flattenedRoles.join(' or ')
      });
      return status.forbiddenResponse(res, `Insufficient permissions. Required: ${flattenedRoles.join(' or ')}, Your role: ${userRole}`);
    }

    next();
  };
};

// Alias for requireRole for better readability
exports.authorize = exports.requireRole;

// Default permissions based on roles
const defaultRolePermissions = {
  super_admin: {
    home: { view: true, edit: true, delete: true },
    'header-footer': { view: true, edit: true, delete: true },
    about: { view: true, edit: true, delete: true },
    products: { view: true, edit: true, delete: true },
    awards: { view: true, edit: true, delete: true },
    careers: { view: true, edit: true, delete: true },
    specialties: { view: true, edit: true, delete: true },
    investors: { view: true, edit: true, delete: true },
    clients: { view: true, edit: true, delete: true },
    management: { view: true, edit: true, delete: true },
    presence: { view: true, edit: true, delete: true },
    production: { view: true, edit: true, delete: true },
    quality: { view: true, edit: true, delete: true },
    demo: { view: true, edit: true, delete: true },
    contact: { view: true, edit: true, delete: true },
    'contact-info': { view: true, edit: true, delete: true },
    'global-settings': { view: true, edit: true, delete: true },
    'social-links': { view: true, edit: true, delete: true },
    testimonials: { view: true, edit: true, delete: true },
    users: { view: true, edit: true, delete: true },
    smtp: { view: true, edit: true, delete: true },
    logs: { view: true, edit: true, delete: true },
    bin: { view: true, edit: true, delete: true },
    versions: { view: true, edit: true, delete: true }
  },
  admin: {
    home: { view: true, edit: true, delete: true },
    'header-footer': { view: true, edit: true, delete: false },
    about: { view: true, edit: true, delete: true },
    products: { view: true, edit: true, delete: true },
    awards: { view: true, edit: true, delete: true },
    careers: { view: true, edit: true, delete: true },
    specialties: { view: true, edit: true, delete: true },
    investors: { view: true, edit: true, delete: true },
    clients: { view: true, edit: true, delete: true },
    management: { view: true, edit: true, delete: true },
    presence: { view: true, edit: true, delete: true },
    production: { view: true, edit: true, delete: true },
    quality: { view: true, edit: true, delete: true },
    demo: { view: true, edit: true, delete: true },
    contact: { view: true, edit: true, delete: true },
    'contact-info': { view: true, edit: true, delete: false },
    'global-settings': { view: true, edit: false, delete: false },
    'social-links': { view: true, edit: true, delete: false },
    testimonials: { view: true, edit: true, delete: true },
    users: { view: true, edit: true, delete: false },
    smtp: { view: true, edit: false, delete: false },
    logs: { view: true, edit: false, delete: false },
    bin: { view: true, edit: false, delete: false },
    versions: { view: true, edit: false, delete: false }
  },
  editor: {
    home: { view: true, edit: true, delete: false },
    'header-footer': { view: true, edit: false, delete: false },
    about: { view: true, edit: true, delete: false },
    products: { view: true, edit: true, delete: false },
    awards: { view: true, edit: true, delete: false },
    careers: { view: true, edit: true, delete: false },
    specialties: { view: true, edit: true, delete: false },
    investors: { view: true, edit: true, delete: false },
    clients: { view: true, edit: true, delete: false },
    management: { view: true, edit: true, delete: false },
    presence: { view: true, edit: true, delete: false },
    production: { view: true, edit: true, delete: false },
    quality: { view: true, edit: true, delete: false },
    demo: { view: true, edit: true, delete: false },
    contact: { view: true, edit: true, delete: false },
    'contact-info': { view: true, edit: true, delete: false },
    'global-settings': { view: false, edit: false, delete: false },
    'social-links': { view: true, edit: true, delete: false },
    testimonials: { view: true, edit: true, delete: false },
    users: { view: false, edit: false, delete: false },
    smtp: { view: false, edit: false, delete: false },
    logs: { view: false, edit: false, delete: false },
    bin: { view: false, edit: false, delete: false },
    versions: { view: false, edit: false, delete: false }
  },
  viewer: {
    home: { view: true, edit: false, delete: false },
    'header-footer': { view: true, edit: false, delete: false },
    about: { view: true, edit: false, delete: false },
    products: { view: true, edit: false, delete: false },
    awards: { view: true, edit: false, delete: false },
    careers: { view: true, edit: false, delete: false },
    specialties: { view: true, edit: false, delete: false },
    investors: { view: true, edit: false, delete: false },
    clients: { view: true, edit: false, delete: false },
    management: { view: true, edit: false, delete: false },
    presence: { view: true, edit: false, delete: false },
    production: { view: true, edit: false, delete: false },
    quality: { view: true, edit: false, delete: false },
    demo: { view: true, edit: false, delete: false },
    contact: { view: true, edit: false, delete: false },
    'contact-info': { view: true, edit: false, delete: false },
    'global-settings': { view: false, edit: false, delete: false },
    'social-links': { view: true, edit: false, delete: false },
    testimonials: { view: true, edit: false, delete: false },
    users: { view: false, edit: false, delete: false },
    smtp: { view: false, edit: false, delete: false },
    logs: { view: false, edit: false, delete: false },
    bin: { view: false, edit: false, delete: false },
    versions: { view: false, edit: false, delete: false }
  }
};

// Helper function to get user permissions (custom or role-based)
exports.getUserPermissions = (user) => {
  // If user has custom permissions, use them; otherwise use role defaults
  if (user.permissions && typeof user.permissions === 'object') {
    // Merge custom permissions with role defaults (custom overrides defaults)
    const roleDefaults = defaultRolePermissions[user.role] || defaultRolePermissions.viewer;
    return { ...roleDefaults, ...user.permissions };
  }
  return defaultRolePermissions[user.role] || defaultRolePermissions.viewer;
};

// Middleware to check page-specific permissions
exports.requirePermission = (page, action = 'view') => {
  return (req, res, next) => {
    if (!req.user) {
      return status.unauthorizedResponse(res, 'Authentication required');
    }

    const permissions = exports.getUserPermissions(req.user);
    const pagePermissions = permissions[page];

    if (!pagePermissions) {
      return status.forbiddenResponse(res, `No permissions defined for page: ${page}`);
    }

    // Check if user has the required permission
    if (!pagePermissions[action]) {
      return status.forbiddenResponse(res, `Insufficient permissions. Required: ${action} access for ${page}`);
    }

    next();
  };
};

