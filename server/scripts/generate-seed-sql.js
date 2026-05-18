/**
 * Generate database/modepro_seed_data.sql from client mocks.
 * Run: node scripts/generate-seed-sql.js
 */
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const MOCKS_DIR = path.join(__dirname, '../../client/src/mocks');
const OUT = path.join(__dirname, '../../database/modepro_seed_data.sql');

const FILE_MAP = {
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

function loadMock(exportName) {
  const fileName = FILE_MAP[exportName];
  if (!fileName) throw new Error(`Unknown mock: ${exportName}`);
  const content = fs.readFileSync(path.join(MOCKS_DIR, fileName), 'utf8');
  const re = new RegExp(`export const ${exportName}\\s*=\\s*([\\s\\S]+);\\s*(?:as const)?\\s*$`, 'm');
  const match = content.match(re);
  if (!match) throw new Error(`Could not parse ${exportName}`);
  let body = match[1].replace(/\bas const\b/g, '').trim();
  // eslint-disable-next-line no-eval
  return eval(`(${body})`);
}

function esc(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number' || typeof val === 'boolean') return val ? '1' : typeof val === 'number' ? String(val) : '0';
  return `'${String(val).replace(/\\/g, '\\\\').replace(/'/g, "''")}'`;
}

function json(val) {
  if (val === null || val === undefined) return 'NULL';
  return `'${JSON.stringify(val).replace(/\\/g, '\\\\').replace(/'/g, "''")}'`;
}

async function main() {
  const homeData = loadMock('homeData');
  const aboutData = loadMock('aboutData');
  const productsData = loadMock('productsData');
  const galleryData = loadMock('galleryData');
  const pageTitles = loadMock('pageTitles');

  const cmsMocks = [
    ['rnd', loadMock('rndData')],
    ['manufacturing', loadMock('manufacturingData')],
    ['quality', loadMock('qualityData')],
    ['ehs', loadMock('ehsData')],
    ['capabilities', loadMock('capabilitiesData')],
    ['careers', loadMock('careersData')],
    ['contact', loadMock('contactData')],
  ];

  const passwordHash = await bcrypt.hash('Modepro@123', 10);
  const lines = [];

  lines.push('-- Modepro CMS seed data (generated from client/src/mocks)');
  lines.push('-- Run AFTER modepro_cms_setup.sql');
  lines.push('USE modepro_cms;');
  lines.push('');
  lines.push('SET FOREIGN_KEY_CHECKS = 0;');
  lines.push('TRUNCATE TABLE products;');
  lines.push('TRUNCATE TABLE product_groups;');
  lines.push('TRUNCATE TABLE product_categories;');
  lines.push('TRUNCATE TABLE gallery_images;');
  lines.push('TRUNCATE TABLE gallery_banner_slides;');
  lines.push('TRUNCATE TABLE about_info_cards;');
  lines.push('TRUNCATE TABLE about_page;');
  lines.push('TRUNCATE TABLE home_feature_cards;');
  lines.push('TRUNCATE TABLE home_welcome;');
  lines.push('TRUNCATE TABLE hero_slides;');
  lines.push('TRUNCATE TABLE footer_content;');
  lines.push('TRUNCATE TABLE navigation_items;');
  lines.push('TRUNCATE TABLE global_settings;');
  lines.push('TRUNCATE TABLE cms_pages;');
  lines.push('TRUNCATE TABLE page_seo;');
  lines.push('TRUNCATE TABLE users;');
  lines.push('SET FOREIGN_KEY_CHECKS = 1;');
  lines.push('');

  // Global settings
  lines.push('INSERT INTO global_settings (setting_key, setting_value, setting_type) VALUES');
  lines.push(`(${esc('site_name')}, ${esc(homeData.company.name)}, 'text'),`);
  lines.push(`(${esc('site_tagline')}, ${esc(homeData.company.tagline)}, 'text'),`);
  lines.push(`(${esc('established_year')}, ${esc(String(homeData.company.established))}, 'text');`);
  lines.push('');

  // Navigation (parents first, then children with parent_id)
  let navId = 1;
  const parentIds = {};
  lines.push('INSERT INTO navigation_items (id, label, url, parent_id, order_index, is_active) VALUES');
  const navRows = [];
  homeData.navLinks.forEach((link, i) => {
    const id = navId++;
    parentIds[link.label] = id;
    navRows.push(`(${id}, ${esc(link.label)}, ${esc(link.href)}, NULL, ${i}, 1)`);
  });
  lines.push(navRows.join(',\n') + ';');
  lines.push('');

  const childRows = [];
  homeData.navLinks.forEach((link) => {
    if (!link.children?.length) return;
    const pid = parentIds[link.label];
    link.children.forEach((child, ci) => {
      childRows.push(`(${navId++}, ${esc(child.label)}, ${esc(child.href)}, ${pid}, ${ci}, 1)`);
    });
  });
  if (childRows.length) {
    lines.push('INSERT INTO navigation_items (id, label, url, parent_id, order_index, is_active) VALUES');
    lines.push(childRows.join(',\n') + ';');
    lines.push('');
  }

  // Footer
  const f = homeData.footer;
  lines.push(`INSERT INTO footer_content (id, office_title, office_text, factory_title, factory_text, careers_title, careers_description, careers_cta_text, careers_cta_href, copyright_text, managed_by_text, footer_navigation) VALUES`);
  lines.push(`(1, ${esc(f.officeAddress.title)}, ${esc(f.officeAddress.text)}, ${esc(f.factoryAddress.title)}, ${esc(f.factoryAddress.text)}, ${esc(f.careers.title)}, ${esc(f.careers.description)}, ${esc(f.careers.ctaText)}, ${esc(f.careers.ctaHref)}, ${esc(f.copyright)}, ${esc(f.managedBy.text)}, ${json(f.navigation)});`);
  lines.push('');

  // Hero slides
  lines.push('INSERT INTO hero_slides (image_path, alt_text, order_index, is_active) VALUES');
  lines.push(homeData.heroSlides.map((s, i) => `(${esc(s.image)}, ${esc(s.alt)}, ${i}, 1)`).join(',\n') + ';');
  lines.push('');

  // Home welcome
  const w = homeData.welcome;
  lines.push(`INSERT INTO home_welcome (id, image_path, title, title_highlight, paragraphs, cta_text, cta_href) VALUES`);
  lines.push(`(1, ${esc(w.image)}, ${esc(w.title)}, ${esc(w.titleHighlight)}, ${json(w.paragraphs)}, ${esc(w.ctaText)}, ${esc(w.ctaHref)});`);
  lines.push('');

  // Feature cards
  lines.push('INSERT INTO home_feature_cards (image_path, images, title, cta_text, cta_href, order_index) VALUES');
  lines.push(
    homeData.features
      .map((c, i) => `(${esc(c.image || null)}, ${json(c.images || null)}, ${esc(c.title)}, ${esc(c.ctaText)}, ${esc(c.ctaHref)}, ${i})`)
      .join(',\n') + ';'
  );
  lines.push('');

  // About page
  lines.push(`INSERT INTO about_page (id, banner_image, banner_alt, page_title, who_we_are, our_people, manufacturing_location) VALUES`);
  lines.push(
    `(1, ${esc(aboutData.banner.image)}, ${esc(aboutData.banner.alt)}, ${esc(aboutData.pageTitle)}, ${json(aboutData.whoWeAre)}, ${json(aboutData.ourPeople)}, ${json(aboutData.manufacturingLocation)});`
  );
  lines.push('');

  lines.push('INSERT INTO about_info_cards (card_key, title, image_path, alt_text, description, paragraphs, order_index) VALUES');
  lines.push(
    aboutData.infoCards
      .map(
        (c, i) =>
          `(${esc(c.id)}, ${esc(c.title)}, ${esc(c.image)}, ${esc(c.alt)}, ${esc(c.description || null)}, ${json(c.paragraphs || null)}, ${i})`
      )
      .join(',\n') + ';'
  );
  lines.push('');

  // Products page meta
  lines.push(`INSERT INTO products_page (id, banner_image, banner_alt, page_title, intro_title, intro_description) VALUES`);
  lines.push(
    `(1, ${esc(productsData.banner.image)}, ${esc(productsData.banner.alt)}, ${esc(productsData.pageTitle)}, ${esc(productsData.intro.title)}, ${esc(productsData.intro.description)});`
  );
  lines.push('');

  // Product categories, groups, products (fixed IDs for SQL)
  let catId = 1;
  let groupId = 1;
  let productId = 1;
  const catInserts = [];
  const groupInserts = [];
  const productInserts = [];

  productsData.tabs.forEach((tab, ti) => {
    const cid = catId++;
    catInserts.push(`(${cid}, ${esc(tab.id)}, ${esc(tab.label)}, ${ti})`);
    tab.groups.forEach((group, gi) => {
      const gid = groupId++;
      groupInserts.push(`(${gid}, ${cid}, ${esc(group.name)}, ${gi})`);
      group.products.forEach((p, pi) => {
        productInserts.push(`(${productId++}, ${gid}, ${esc(p.name)}, ${esc(p.casNo || null)}, ${esc(p.image || null)}, ${pi})`);
      });
    });
  });

  lines.push('INSERT INTO product_categories (id, slug, label, order_index) VALUES');
  lines.push(catInserts.join(',\n') + ';');
  lines.push('');
  lines.push('INSERT INTO product_groups (id, category_id, name, order_index) VALUES');
  lines.push(groupInserts.join(',\n') + ';');
  lines.push('');
  lines.push('INSERT INTO products (id, group_id, name, cas_no, image_path, order_index) VALUES');
  lines.push(productInserts.join(',\n') + ';');
  lines.push('');

  // Gallery
  lines.push('INSERT INTO gallery_banner_slides (image_path, alt_text, order_index) VALUES');
  lines.push(galleryData.bannerSlides.map((s, i) => `(${esc(s.image)}, ${esc(s.alt)}, ${i})`).join(',\n') + ';');
  lines.push('');
  lines.push('INSERT INTO gallery_images (thumb_path, full_path, order_index) VALUES');
  lines.push(galleryData.images.map((img, i) => `(${esc(img.thumb)}, ${esc(img.full)}, ${i})`).join(',\n') + ';');
  lines.push('');

  // CMS pages
  lines.push('INSERT INTO cms_pages (slug, content) VALUES');
  lines.push(cmsMocks.map(([slug, content]) => `(${esc(slug)}, ${json(content)})`).join(',\n') + ';');
  lines.push('');

  // Page SEO
  const slugMap = {
    home: 'home',
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
  lines.push('INSERT INTO page_seo (page_slug, meta_title) VALUES');
  lines.push(
    Object.entries(pageTitles)
      .map(([key, title]) => `(${esc(slugMap[key] || key)}, ${esc(title)})`)
      .join(',\n') + ';'
  );
  lines.push('');

  // Admin user
  lines.push(`INSERT INTO users (username, email, password_hash, full_name, role, is_active) VALUES`);
  lines.push(`('admin', 'admin@modepro.com', ${esc(passwordHash)}, 'Modepro Admin', 'super_admin', 1);`);
  lines.push('');
  lines.push('-- Login: admin@modepro.com / Modepro@123');

  fs.writeFileSync(OUT, lines.join('\n'), 'utf8');
  console.log(`Written: ${OUT}`);
  console.log(`Products: ${productInserts.length}, Navigation items: ${navId - 1}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
