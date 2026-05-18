const { Op } = require('sequelize');
const { VersionHistory, User } = require('../models');
const status = require('../helpers/response');
const { getVersionHistory, getVersionById, compareVersions } = require('../utils/versionTracker');
const { restoreFromVersion, ENTITY_LABELS } = require('../utils/versionRestore');

/**
 * Get version history for an entity
 */
exports.getHistory = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const versions = await getVersionHistory(entityType, entityId, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      includeCreator: true
    });

    return status.successResponse(res, "Version history retrieved", versions);
  } catch (error) {
    console.error('Get Version History Error:', error);
    return status.errorResponse(res, error.message);
  }
};

/**
 * Get all version history with filters
 */
exports.getAllHistory = async (req, res) => {
  try {
    const {
      page,
      section,
      entityType,
      limit = 50,
      offset = 0
    } = req.query;

    const where = {};
    if (entityType) where.entityType = entityType;
    if (page && page !== 'all') {
      const types = Object.entries(ENTITY_LABELS)
        .filter(([, labels]) => labels.page === page)
        .map(([type]) => type);
      if (types.length) where.entityType = { [Op.in]: types };
    }

    const queryOptions = {
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'username', 'email', 'fullName']
      }]
    };

    const { count, rows: versions } = await VersionHistory.findAndCountAll(queryOptions);

    // Transform to match UI expectations
    const transformedVersions = versions
      .map((v) => {
        const labels = ENTITY_LABELS[v.entityType] || {
          page: v.entityType.split('_')[0] || 'cms',
          section: v.entityType.replace(/_/g, ' '),
        };
        const changeText = v.changes || '';
        return {
          id: v.id,
          entityType: v.entityType,
          entityId: v.entityId,
          page: labels.page,
          section: labels.section,
          versionNumber: v.versionNumber,
          createdBy: v.creator?.email || v.creator?.fullName || 'Unknown',
          createdAt: v.createdAt,
          changes: changeText.includes(', ') ? changeText.split(', ') : changeText ? [changeText] : [],
          data: v.data,
        };
      })
      .filter((v) => {
        if (section && section !== 'all' && v.section !== section) return false;
        return true;
      });

    return status.successResponse(res, "Version history retrieved", {
      versions: transformedVersions,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get All Version History Error:', error);
    return status.errorResponse(res, error.message);
  }
};

/**
 * Get a specific version
 */
exports.getVersion = async (req, res) => {
  try {
    const { id } = req.params;
    const version = await getVersionById(id);

    if (!version) {
      return status.notFoundResponse(res, "Version not found");
    }

    return status.successResponse(res, "Version retrieved", version);
  } catch (error) {
    console.error('Get Version Error:', error);
    return status.errorResponse(res, error.message);
  }
};

/**
 * Compare two versions
 */
exports.compareVersions = async (req, res) => {
  try {
    const { versionId1, versionId2 } = req.body;

    const version1 = await getVersionById(versionId1);
    const version2 = await getVersionById(versionId2);

    if (!version1 || !version2) {
      return status.notFoundResponse(res, "One or both versions not found");
    }

    const differences = compareVersions(version1, version2);

    return status.successResponse(res, "Versions compared", {
      version1,
      version2,
      differences
    });
  } catch (error) {
    console.error('Compare Versions Error:', error);
    return status.errorResponse(res, error.message);
  }
};

/**
 * Get version statistics
 */
exports.restoreVersion = async (req, res) => {
  try {
    const { id } = req.params;
    const { item, version } = await restoreFromVersion(parseInt(id, 10), req);
    return status.successResponse(res, `Restored to version ${version.versionNumber}`, {
      entityType: version.entityType,
      entityId: version.entityId,
      versionNumber: version.versionNumber,
      item,
    });
  } catch (error) {
    console.error('Restore Version Error:', error);
    const code = error.statusCode || 500;
    return status.errorResponse(res, error.message, code);
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalVersions = await VersionHistory.count();
    const uniquePages = await VersionHistory.count({
      distinct: true,
      col: 'entity_type'
    });
    const latestVersion = await VersionHistory.findOne({
      order: [['createdAt', 'DESC']]
    });

    return status.successResponse(res, "Statistics retrieved", {
      totalVersions,
      pagesTracked: uniquePages,
      latestUpdate: latestVersion?.createdAt || null
    });
  } catch (error) {
    console.error('Get Version Stats Error:', error);
    return status.errorResponse(res, error.message);
  }
};

