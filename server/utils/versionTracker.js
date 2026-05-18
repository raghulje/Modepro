const { VersionHistory } = require('../models');

/**
 * Create a version snapshot of an entity
 * @param {Object} options - Version tracking options
 * @param {string} options.entityType - Type of entity (e.g., 'home_hero_section')
 * @param {number} options.entityId - ID of the entity
 * @param {Object} options.data - Full snapshot of entity data
 * @param {string} options.changes - Description of changes made
 * @param {number} options.createdBy - User ID who created this version
 */
async function createVersion({
  entityType,
  entityId,
  data,
  changes = null,
  createdBy = null
}) {
  try {
    // Get the latest version number for this entity
    const latestVersion = await VersionHistory.findOne({
      where: {
        entityType,
        entityId
      },
      order: [['versionNumber', 'DESC']]
    });

    const versionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1;

    // Create new version
    await VersionHistory.create({
      entityType,
      entityId,
      versionNumber,
      data,
      changes,
      createdBy
    });

    return versionNumber;
  } catch (error) {
    console.error('Error creating version:', error);
    throw error;
  }
}

/**
 * Get version history for an entity
 * @param {string} entityType - Type of entity
 * @param {number} entityId - ID of the entity
 * @param {Object} options - Query options
 */
async function getVersionHistory(entityType, entityId, options = {}) {
  try {
    const { limit = 50, offset = 0, includeCreator = true } = options;

    const queryOptions = {
      where: {
        entityType,
        entityId
      },
      order: [['versionNumber', 'DESC']],
      limit,
      offset
    };

    if (includeCreator) {
      queryOptions.include = [{
        model: require('../models').User,
        as: 'creator',
        attributes: ['id', 'username', 'email', 'fullName']
      }];
    }

    return await VersionHistory.findAll(queryOptions);
  } catch (error) {
    console.error('Error getting version history:', error);
    throw error;
  }
}

/**
 * Get a specific version by ID
 */
async function getVersionById(versionId) {
  try {
    return await VersionHistory.findByPk(versionId, {
      include: [{
        model: require('../models').User,
        as: 'creator',
        attributes: ['id', 'username', 'email', 'fullName']
      }]
    });
  } catch (error) {
    console.error('Error getting version:', error);
    throw error;
  }
}

/**
 * Compare two versions and return differences
 */
function compareVersions(version1, version2) {
  const differences = [];
  const data1 = version1.data || {};
  const data2 = version2.data || {};

  // Simple comparison - can be enhanced
  const allKeys = new Set([...Object.keys(data1), ...Object.keys(data2)]);

  for (const key of allKeys) {
    const val1 = data1[key];
    const val2 = data2[key];

    if (JSON.stringify(val1) !== JSON.stringify(val2)) {
      differences.push({
        field: key,
        oldValue: val1,
        newValue: val2
      });
    }
  }

  return differences;
}

module.exports = {
  createVersion,
  getVersionHistory,
  getVersionById,
  compareVersions
};

