const { FooterContent, NavigationItem } = require('../models');
const status = require('../helpers/response');
const { updateWithTracking } = require('../utils/controllerHelpers');

exports.getFooter = async (req, res) => {
  try {
    const footer = await FooterContent.findOne({ where: { id: 1 } });
    if (!footer) return status.notFoundResponse(res, 'Footer not found');

    return status.successResponse(res, 'Footer retrieved', {
      navigation: footer.footerNavigation || [],
      officeAddress: { title: footer.officeTitle, text: footer.officeText },
      factoryAddress: { title: footer.factoryTitle, text: footer.factoryText },
      careers: {
        title: footer.careersTitle,
        description: footer.careersDescription,
        ctaText: footer.careersCtaText,
        ctaHref: footer.careersCtaHref,
      },
      copyright: footer.copyrightText,
      managedBy: { text: footer.managedByText },
    });
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.getFooterAdmin = async (req, res) => {
  try {
    const [footer] = await FooterContent.findOrCreate({ where: { id: 1 }, defaults: { id: 1 } });
    return status.successResponse(res, 'Footer retrieved', footer);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.updateFooter = async (req, res) => {
  try {
    const [footer] = await FooterContent.findOrCreate({ where: { id: 1 }, defaults: { id: 1 } });
    await updateWithTracking({
      Model: FooterContent,
      item: footer,
      data: req.body,
      req,
      entityType: 'footer_content',
      page: 'header-footer',
      section: 'footer',
    });
    return status.successResponse(res, 'Footer updated', footer);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.getNavigation = async (req, res) => {
  try {
    const items = await NavigationItem.findAll({
      where: { parentId: null, isActive: true },
      order: [['orderIndex', 'ASC']],
      include: [
        {
          model: NavigationItem,
          as: 'children',
          where: { isActive: true },
          required: false,
          order: [['orderIndex', 'ASC']],
        },
      ],
    });

    const navLinks = items.map((item) => ({
      label: item.label,
      href: item.url,
      children: (item.children || []).map((c) => ({ label: c.label, href: c.url })),
    }));

    return status.successResponse(res, 'Navigation retrieved', navLinks);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};
