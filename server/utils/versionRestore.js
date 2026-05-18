const {
  HomeWelcome,
  HeroSlide,
  HomeFeatureCard,
  AboutPage,
  AboutInfoCard,
  GalleryBannerSlide,
  GalleryImage,
  CmsPage,
  ProductsPage,
  ProductCategory,
  ProductGroup,
  Product,
  FooterContent,
  NavigationItem,
} = require('../models');
const { getVersionById, createVersion } = require('./versionTracker');
const { logActivity, getClientIp, getUserAgent } = require('./activityLogger');

const ENTITY_CONFIG = {
  home_welcome: { Model: HomeWelcome, page: 'home', section: 'welcome' },
  hero_slide: { Model: HeroSlide, page: 'home', section: 'hero' },
  home_feature_card: { Model: HomeFeatureCard, page: 'home', section: 'features' },
  about_page: { Model: AboutPage, page: 'about', section: 'content' },
  about_info_card: { Model: AboutInfoCard, page: 'about', section: 'info_cards' },
  gallery_banner_slide: { Model: GalleryBannerSlide, page: 'gallery', section: 'banner' },
  gallery_image: { Model: GalleryImage, page: 'gallery', section: 'images' },
  cms_page: { Model: CmsPage, page: 'cms', section: 'page' },
  products_page: { Model: ProductsPage, page: 'products', section: 'meta' },
  product_category: { Model: ProductCategory, page: 'products', section: 'categories' },
  product_group: { Model: ProductGroup, page: 'products', section: 'groups' },
  product: { Model: Product, page: 'products', section: 'items' },
  footer_content: { Model: FooterContent, page: 'header-footer', section: 'footer' },
  navigation_item: { Model: NavigationItem, page: 'header-footer', section: 'navigation' },
};

const ENTITY_LABELS = Object.fromEntries(
  Object.entries(ENTITY_CONFIG).map(([key, cfg]) => [key, { page: cfg.page, section: cfg.section }])
);

function cleanSnapshot(data) {
  if (!data || typeof data !== 'object') return {};
  const omit = new Set(['id', 'createdAt', 'updatedAt', 'created_at', 'updated_at']);
  const out = {};
  for (const [key, value] of Object.entries(data)) {
    if (!omit.has(key)) out[key] = value;
  }
  return out;
}

async function restoreFromVersion(versionId, req) {
  const version = await getVersionById(versionId);
  if (!version) {
    const err = new Error('Version not found');
    err.statusCode = 404;
    throw err;
  }

  const config = ENTITY_CONFIG[version.entityType];
  if (!config) {
    const err = new Error(`Restore not supported for entity type: ${version.entityType}`);
    err.statusCode = 400;
    throw err;
  }

  const { Model, page, section } = config;
  const item = await Model.findByPk(version.entityId);
  if (!item) {
    const err = new Error('Entity no longer exists; cannot restore this version');
    err.statusCode = 404;
    throw err;
  }

  const payload = cleanSnapshot(version.data);
  await item.update(payload);
  await item.reload();

  await logActivity({
    userId: req.user?.id || null,
    action: 'restore',
    entityType: version.entityType,
    entityId: version.entityId,
    page,
    section,
    description: `Restored ${version.entityType} #${version.entityId} to version ${version.versionNumber}`,
    ipAddress: getClientIp(req),
    userAgent: getUserAgent(req),
    metadata: { restoredFromVersionId: version.id, versionNumber: version.versionNumber },
  });

  await createVersion({
    entityType: version.entityType,
    entityId: version.entityId,
    data: item.toJSON(),
    changes: `Restored from version ${version.versionNumber}`,
    createdBy: req.user?.id || null,
  });

  return { item, version };
}

module.exports = {
  ENTITY_CONFIG,
  ENTITY_LABELS,
  restoreFromVersion,
  cleanSnapshot,
};
