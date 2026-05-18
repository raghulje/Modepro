/**
 * Helper functions for controllers to integrate activity logging and version tracking
 */

const { logActivity, getClientIp, getUserAgent } = require('./activityLogger');
const { createVersion } = require('./versionTracker');

/**
 * Enhanced create function with activity logging and version tracking
 */
async function createWithTracking({
  Model,
  data,
  req,
  entityType,
  page,
  section,
  description = null
}) {
  const item = await Model.create(data);
  
  // Log activity
  await logActivity({
    userId: req.user?.id || null,
    action: 'create',
    entityType: entityType || Model.name,
    entityId: item.id,
    page,
    section,
    description: description || `Created ${Model.name} #${item.id}`,
    ipAddress: getClientIp(req),
    userAgent: getUserAgent(req)
  });

  // Create initial version
  try {
    await createVersion({
      entityType: entityType || Model.name,
      entityId: item.id,
      data: item.toJSON(),
      changes: 'Initial version',
      createdBy: req.user?.id || null
    });
  } catch (error) {
    console.warn('Version creation failed:', error);
  }

  return item;
}

/**
 * Enhanced update function with activity logging and version tracking
 */
async function updateWithTracking({
  Model,
  item,
  data,
  req,
  entityType,
  page,
  section,
  description = null,
  trackChanges = true
}) {
  const oldData = item.toJSON();
  
  // Track field-level changes if requested
  const changes = [];
  if (trackChanges) {
    for (const [key, newValue] of Object.entries(data)) {
      const oldValue = oldData[key];
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({
          field: key,
          oldValue: oldValue,
          newValue: newValue
        });
      }
    }
  }

  await item.update(data);
  const newData = item.toJSON();

  // Log activity with field changes
  if (changes.length > 0) {
    for (const change of changes.slice(0, 10)) { // Limit to 10 changes per log
      await logActivity({
        userId: req.user?.id || null,
        action: 'update',
        entityType: entityType || Model.name,
        entityId: item.id,
        page,
        section,
        field: change.field,
        oldValue: change.oldValue ? String(change.oldValue).substring(0, 5000) : null,
        newValue: change.newValue ? String(change.newValue).substring(0, 5000) : null,
        description: description || `Updated ${change.field} in ${Model.name} #${item.id}`,
        ipAddress: getClientIp(req),
        userAgent: getUserAgent(req)
      });
    }
  } else {
    await logActivity({
      userId: req.user?.id || null,
      action: 'update',
      entityType: entityType || Model.name,
      entityId: item.id,
      page,
      section,
      description: description || `Updated ${Model.name} #${item.id}`,
      ipAddress: getClientIp(req),
      userAgent: getUserAgent(req)
    });
  }

  // Create new version
  try {
    const changesText = changes.length > 0
      ? changes.map(c => `Updated ${c.field}`).join(', ')
      : 'Updated';
    
    await createVersion({
      entityType: entityType || Model.name,
      entityId: item.id,
      data: newData,
      changes: changesText,
      createdBy: req.user?.id || null
    });
  } catch (error) {
    console.warn('Version creation failed:', error);
  }

  return item;
}

/**
 * Enhanced delete function with soft delete and activity logging
 */
async function deleteWithTracking({
  Model,
  item,
  req,
  entityType,
  page,
  section,
  description = null,
  softDelete = true
}) {
  if (softDelete && Model.rawAttributes.deletedAt) {
    // Soft delete
    item.deletedAt = new Date();
    await item.save();

    await logActivity({
      userId: req.user?.id || null,
      action: 'delete',
      entityType: entityType || Model.name,
      entityId: item.id,
      page,
      section,
      description: description || `Deleted ${Model.name} #${item.id}`,
      ipAddress: getClientIp(req),
      userAgent: getUserAgent(req)
    });
  } else {
    // Hard delete
    await item.destroy({ force: true });

    await logActivity({
      userId: req.user?.id || null,
      action: 'delete',
      entityType: entityType || Model.name,
      entityId: item.id,
      page,
      section,
      description: description || `Permanently deleted ${Model.name} #${item.id}`,
      ipAddress: getClientIp(req),
      userAgent: getUserAgent(req)
    });
  }
}

/**
 * Enhanced restore function
 */
async function restoreWithTracking({
  Model,
  item,
  req,
  entityType,
  page,
  section,
  description = null
}) {
  if (!item.deletedAt) {
    throw new Error('Item is not deleted');
  }

  item.deletedAt = null;
  await item.save();

  await logActivity({
    userId: req.user?.id || null,
    action: 'restore',
    entityType: entityType || Model.name,
    entityId: item.id,
    page,
    section,
    description: description || `Restored ${Model.name} #${item.id}`,
    ipAddress: getClientIp(req),
    userAgent: getUserAgent(req)
  });

  return item;
}

module.exports = {
  createWithTracking,
  updateWithTracking,
  deleteWithTracking,
  restoreWithTracking
};

