const { GalleryBannerSlide, GalleryImage } = require('../models');
const status = require('../helpers/response');
const {
  createWithTracking,
  updateWithTracking,
  deleteWithTracking,
} = require('../utils/controllerHelpers');

exports.getGallery = async (req, res) => {
  try {
    const [bannerSlides, images] = await Promise.all([
      GalleryBannerSlide.findAll({ order: [['orderIndex', 'ASC']] }),
      GalleryImage.findAll({ order: [['orderIndex', 'ASC']] }),
    ]);

    return status.successResponse(res, 'Gallery retrieved', {
      bannerSlides: bannerSlides.map((s) => ({ image: s.imagePath, alt: s.altText })),
      breadcrumb: [
        { label: 'HOME', href: '/' },
        { label: 'PHOTO GALLERY', href: '/gallery' },
      ],
      title: 'PHOTO',
      titleHighlight: 'GALLERY',
      images: images.map((i) => ({ thumb: i.thumbPath, full: i.fullPath })),
    });
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.getBannerSlides = async (req, res) => {
  try {
    const slides = await GalleryBannerSlide.findAll({ order: [['orderIndex', 'ASC']] });
    return status.successResponse(res, 'Banner slides retrieved', slides);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.createBannerSlide = async (req, res) => {
  try {
    const slide = await createWithTracking({
      Model: GalleryBannerSlide,
      data: req.body,
      req,
      entityType: 'gallery_banner_slide',
      page: 'gallery',
      section: 'banner',
    });
    return status.createdResponse(res, 'Banner slide created', slide);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.updateBannerSlide = async (req, res) => {
  try {
    const slide = await GalleryBannerSlide.findByPk(req.params.id);
    if (!slide) return status.notFoundResponse(res, 'Slide not found');
    await updateWithTracking({
      Model: GalleryBannerSlide,
      item: slide,
      data: req.body,
      req,
      entityType: 'gallery_banner_slide',
      page: 'gallery',
      section: 'banner',
    });
    return status.successResponse(res, 'Banner slide updated', slide);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.deleteBannerSlide = async (req, res) => {
  try {
    const slide = await GalleryBannerSlide.findByPk(req.params.id);
    if (!slide) return status.notFoundResponse(res, 'Slide not found');
    await deleteWithTracking({
      Model: GalleryBannerSlide,
      item: slide,
      req,
      entityType: 'gallery_banner_slide',
      page: 'gallery',
      section: 'banner',
      softDelete: false,
    });
    return status.successResponse(res, 'Banner slide deleted');
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.getImages = async (req, res) => {
  try {
    const images = await GalleryImage.findAll({ order: [['orderIndex', 'ASC']] });
    return status.successResponse(res, 'Gallery images retrieved', images);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.createImage = async (req, res) => {
  try {
    const image = await createWithTracking({
      Model: GalleryImage,
      data: req.body,
      req,
      entityType: 'gallery_image',
      page: 'gallery',
      section: 'images',
    });
    return status.createdResponse(res, 'Gallery image created', image);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.updateImage = async (req, res) => {
  try {
    const image = await GalleryImage.findByPk(req.params.id);
    if (!image) return status.notFoundResponse(res, 'Image not found');
    await updateWithTracking({
      Model: GalleryImage,
      item: image,
      data: req.body,
      req,
      entityType: 'gallery_image',
      page: 'gallery',
      section: 'images',
    });
    return status.successResponse(res, 'Gallery image updated', image);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const image = await GalleryImage.findByPk(req.params.id);
    if (!image) return status.notFoundResponse(res, 'Image not found');
    await deleteWithTracking({
      Model: GalleryImage,
      item: image,
      req,
      entityType: 'gallery_image',
      page: 'gallery',
      section: 'images',
      softDelete: false,
    });
    return status.successResponse(res, 'Gallery image deleted');
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};
