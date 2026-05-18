const { Media } = require('../models');
const status = require('../helpers/response');

// Get all media (with filtering options)
exports.getAll = async (req, res) => {
  try {
    const { fileType, page, limit = 50 } = req.query;
    
    const where = {};
    if (fileType) {
      where.fileType = fileType;
    }

    const offset = page ? (parseInt(page) - 1) * parseInt(limit) : 0;
    const pageLimit = parseInt(limit);

    const { count, rows } = await Media.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: pageLimit,
      offset: offset
    });

    return status.successResponse(res, "Media retrieved", {
      media: rows,
      pagination: {
        total: count,
        page: page ? parseInt(page) : 1,
        limit: pageLimit,
        totalPages: Math.ceil(count / pageLimit)
      }
    });
  } catch (error) {
    console.error('Get All Media Error:', error);
    return status.errorResponse(res, error.message);
  }
};

// Get media by ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const media = await Media.findByPk(id);
    
    if (!media) {
      return status.notFoundResponse(res, "Media not found");
    }
    
    return status.successResponse(res, "Media retrieved", media);
  } catch (error) {
    console.error('Get Media By ID Error:', error);
    return status.errorResponse(res, error.message);
  }
};

// Delete media
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const media = await Media.findByPk(id);
    
    if (!media) {
      return status.notFoundResponse(res, "Media not found");
    }
    
    // TODO: Optionally delete the physical file
    await media.destroy();
    
    return status.successResponse(res, "Media deleted");
  } catch (error) {
    console.error('Delete Media Error:', error);
    return status.errorResponse(res, error.message);
  }
};

