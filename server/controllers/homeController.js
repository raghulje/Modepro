const {
  HeroSlide,
  HomeWelcome,
  HomeFeatureCard,
  GlobalSetting,
} = require('../models');
const status = require('../helpers/response');
const {
  createWithTracking,
  updateWithTracking,
  deleteWithTracking,
} = require('../utils/controllerHelpers');

exports.getHome = async (req, res) => {
  try {
    const [heroSlides, welcome, featureCards, settings] = await Promise.all([
      HeroSlide.findAll({ where: { isActive: true }, order: [['orderIndex', 'ASC']] }),
      HomeWelcome.findOne({ where: { id: 1 } }),
      HomeFeatureCard.findAll({ order: [['orderIndex', 'ASC']] }),
      GlobalSetting.findAll(),
    ]);

    const settingsMap = {};
    settings.forEach((s) => {
      settingsMap[s.settingKey] = s.settingValue;
    });

    return status.successResponse(res, 'Home content retrieved', {
      company: {
        name: settingsMap.site_name || 'Modepro India Pvt. Ltd',
        tagline: settingsMap.site_tagline || 'A Rallis Group Company',
        established: Number(settingsMap.established_year) || 1993,
      },
      heroSlides: heroSlides.map((s) => ({ image: s.imagePath, alt: s.altText })),
      welcome: welcome
        ? {
            image: welcome.imagePath,
            title: welcome.title,
            titleHighlight: welcome.titleHighlight,
            paragraphs: welcome.paragraphs || [],
            ctaText: welcome.ctaText,
            ctaHref: welcome.ctaHref,
          }
        : null,
      features: featureCards.map((c) => {
        const gallery =
          Array.isArray(c.images) && c.images.length > 0
            ? c.images.filter(Boolean)
            : null;
        if (gallery && gallery.length > 0) {
          return {
            images: gallery,
            title: c.title,
            ctaText: c.ctaText,
            ctaHref: c.ctaHref,
          };
        }
        return {
          image: c.imagePath || null,
          title: c.title,
          ctaText: c.ctaText,
          ctaHref: c.ctaHref,
        };
      }),
    });
  } catch (error) {
    console.error('getHome error:', error);
    return status.errorResponse(res, error.message);
  }
};

exports.getWelcome = async (req, res) => {
  try {
    const [row] = await HomeWelcome.findOrCreate({ where: { id: 1 }, defaults: { id: 1 } });
    return status.successResponse(res, 'Welcome section retrieved', row);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.updateWelcome = async (req, res) => {
  try {
    const [row] = await HomeWelcome.findOrCreate({ where: { id: 1 }, defaults: { id: 1 } });
    await updateWithTracking({
      Model: HomeWelcome,
      item: row,
      data: req.body,
      req,
      entityType: 'home_welcome',
      page: 'home',
      section: 'welcome',
    });
    return status.successResponse(res, 'Welcome section updated', row);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.getHeroSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.findAll({ order: [['orderIndex', 'ASC']] });
    return status.successResponse(res, 'Hero slides retrieved', slides);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.createHeroSlide = async (req, res) => {
  try {
    const slide = await createWithTracking({
      Model: HeroSlide,
      data: req.body,
      req,
      entityType: 'hero_slide',
      page: 'home',
      section: 'hero',
    });
    return status.createdResponse(res, 'Hero slide created', slide);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.updateHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.findByPk(req.params.id);
    if (!slide) return status.notFoundResponse(res, 'Slide not found');
    await updateWithTracking({
      Model: HeroSlide,
      item: slide,
      data: req.body,
      req,
      entityType: 'hero_slide',
      page: 'home',
      section: 'hero',
    });
    return status.successResponse(res, 'Hero slide updated', slide);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.deleteHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.findByPk(req.params.id);
    if (!slide) return status.notFoundResponse(res, 'Slide not found');
    await deleteWithTracking({
      Model: HeroSlide,
      item: slide,
      req,
      entityType: 'hero_slide',
      page: 'home',
      section: 'hero',
      softDelete: false,
    });
    return status.successResponse(res, 'Hero slide deleted');
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.getFeatureCards = async (req, res) => {
  try {
    const cards = await HomeFeatureCard.findAll({ order: [['orderIndex', 'ASC']] });
    return status.successResponse(res, 'Feature cards retrieved', cards);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.createFeatureCard = async (req, res) => {
  try {
    const card = await createWithTracking({
      Model: HomeFeatureCard,
      data: req.body,
      req,
      entityType: 'home_feature_card',
      page: 'home',
      section: 'features',
    });
    return status.createdResponse(res, 'Feature card created', card);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.updateFeatureCard = async (req, res) => {
  try {
    const card = await HomeFeatureCard.findByPk(req.params.id);
    if (!card) return status.notFoundResponse(res, 'Card not found');
    await updateWithTracking({
      Model: HomeFeatureCard,
      item: card,
      data: req.body,
      req,
      entityType: 'home_feature_card',
      page: 'home',
      section: 'features',
    });
    return status.successResponse(res, 'Feature card updated', card);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.deleteFeatureCard = async (req, res) => {
  try {
    const card = await HomeFeatureCard.findByPk(req.params.id);
    if (!card) return status.notFoundResponse(res, 'Card not found');
    await deleteWithTracking({
      Model: HomeFeatureCard,
      item: card,
      req,
      entityType: 'home_feature_card',
      page: 'home',
      section: 'features',
      softDelete: false,
    });
    return status.successResponse(res, 'Feature card deleted');
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};
