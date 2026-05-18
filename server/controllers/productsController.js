const {
  ProductsPage,
  ProductCategory,
  ProductGroup,
  Product,
} = require('../models');
const status = require('../helpers/response');
const {
  createWithTracking,
  updateWithTracking,
  deleteWithTracking,
} = require('../utils/controllerHelpers');

async function fetchProductsPageData() {
  const [page, categories] = await Promise.all([
    ProductsPage.findOne({ where: { id: 1 } }),
    ProductCategory.findAll({
      order: [['orderIndex', 'ASC']],
      include: [
        {
          model: ProductGroup,
          as: 'groups',
          include: [{ model: Product, as: 'products' }],
        },
      ],
    }),
  ]);

  for (const cat of categories) {
    if (cat.groups) {
      cat.groups.sort((a, b) => a.orderIndex - b.orderIndex);
      for (const g of cat.groups) {
        if (g.products) g.products.sort((a, b) => a.orderIndex - b.orderIndex);
      }
    }
  }
  categories.sort((a, b) => a.orderIndex - b.orderIndex);
  return { page, categories };
}

exports.getProductsAdmin = async (req, res) => {
  try {
    const { page, categories } = await fetchProductsPageData();
    return status.successResponse(res, 'Products admin payload retrieved', {
      page: page
        ? page.toJSON()
        : {
            id: 1,
            bannerImage: '/images/product-banner.jpg',
            bannerAlt: 'Products',
            pageTitle: 'PRODUCTS PORTFOLIO',
            introTitle: 'Our Products',
            introDescription: '',
          },
      categories: categories.map((cat) => {
        const c = cat.toJSON();
        return {
          ...c,
          groups: (c.groups || []).map((g) => ({
            ...g,
            products: (g.products || []).map((p) => ({ ...p })),
          })),
        };
      }),
    });
  } catch (error) {
    console.error('getProductsAdmin error:', error);
    return status.errorResponse(res, error.message);
  }
};

exports.getProductsPage = async (req, res) => {
  try {
    const { page, categories } = await fetchProductsPageData();

    return status.successResponse(res, 'Products page retrieved', {
      banner: page
        ? { image: page.bannerImage, alt: page.bannerAlt }
        : { image: '/images/product-banner.jpg', alt: 'Products' },
      breadcrumb: [
        { label: 'HOME', href: '/' },
        { label: 'PRODUCTS PORTFOLIO', href: '/products' },
      ],
      pageTitle: page?.pageTitle || 'PRODUCTS PORTFOLIO',
      intro: {
        title: page?.introTitle || 'Our Products',
        description: page?.introDescription || '',
      },
      tabs: categories.map((cat) => ({
        id: cat.slug,
        label: cat.label,
        groups: (cat.groups || []).map((g) => ({
          name: g.name,
          products: (g.products || []).map((p) => ({
            image: p.imagePath,
            name: p.name,
            casNo: p.casNo,
          })),
        })),
      })),
    });
  } catch (error) {
    console.error('getProductsPage error:', error);
    return status.errorResponse(res, error.message);
  }
};

exports.updateProductsPage = async (req, res) => {
  try {
    const [page] = await ProductsPage.findOrCreate({ where: { id: 1 }, defaults: { id: 1 } });
    await updateWithTracking({
      Model: ProductsPage,
      item: page,
      data: req.body,
      req,
      entityType: 'products_page',
      page: 'products',
      section: 'meta',
    });
    return status.successResponse(res, 'Products page updated', page);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.findAll({ order: [['orderIndex', 'ASC']] });
    return status.successResponse(res, 'Categories retrieved', categories);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.createCategory = async (req, res) => {
  try {
    const cat = await createWithTracking({
      Model: ProductCategory,
      data: req.body,
      req,
      entityType: 'product_category',
      page: 'products',
      section: 'categories',
    });
    return status.createdResponse(res, 'Category created', cat);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const cat = await ProductCategory.findByPk(req.params.id);
    if (!cat) return status.notFoundResponse(res, 'Category not found');
    await updateWithTracking({
      Model: ProductCategory,
      item: cat,
      data: req.body,
      req,
      entityType: 'product_category',
      page: 'products',
      section: 'categories',
    });
    return status.successResponse(res, 'Category updated', cat);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const cat = await ProductCategory.findByPk(req.params.id);
    if (!cat) return status.notFoundResponse(res, 'Category not found');
    await deleteWithTracking({
      Model: ProductCategory,
      item: cat,
      req,
      entityType: 'product_category',
      page: 'products',
      section: 'categories',
      softDelete: false,
    });
    return status.successResponse(res, 'Category deleted');
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.createGroup = async (req, res) => {
  try {
    const group = await createWithTracking({
      Model: ProductGroup,
      data: req.body,
      req,
      entityType: 'product_group',
      page: 'products',
      section: 'groups',
    });
    return status.createdResponse(res, 'Group created', group);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const group = await ProductGroup.findByPk(req.params.id);
    if (!group) return status.notFoundResponse(res, 'Group not found');
    await updateWithTracking({
      Model: ProductGroup,
      item: group,
      data: req.body,
      req,
      entityType: 'product_group',
      page: 'products',
      section: 'groups',
    });
    return status.successResponse(res, 'Group updated', group);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const group = await ProductGroup.findByPk(req.params.id);
    if (!group) return status.notFoundResponse(res, 'Group not found');
    await deleteWithTracking({
      Model: ProductGroup,
      item: group,
      req,
      entityType: 'product_group',
      page: 'products',
      section: 'groups',
      softDelete: false,
    });
    return status.successResponse(res, 'Group deleted');
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await createWithTracking({
      Model: Product,
      data: req.body,
      req,
      entityType: 'product',
      page: 'products',
      section: 'items',
    });
    return status.createdResponse(res, 'Product created', product);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return status.notFoundResponse(res, 'Product not found');
    await updateWithTracking({
      Model: Product,
      item: product,
      data: req.body,
      req,
      entityType: 'product',
      page: 'products',
      section: 'items',
    });
    return status.successResponse(res, 'Product updated', product);
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return status.notFoundResponse(res, 'Product not found');
    await deleteWithTracking({
      Model: Product,
      item: product,
      req,
      entityType: 'product',
      page: 'products',
      section: 'items',
      softDelete: false,
    });
    return status.successResponse(res, 'Product deleted');
  } catch (error) {
    return status.errorResponse(res, error.message);
  }
};
