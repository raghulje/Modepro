/**
 * Seed Modepro CMS from client/src/mocks/*.ts
 * Run: npm run seed (from server/)
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const {
  sequelize,
  GlobalSetting,
  NavigationItem,
  FooterContent,
  HeroSlide,
  HomeWelcome,
  HomeFeatureCard,
  AboutPage,
  AboutInfoCard,
  ProductsPage,
  ProductCategory,
  ProductGroup,
  Product,
  GalleryBannerSlide,
  GalleryImage,
  CmsPage,
  PageSeo,
  User,
} = require('../models');

const MOCKS_DIR = path.join(__dirname, '../../client/src/mocks');

function loadMock(exportName) {
  const filePath = path.join(MOCKS_DIR, `${exportName.replace(/Data$/, 'Data')}.ts`);
  const map = {
    homeData: 'homeData.ts',
    aboutData: 'aboutData.ts',
    productsData: 'productsData.ts',
    galleryData: 'galleryData.ts',
    rndData: 'rndData.ts',
    manufacturingData: 'manufacturingData.ts',
    qualityData: 'qualityData.ts',
    ehsData: 'ehsData.ts',
    capabilitiesData: 'capabilitiesData.ts',
    careersData: 'careersData.ts',
    contactData: 'contactData.ts',
    pageTitles: 'pageTitles.ts',
  };
  const fileName = map[exportName] || `${exportName}.ts`;
  const fullPath = path.join(MOCKS_DIR, fileName);
  const content = fs.readFileSync(fullPath, 'utf8');
  const re = new RegExp(`export const ${exportName}\\s*=\\s*([\\s\\S]+);\\s*(?:as const)?\\s*$`, 'm');
  const match = content.match(re);
  if (!match) throw new Error(`Could not parse ${exportName} from ${fileName}`);
  let body = match[1].replace(/\bas const\b/g, '').trim();
  // eslint-disable-next-line no-eval
  return eval(`(${body})`);
}

async function seedNavigation(navLinks) {
  await NavigationItem.destroy({ where: {}, truncate: true });
  let order = 0;
  for (const link of navLinks) {
    const parent = await NavigationItem.create({
      label: link.label,
      url: link.href,
      orderIndex: order++,
      isActive: true,
    });
    if (link.children?.length) {
      let childOrder = 0;
      for (const child of link.children) {
        await NavigationItem.create({
          label: child.label,
          url: child.href,
          parentId: parent.id,
          orderIndex: childOrder++,
          isActive: true,
        });
      }
    }
  }
}

async function main() {
  await sequelize.sync({ alter: false });
  console.log('Seeding Modepro CMS from mocks...');

  const homeData = loadMock('homeData');
  const aboutData = loadMock('aboutData');
  const productsData = loadMock('productsData');
  const galleryData = loadMock('galleryData');
  const pageTitles = loadMock('pageTitles');

  // Global settings
  await GlobalSetting.destroy({ where: {} });
  await GlobalSetting.bulkCreate([
    { settingKey: 'site_name', settingValue: homeData.company.name, settingType: 'text' },
    { settingKey: 'site_tagline', settingValue: homeData.company.tagline, settingType: 'text' },
    { settingKey: 'established_year', settingValue: String(homeData.company.established), settingType: 'text' },
  ]);

  // Navigation
  await seedNavigation(homeData.navLinks);

  // Footer
  const f = homeData.footer;
  await FooterContent.destroy({ where: {} });
  await FooterContent.create({
    id: 1,
    officeTitle: f.officeAddress.title,
    officeText: f.officeAddress.text,
    factoryTitle: f.factoryAddress.title,
    factoryText: f.factoryAddress.text,
    careersTitle: f.careers.title,
    careersDescription: f.careers.description,
    careersCtaText: f.careers.ctaText,
    careersCtaHref: f.careers.ctaHref,
    copyrightText: f.copyright,
    managedByText: f.managedBy.text,
    footerNavigation: f.navigation,
  });

  // Home hero
  await HeroSlide.destroy({ where: {} });
  await HeroSlide.bulkCreate(
    homeData.heroSlides.map((s, i) => ({
      imagePath: s.image,
      altText: s.alt,
      orderIndex: i,
      isActive: true,
    }))
  );

  // Home welcome
  const w = homeData.welcome;
  await HomeWelcome.destroy({ where: {} });
  await HomeWelcome.create({
    id: 1,
    imagePath: w.image,
    title: w.title,
    titleHighlight: w.titleHighlight,
    paragraphs: w.paragraphs,
    ctaText: w.ctaText,
    ctaHref: w.ctaHref,
  });

  // Feature cards
  await HomeFeatureCard.destroy({ where: {} });
  await HomeFeatureCard.bulkCreate(
    homeData.features.map((c, i) => ({
      imagePath: c.image || null,
      images: c.images || null,
      title: c.title,
      ctaText: c.ctaText,
      ctaHref: c.ctaHref,
      orderIndex: i,
    }))
  );

  // About
  await AboutPage.destroy({ where: {} });
  await AboutPage.create({
    id: 1,
    bannerImage: aboutData.banner.image,
    bannerAlt: aboutData.banner.alt,
    pageTitle: aboutData.pageTitle,
    whoWeAre: aboutData.whoWeAre,
    ourPeople: aboutData.ourPeople,
    manufacturingLocation: aboutData.manufacturingLocation,
  });

  await AboutInfoCard.destroy({ where: {} });
  await AboutInfoCard.bulkCreate(
    aboutData.infoCards.map((c, i) => ({
      cardKey: c.id,
      title: c.title,
      imagePath: c.image,
      altText: c.alt,
      description: c.description || null,
      paragraphs: c.paragraphs || null,
      orderIndex: i,
    }))
  );

  // Products page
  await ProductsPage.destroy({ where: {} });
  await ProductsPage.create({
    id: 1,
    bannerImage: productsData.banner.image,
    bannerAlt: productsData.banner.alt,
    pageTitle: productsData.pageTitle,
    introTitle: productsData.intro.title,
    introDescription: productsData.intro.description,
  });

  await Product.destroy({ where: {} });
  await ProductGroup.destroy({ where: {} });
  await ProductCategory.destroy({ where: {} });

  for (let ti = 0; ti < productsData.tabs.length; ti++) {
    const tab = productsData.tabs[ti];
    const cat = await ProductCategory.create({
      slug: tab.id,
      label: tab.label,
      orderIndex: ti,
    });
    for (let gi = 0; gi < tab.groups.length; gi++) {
      const group = tab.groups[gi];
      const grp = await ProductGroup.create({
        categoryId: cat.id,
        name: group.name,
        orderIndex: gi,
      });
      for (let pi = 0; pi < group.products.length; pi++) {
        const p = group.products[pi];
        await Product.create({
          groupId: grp.id,
          name: p.name,
          casNo: p.casNo,
          imagePath: p.image,
          orderIndex: pi,
        });
      }
    }
  }

  // Gallery
  await GalleryBannerSlide.destroy({ where: {} });
  await GalleryBannerSlide.bulkCreate(
    galleryData.bannerSlides.map((s, i) => ({
      imagePath: s.image,
      altText: s.alt,
      orderIndex: i,
    }))
  );

  await GalleryImage.destroy({ where: {} });
  await GalleryImage.bulkCreate(
    galleryData.images.map((img, i) => ({
      thumbPath: img.thumb,
      fullPath: img.full,
      orderIndex: i,
    }))
  );

  // CMS pages
  const cmsSlugs = [
    ['rnd', 'rndData'],
    ['manufacturing', 'manufacturingData'],
    ['quality', 'qualityData'],
    ['ehs', 'ehsData'],
    ['capabilities', 'capabilitiesData'],
    ['careers', 'careersData'],
    ['contact', 'contactData'],
  ];

  for (const [slug, mockName] of cmsSlugs) {
    const content = loadMock(mockName);
    await CmsPage.upsert({ slug, content });
  }

  // Page SEO
  await PageSeo.destroy({ where: {} });
  const slugMap = {
    home: '/',
    about: 'about',
    products: 'products',
    rnd: 'rnd',
    manufacturing: 'manufacturing',
    quality: 'quality',
    ehs: 'ehs',
    capabilities: 'capabilities',
    careers: 'careers',
    gallery: 'gallery',
    contact: 'contact',
  };
  for (const [key, title] of Object.entries(pageTitles)) {
    await PageSeo.create({ pageSlug: slugMap[key] || key, metaTitle: title });
  }

  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@modepro.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Modepro@123';
  const existing = await User.findOne({ where: { email: adminEmail } });
  if (!existing) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await User.create({
      username: 'admin',
      email: adminEmail,
      passwordHash,
      fullName: 'Modepro Admin',
      role: 'super_admin',
      isActive: true,
    });
    console.log(`Admin user created: ${adminEmail} / ${adminPassword}`);
  }

  console.log('Seed completed successfully.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
