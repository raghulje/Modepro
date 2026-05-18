const { GlobalSetting } = require('../models');
const status = require('../helpers/response');

exports.getAll = async (req, res) => {
  try {
    const settings = await GlobalSetting.findAll({
      order: [['setting_key', 'ASC']]
    });
    return status.successResponse(res, "Retrieved", settings);
  } catch (error) {
    console.error('Get Global Settings Error:', error);
    return status.errorResponse(res, error.message);
  }
};

exports.getByKey = async (req, res) => {
  try {
    const setting = await GlobalSetting.findOne({
      where: { setting_key: req.params.key }
    });
    if (!setting) {
      return status.notFoundResponse(res, "Setting not found");
    }
    return status.successResponse(res, "Retrieved", setting);
  } catch (error) {
    console.error('Get Global Setting Error:', error);
    return status.errorResponse(res, error.message);
  }
};

exports.create = async (req, res) => {
  try {
    const setting = await GlobalSetting.create(req.body);
    return status.createdResponse(res, "Setting created", setting);
  } catch (error) {
    console.error('Create Global Setting Error:', error);
    return status.errorResponse(res, error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const setting = await GlobalSetting.findByPk(req.params.id);
    if (!setting) {
      return status.notFoundResponse(res, "Setting not found");
    }
    await setting.update(req.body);
    return status.successResponse(res, "Setting updated", setting);
  } catch (error) {
    console.error('Update Global Setting Error:', error);
    return status.errorResponse(res, error.message);
  }
};

exports.delete = async (req, res) => {
  try {
    const setting = await GlobalSetting.findByPk(req.params.id);
    if (!setting) {
      return status.notFoundResponse(res, "Setting not found");
    }
    await setting.destroy();
    return status.successResponse(res, "Setting deleted");
  } catch (error) {
    console.error('Delete Global Setting Error:', error);
    return status.errorResponse(res, error.message);
  }
};

