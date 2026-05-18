const { Op } = require('sequelize');
const { ActivityLog, User, sequelize } = require('../models');
const status = require('../helpers/response');

function flattenLog(log) {
  const row = log.toJSON ? log.toJSON() : log;
  const d = row.details || {};
  return {
    id: row.id,
    user: row.user,
    action: row.action,
    entityType: row.entityType,
    entityId: row.entityId,
    page: d.page || null,
    section: d.section || null,
    field: d.field || null,
    oldValue: d.oldValue ?? null,
    newValue: d.newValue ?? null,
    description: d.description || null,
    createdAt: row.createdAt,
    ipAddress: row.ipAddress,
  };
}

exports.getLogs = async (req, res) => {
  try {
    const {
      action,
      entityType,
      page,
      userId,
      startDate,
      endDate,
      search,
      limit = 50,
      offset = 0,
    } = req.query;

    const where = {};
    if (action && action !== 'all') where.action = action;
    if (entityType) where.entityType = entityType;
    if (userId) where.userId = userId;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    if (page && page !== 'all') {
      where[Op.and] = [
        ...(where[Op.and] || []),
        sequelize.where(
          sequelize.fn('JSON_UNQUOTE', sequelize.fn('JSON_EXTRACT', sequelize.col('details'), '$.page')),
          page
        ),
      ];
    }

    if (search) {
      const term = `%${search}%`;
      where[Op.or] = [
        { action: { [Op.like]: term } },
        { entityType: { [Op.like]: term } },
        sequelize.where(
          sequelize.fn('JSON_UNQUOTE', sequelize.fn('JSON_EXTRACT', sequelize.col('details'), '$.description')),
          { [Op.like]: term }
        ),
        sequelize.where(
          sequelize.fn('JSON_UNQUOTE', sequelize.fn('JSON_EXTRACT', sequelize.col('details'), '$.page')),
          { [Op.like]: term }
        ),
        sequelize.where(
          sequelize.fn('JSON_UNQUOTE', sequelize.fn('JSON_EXTRACT', sequelize.col('details'), '$.section')),
          { [Op.like]: term }
        ),
      ];
    }

    const { count, rows } = await ActivityLog.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email', 'fullName'],
        },
      ],
    });

    return status.successResponse(res, 'Activity logs retrieved', {
      logs: rows.map(flattenLog),
      total: count,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });
  } catch (error) {
    console.error('Get Activity Logs Error:', error);
    return status.errorResponse(res, error.message);
  }
};

exports.getStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    const [totalActions, updates, deletions, creates, restores, logins] = await Promise.all([
      ActivityLog.count({ where }),
      ActivityLog.count({ where: { ...where, action: 'update' } }),
      ActivityLog.count({ where: { ...where, action: 'delete' } }),
      ActivityLog.count({ where: { ...where, action: 'create' } }),
      ActivityLog.count({ where: { ...where, action: 'restore' } }),
      ActivityLog.count({ where: { ...where, action: 'login' } }),
    ]);

    return status.successResponse(res, 'Statistics retrieved', {
      totalActions,
      updates,
      deletions,
      creates,
      restores,
      logins,
    });
  } catch (error) {
    console.error('Get Activity Log Stats Error:', error);
    return status.errorResponse(res, error.message);
  }
};

exports.exportLogs = async (req, res) => {
  try {
    const { action, entityType, page, startDate, endDate } = req.query;
    const where = {};
    if (action && action !== 'all') where.action = action;
    if (entityType) where.entityType = entityType;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    if (page && page !== 'all') {
      where[Op.and] = [
        sequelize.where(
          sequelize.fn('JSON_UNQUOTE', sequelize.fn('JSON_EXTRACT', sequelize.col('details'), '$.page')),
          page
        ),
      ];
    }

    const logs = await ActivityLog.findAll({
      where,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, as: 'user', attributes: ['username', 'email', 'fullName'] }],
      limit: 10000,
    });

    const csvRows = [
      ['Timestamp', 'User', 'Email', 'Action', 'Page', 'Section', 'Field', 'Entity', 'IP', 'Description'].join(','),
    ];

    logs.forEach((log) => {
      const f = flattenLog(log);
      const row = [
        new Date(f.createdAt).toISOString(),
        f.user?.fullName || f.user?.username || 'N/A',
        f.user?.email || 'N/A',
        f.action,
        f.page || 'N/A',
        f.section || 'N/A',
        f.field || 'N/A',
        f.entityType ? `${f.entityType}#${f.entityId || ''}` : 'N/A',
        f.ipAddress || 'N/A',
        f.description ? `"${String(f.description).replace(/"/g, '""')}"` : 'N/A',
      ];
      csvRows.push(row.join(','));
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=activity-logs-${new Date().toISOString().split('T')[0]}.csv`
    );
    res.send(csvRows.join('\n'));
  } catch (error) {
    console.error('Export Activity Logs Error:', error);
    return status.errorResponse(res, error.message);
  }
};
