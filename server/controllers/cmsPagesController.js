const { CmsPage, PageSeo } = require('../models');
const status = require('../helpers/response');
const { updateWithTracking } = require('../utils/controllerHelpers');

const CMS_SLUGS = ['rnd', 'manufacturing', 'quality', 'ehs', 'capabilities', 'careers', 'contact'];

exports.getPage = async (req, res) => {
  try {
    const page = await CmsPage.findOne({ where: { slug: req.params.slug } });
    if (!page) return status.notFoundResponse(res, 'Page not found');
    return status.successResponse(res, 'Page retrieved', page.content);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.updatePage = async (req, res) => {
  try {
    const slug = req.params.slug;
    if (!CMS_SLUGS.includes(slug)) {
      return status.badRequestResponse(res, 'Invalid page slug');
    }
    const [page] = await CmsPage.findOrCreate({
      where: { slug },
      defaults: { slug, content: req.body.content || req.body },
    });
    await updateWithTracking({
      Model: CmsPage,
      item: page,
      data: { content: req.body.content || req.body },
      req,
      entityType: 'cms_page',
      page: 'cms',
      section: slug,
    });
    return status.successResponse(res, 'Page updated', page.content);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.listPages = async (req, res) => {
  try {
    const pages = await CmsPage.findAll({ attributes: ['slug', 'updatedAt'] });
    return status.successResponse(res, 'Pages listed', pages);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.getPageSeo = async (req, res) => {
  try {
    const rows = await PageSeo.findAll();
    const map = {};
    rows.forEach((r) => {
      map[r.pageSlug] = r.metaTitle;
    });
    return status.successResponse(res, 'Page SEO retrieved', map);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.updatePageSeo = async (req, res) => {
  try {
    const { pageSlug, metaTitle } = req.body;
    const [row] = await PageSeo.findOrCreate({
      where: { pageSlug },
      defaults: { pageSlug, metaTitle },
    });
    await row.update({ metaTitle });
    return status.successResponse(res, 'Page SEO updated', row);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};
