const { AboutPage, AboutInfoCard } = require('../models');
const status = require('../helpers/response');
const {
  createWithTracking,
  updateWithTracking,
  deleteWithTracking,
} = require('../utils/controllerHelpers');

exports.getAbout = async (req, res) => {
  try {
    const [page, infoCards] = await Promise.all([
      AboutPage.findOne({ where: { id: 1 } }),
      AboutInfoCard.findAll({ order: [['orderIndex', 'ASC']] }),
    ]);

    if (!page) return status.notFoundResponse(res, 'About page not found');

    return status.successResponse(res, 'About page retrieved', {
      banner: { image: page.bannerImage, alt: page.bannerAlt },
      breadcrumb: [
        { label: 'HOME', href: '/' },
        { label: 'ABOUT MODEPRO', href: '/about' },
      ],
      pageTitle: page.pageTitle,
      whoWeAre: page.whoWeAre,
      ourPeople: page.ourPeople,
      manufacturingLocation: page.manufacturingLocation,
      infoCards: infoCards.map((c) => ({
        id: c.cardKey,
        title: c.title,
        image: c.imagePath,
        alt: c.altText,
        description: c.description,
        paragraphs: c.paragraphs,
      })),
    });
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.getAboutPage = async (req, res) => {
  try {
    const [page] = await AboutPage.findOrCreate({ where: { id: 1 }, defaults: { id: 1 } });
    return status.successResponse(res, 'About page retrieved', page);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.updateAboutPage = async (req, res) => {
  try {
    const [page] = await AboutPage.findOrCreate({ where: { id: 1 }, defaults: { id: 1 } });
    await updateWithTracking({
      Model: AboutPage,
      item: page,
      data: req.body,
      req,
      entityType: 'about_page',
      page: 'about',
      section: 'content',
    });
    return status.successResponse(res, 'About page updated', page);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.getInfoCards = async (req, res) => {
  try {
    const cards = await AboutInfoCard.findAll({ order: [['orderIndex', 'ASC']] });
    return status.successResponse(res, 'Info cards retrieved', cards);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.createInfoCard = async (req, res) => {
  try {
    const card = await createWithTracking({
      Model: AboutInfoCard,
      data: req.body,
      req,
      entityType: 'about_info_card',
      page: 'about',
      section: 'info_cards',
    });
    return status.createdResponse(res, 'Info card created', card);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.updateInfoCard = async (req, res) => {
  try {
    const card = await AboutInfoCard.findByPk(req.params.id);
    if (!card) return status.notFoundResponse(res, 'Card not found');
    await updateWithTracking({
      Model: AboutInfoCard,
      item: card,
      data: req.body,
      req,
      entityType: 'about_info_card',
      page: 'about',
      section: 'info_cards',
    });
    return status.successResponse(res, 'Info card updated', card);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.deleteInfoCard = async (req, res) => {
  try {
    const card = await AboutInfoCard.findByPk(req.params.id);
    if (!card) return status.notFoundResponse(res, 'Card not found');
    await deleteWithTracking({
      Model: AboutInfoCard,
      item: card,
      req,
      entityType: 'about_info_card',
      page: 'about',
      section: 'info_cards',
      softDelete: false,
    });
    return status.successResponse(res, 'Info card deleted');
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};
