-- Modepro CMS seed data (generated from client/src/mocks)
-- Run AFTER modepro_cms_setup.sql
USE modepro_cms;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE products;
TRUNCATE TABLE product_groups;
TRUNCATE TABLE product_categories;
TRUNCATE TABLE gallery_images;
TRUNCATE TABLE gallery_banner_slides;
TRUNCATE TABLE about_info_cards;
TRUNCATE TABLE about_page;
TRUNCATE TABLE home_feature_cards;
TRUNCATE TABLE home_welcome;
TRUNCATE TABLE hero_slides;
TRUNCATE TABLE footer_content;
TRUNCATE TABLE navigation_items;
TRUNCATE TABLE global_settings;
TRUNCATE TABLE cms_pages;
TRUNCATE TABLE page_seo;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO global_settings (setting_key, setting_value, setting_type) VALUES
('site_name', 'Modepro India Pvt. Ltd', 'text'),
('site_tagline', 'A Rallis Group Company', 'text'),
('established_year', '1993', 'text');

INSERT INTO navigation_items (id, label, url, parent_id, order_index, is_active) VALUES
(1, 'Home', '/', NULL, 0, 1),
(2, 'Modepro', '/about', NULL, 1, 1),
(3, 'Products Portfolio', '/products', NULL, 2, 1),
(4, 'R & D', '/rnd', NULL, 3, 1),
(5, 'Manufacturing', '/manufacturing', NULL, 4, 1),
(6, 'Quality', '/quality', NULL, 5, 1),
(7, 'EHS', '/ehs', NULL, 6, 1),
(8, 'Careers', '/careers', NULL, 7, 1),
(9, 'Contacts Us', '/contact', NULL, 8, 1);

INSERT INTO navigation_items (id, label, url, parent_id, order_index, is_active) VALUES
(10, 'Who We Are', '/about#whoweare', 2, 0, 1),
(11, 'Our People', '/about#ourpeople', 2, 1, 1),
(12, 'Manufacturing Locations', '/about#mfglocation', 2, 2, 1),
(13, 'Process Development', '/about#processdevelopment', 2, 3, 1),
(14, 'Quality Management Systems', '/about#qms', 2, 4, 1),
(15, 'Respect for intellectual Property', '/about#rip', 2, 5, 1),
(16, 'Envirnomental Health and Safety', '/about#ehs', 2, 6, 1),
(17, 'Photo Gallery', '/gallery', 2, 7, 1),
(18, 'Our Products', '/products', 3, 0, 1),
(19, 'Research and Development', '/rnd', 4, 0, 1),
(20, 'Major Activities', '/rnd#activities', 4, 1, 1),
(21, 'Analytical Development', '/rnd#develop', 4, 2, 1),
(22, 'Where we are', '/manufacturing', 5, 0, 1),
(23, 'Facilities', '/manufacturing#fact', 5, 1, 1),
(24, 'warehousing', '/manufacturing#ware', 5, 2, 1),
(25, 'Capabilities', '/capabilities', 5, 3, 1),
(26, 'Quality Assurance', '/quality', 6, 0, 1),
(27, 'Quality Control', '/quality#control', 6, 1, 1),
(28, 'Infrastructure', '/ehs', 7, 0, 1),
(29, 'Policy', '/ehs#policy', 7, 1, 1),
(30, 'Careers at Modepro', '/careers#car', 8, 0, 1),
(31, 'Current Openings', '/careers#current', 8, 1, 1);

INSERT INTO footer_content (id, office_title, office_text, factory_title, factory_text, careers_title, careers_description, careers_cta_text, careers_cta_href, copyright_text, managed_by_text, footer_navigation) VALUES
(1, 'OFFICE ADDRESS', '409, Bezzola Complex, Sion Trombay Road, Chembur, Mumbai - 400 071. India.', 'FACTORY ADDRESS', 'Plot No. D-26/1, Kurkumbh MIDC, Tal - Daund, Dist - Pune, State - Maharashtra, India 413802.', 'CAREERS', 'Teamwork and growth keep people here as they build their careers. A career here translates into continual opportunities to expand on what you can do.', 'Current Openings', '/careers', 'Copyright 2024 Modepro India Pvt. Ltd.', 'Managed by Refex AI Team', '[{"label":"Home","href":"/"},{"label":"About Us","href":"/about"},{"label":"Products","href":"/products"},{"label":"R & D","href":"/rnd"},{"label":"Manufacturing","href":"/manufacturing"},{"label":"Quality","href":"/quality"},{"label":"EHS","href":"/ehs"},{"label":"Careers","href":"/careers"},{"label":"Contact Us","href":"/contact"}]');

INSERT INTO hero_slides (image_path, alt_text, order_index, is_active) VALUES
('/images/banner2.jpg', '', 0, 1),
('/images/banner3.jpg', '', 1, 1),
('/images/banner4.jpg', '', 2, 1),
('/images/banner5.jpg', '', 3, 1);

INSERT INTO home_welcome (id, image_path, title, title_highlight, paragraphs, cta_text, cta_href) VALUES
(1, '/images/aboutimg-hm.jpg', 'WELCOME TO', 'MODEPRO', '["Modepro is a private ltd company which was established in 1993 primarily to manufacture pharmaceutical intermediates and fine chemicals. Modepro is a reliable partner for multinational companies engaged in pharmaceutical manufacturing.","We are a team of highly qualified individuals having vast experience in various facets of chemical process development, process scale-up, chemical technology & manufacturing expertise. We are able to provide cost effective solutions for our customer''s diverse requirements. Our staff & workers are well trained in all process & safety requirements.","Ours is a versatile plant, we have glass lined & stainless steel reactors, pressure reactors etc capable of carrying out various different kinds of reactions under different conditions. Our infrastructure is designed to carry out many types of processes including hazardous reactions in a safe manner"]', 'Read More', '/about');

INSERT INTO home_feature_cards (image_path, images, title, cta_text, cta_href, order_index) VALUES
('/images/research-img.jpg', NULL, 'RESEARCH & DEVELOPMENT', 'Read More', '/rnd', 0),
('/images/capabilities-img.jpg', NULL, 'CAPABILITIES', 'Read More', '/capabilities', 1),
(NULL, '["/images/gal-hm-img1.jpg","/images/gal-hm-img2.jpg","/images/gal-hm-img3.jpg","/images/gal-hm-img4.jpg","/images/gal-hm-img5.jpg","/images/gal-hm-img6.jpg","/images/gal-hm-img7.jpg","/images/gal-hm-img8.jpg"]', 'GALLERY', 'Read More', '/gallery', 2);

INSERT INTO about_page (id, banner_image, banner_alt, page_title, who_we_are, our_people, manufacturing_location) VALUES
(1, '/images/about-banner.jpg', 'Quality', 'ABOUT MODEPRO INDIA', '{"image":"/images/about-we-are-img.png","alt":"Who We Are","title":"Who we are","paragraphs":["Modepro India Pvt. Ltd was established in the year 1993. Our company is primarily engaged in the manufacture of late stage intermediates for active pharmaceutical ingredients. Over the past years, Modepro has established itself as a key partner to several European and Indian pharmaceutical companies for their requirement of advanced intermediates of API''s.","With our state of the art cGMP certified manufacturing facilities, our focus on research & development, our deep commitment to quality & our emphasis on customer satisfaction, Modepro is poised to become one of the leading suppliers of intermediates to the pharmaceutical industry.","Our company was successfully audited by USFDA  during August, 2022."]}', '{"image":"/images/our-people-img.png","alt":"Our People","title":"Our People","description":"We are a team of highly qualified individuals having vast experience in various areas such as chemical process development, chemical technology, Quality & manufacturing expertise. By leveraging our strengths, We are able to provide cost effective solutions for our customer''s diverse requirements."}', '{"title":"Manufacturing Location","location":"Kurkumbh, Pune.","address":"Plot No. D-26/1, Kurkumbh MIDC, Tal – Daund, Dist – Pune, State – Maharashtra, India  413802.","image":"/images/location-img.png","alt":"Location"}');

INSERT INTO about_info_cards (card_key, title, image_path, alt_text, description, paragraphs, order_index) VALUES
('processdevelopment', 'Process Development', '/images/pro-del-img.png', 'Process Development', 'We have a successful track record in developing non-infringing processes and scaling them up from laboratory to kilo scale to commercial scale production. Our team of researchers have developed several innovative processes for producing intermediates of  many well known API''s', NULL, 0),
('qms', 'Quality Management Systems', '/images/cgmp.png', 'Quality Management systems', NULL, '["Our quality assurance & quality control departments are staffed with competent individuals & our quality systems and documentation are compliant with cGMP requirements. Our plant has been audited by several European multinational companies for compliance to cGMP for pharmaceutical intermediates based on the ICHQ7 standard.","Our company was  successfully audited by USFDA during August, 2022."]', 1),
('rip', 'Respect for Intellectual Property', '/images/Property-img.png', 'Respect for Intellectual Property', 'Our long-term relationships with multinational companies bear testimony to our strict adherence to Intellectual Property. We leverage best practices and technology to ensure confidentiality in our operations.', NULL, 2),
('ehs', 'Environment, Health and Safety', '/images/safety-img.png', 'Environment, Health and Safety', 'We are committed to the health and safety of our employees, the welfare of our community and environment protection. We play a proactive role in creating awareness, imparting training and minimizing pollution.', NULL, 3);

INSERT INTO products_page (id, banner_image, banner_alt, page_title, intro_title, intro_description) VALUES
(1, '/images/product-banner.jpg', 'Products Portfolio', 'PRODUCTS PORTFOLIO', 'Our Products', 'We manufacture intermediates for several API’s falling under a wide range of therapeutic categories. We also manufacture fine chemicals & Specialty chemicals. We are among the largest manufacturer of thiophene products in India and we have an extensive range of different thiophene compounds.');

INSERT INTO product_categories (id, slug, label, order_index) VALUES
(1, 'intermediates', 'Intermediates', 0),
(2, 'pyridine', 'Pyridine Derivatives', 1),
(3, 'thiophene', 'Thiophene Derivatives', 2);

INSERT INTO product_groups (id, category_id, name, order_index) VALUES
(1, 1, 'Intermediate For Alfuzosin, Doxazosin, Prazosin, Terazosin', 0),
(2, 1, 'Intermediate For Alogliptin', 1),
(3, 1, 'Intermediate Amoxapine &amp; Loxapine', 2),
(4, 1, 'Intermediates for Apixaban', 3),
(5, 1, 'Intermediate For Bilastine', 4),
(6, 1, 'Intermediates for Brinzolamide', 5),
(7, 1, 'Intermediate for Dasatinib', 6),
(8, 1, 'Intermediates for Dorzolamide', 7),
(9, 1, 'Intermediate for Doxylamine', 8),
(10, 1, 'Intermediates For Edoxaban', 9),
(11, 1, 'Intermediates for Erlotinib', 10),
(12, 1, 'Intermediates for Ezetimibe', 11),
(13, 1, 'Intermediates for Gefitinib', 12),
(14, 1, 'Intermediates for Linezolid', 13),
(15, 1, 'Intermediate for Lornoxicam', 14),
(16, 1, 'Intermediates for Rivaroxaban', 15),
(17, 1, 'Intermediate for Sertaconzole', 16),
(18, 1, 'Intermediates for Sorafenib', 17),
(19, 1, 'Intermediates for Sunitinib', 18),
(20, 1, 'Intermediates for Suxamethonium', 19),
(21, 1, 'Intermediate for Tiagabine', 20),
(22, 1, 'Intermediate for Tioconazole', 21),
(23, 1, 'Intermediate for Tiotropium Bromide', 22),
(24, 1, 'Intermediate for Zileuton', 23),
(25, 2, 'Pyridine derivatives', 0),
(26, 3, 'Thiophene derivatives', 0);

INSERT INTO products (id, group_id, name, cas_no, image_path, order_index) VALUES
(1, 1, '2-Chlro-4-amino-6, 7-dimethoxyquinazoline', '23680-84-4', '/images/product/intermediate/cas-23680-84-4.png', 0),
(2, 2, '6-Chloro-3-methyluracil', '4318-56-3', '/images/product/intermediate/cas-4318-56-3.png', 0),
(3, 3, '2-Chlorodibenzo[b,f][1,4]oxazepin-11(10H)-one', '3158-91-6', '/images/product/intermediate/1.png', 0),
(4, 4, '5,6-Dihydro-3-(4-morpholinyl)-1-(4-nitrophenyl)-2(1H)-pyridinone', '503615-03-0', '/images/product/intermediate/2.png', 0),
(5, 4, 'Ethyl chloro[(4-methoxyphenyl)hydrazono]acetat', '27143-07-3', '/images/product/intermediate/3.png', 1),
(6, 4, '5,6-Dihydro-3-(4-morpholinyl)-1-[4-(2-oxo-1-piperidinyl)phenyl]-2(1H)-pyridinone', '545445-44-1', '/images/product/intermediate/4.png', 2),
(7, 5, '2-[4-[1-(4,4-dimethyl-5H-oxazol-2yl)-1-methyl-ethyl]phenyl]ethyl 4-methylbenzenesulfonate', '202189-76-2', '/images/product/intermediate/cas-202189-76-2.png', 0),
(8, 6, '3-Acetyl-2,5-dichlorothiophene', '36157-40-1', '/images/product/intermediate/6.png', 0),
(9, 6, '3-Acetyl-5-chlorothiophene-2-sulfonamide', '160982-10-5', '/images/product/intermediate/7.png', 1),
(10, 6, '3-Bromoacetyl-5-chlorothiophene-2-sulphonamide', '160982-11-6', '/images/product/intermediate/8.png', 2),
(11, 6, '6-Chloro-3,4-dihydro-2H-thieno[3,2-e][1,2]thiazin-4-ol-1,1-dioxide', '171274-01-4', '/images/product/intermediate/9.png', 3),
(12, 6, '6-Chloro-3,4-dihydro-2H-thieno[3,2-e][1,2]thiazin-4-one-1,1-dioxide', '174139-69-6', '/images/product/intermediate/10.png', 4),
(13, 6, '3,4-Dihydro-2H-thieno[3,2-e][1,2]thiazin-4-ol-1,1-dioxide', '138890-97-8', '/images/product/intermediate/11.png', 5),
(14, 6, '3,4-Dihydro-2H-thieno[3,2-e][1,2]thiazin-4-one-1,1-dioxide', NULL, '/images/product/intermediate/12.png', 6),
(15, 6, '2-(3-Methoxypropyl)-3,4-dihydro-2H-thieno[3,2-e][1,2]thiazin-4-ol 1,1-dioxide', NULL, '/images/product/intermediate/13.png', 7),
(16, 6, '(4S)-4-Hydroxy-2-(3-methoxypropyl)-3,4-dihydro-2H-thieno[3,2-e][1,2]thiazine-6-sulfonamide-1,1-dioxide', '154127-42-1', '/images/product/intermediate/14.png', 8),
(17, 7, '2-Amino-N-(2-chloro-6-methylphenyl)-1, 3-thiazole-5-carboxamide (172-A)', '302964-24-5', '/images/product/intermediate/15.png', 0),
(18, 7, '4,6-Dichloro-2-methylpyrimidine', '1780-26-3', '/images/product/intermediate/16.png', 1),
(19, 8, '5,6-Dihydro-6-methylthieno[2,3-b]thiopyran-4-one', '120279-85-8', '/images/product/intermediate/17.png', 0),
(20, 8, '5,6-Dihydro-6-methyl-4-oxothieno[2,3-b]thiopyran-2-sulphonamide', '120279-88-1', '/images/product/intermediate/18.png', 1),
(21, 8, '5,6-Dihydro-4-hydroxy-6-methyl4Hthieno[2,3b]thiopyran-2-sulphonamide-7,7-dioxide', '154802-22-9', '/images/product/intermediate/19.png', 2),
(22, 8, '5,6-Dihydro-6-methyl-4-oxothieno[2,3-b]thiopyran-2-sulphonamide-7,7-dioxide', NULL, '/images/product/intermediate/20.png', 3),
(23, 8, 'N[6-Methyl-7,7-dioxide-2-sulfamoyl-5,6-dihydro-4H-thieno[2,3-b]thiopyran-4-yl]acetamide', '120298-38-6', '/images/product/intermediate/21.png', 4),
(24, 8, '5,6-Dihydro-(6S)-6-methylthieno[2,3-b]thiopyran-4-one', NULL, '/images/product/intermediate/22.png', 5),
(25, 8, '(6S)-6-methyl-5,6-dihydro-4H-thieno[2,3-b]thiopyran-4-one 7,7-dioxide', '148719-91-9', '/images/product/intermediate/23.png', 6),
(26, 8, '(4S,6S)-6-methyl-5,6-dihydro-4H-thieno[2,3-b]thiopyran-4-ol-7,7-dioxide', NULL, '/images/product/intermediate/24.png', 7),
(27, 8, '5,6-Dihydro-(6S)-6-methyl-4-oxothieno[2,3-b]thiopyran-2-sulfonamide', NULL, '/images/product/intermediate/25.png', 8),
(28, 8, 'N-[(4S,6S)-6-methyl-7,7-dioxido-5,6-dihydro-4H-thieno[2,3-b]thiopyran-4-yl]acetamide', '147086-83-0', '/images/product/intermediate/26.png', 9),
(29, 8, 'N-[(4S,6S)-6-Methyl-7,7-dioxido-2-sulfamoyl-5,6-dihydro -4H-thieno[2,3-b]thiopyran -4-yl] acetamide', '147200-03-1', '/images/product/intermediate/27.png', 10),
(30, 9, '1-Methyl-1-phenyl-1-(2-pyridyl)methanol .HCl', '19478-81-0', '/images/product/intermediate/28.png', 0),
(31, 10, '2-[(5-Chloropyridin-2yl)amino]-2-oxoacetic acid ethyl ester', '349125-08-2', '/images/product/intermediate/cas-349125-08-2.png', 0),
(32, 10, '5-Methyl-4,5,6,7-tetrahydrothiazolo[5,4-c]pyridine-2-carboxylic Acid Hydrochloride', '720720-96-7', '/images/product/intermediate/cas-720720-96-7.png', 1),
(33, 11, '6,7-Dihydroxyquinazolin-4(3H)-one', '16064-15-6', '/images/product/intermediate/31.png', 0),
(34, 11, '6,7-bis(2-methoxyethoxy)quinazolin-4(3H)-one', '179688-29-0', '/images/product/intermediate/32.png', 1),
(35, 11, '4-Chloro-6,7-bis(2-methoxyethoxy) quinazoline', '183322-18-1', '/images/product/intermediate/33.png', 2),
(36, 11, 'Methyl 2-amino-4,5-bis(2-methoxyethoxy)benzoate Hydrochloride', '179688-29-0', '/images/product/intermediate/34.png', 3),
(37, 12, '1-(4-Fluorophenyl)-5-(2-oxo-(4S)-4 phenyloxazolidin-3-yl) pentane-1,5-dione', '189028-93-1', '/images/product/intermediate/35.png', 0),
(38, 12, '3-[5-(4-Fluorophenyl)-(5S)-5-hydroxypentanoyl]-(4S)-4-phenyloxazolidin-2-one', '189028-95-3', '/images/product/intermediate/36.png', 1),
(39, 12, 'Methyl(3R,4S)-1-(4-flurophenyl)-2-oxo-4-[4-benzyloxyphenyl]-3- azetidin-3-yl-propionate', '204589-80-0', '/images/product/intermediate/37.png', 2),
(40, 12, '(4S)-4-benzyl-3-[(5S)-5-(4-fluorophenyl)-5-hydroxypentanoyl]-1,3-oxazolidin-2-one', '852148-49-3', '/images/product/intermediate/38.png', 3),
(41, 12, '(3R,4S)1-(4-Fluorophenyl)-3-[(3S)-3-(4-fluorophenyl)-3-hydroxypropyl]-4-[4-benzyloxyphenyl] azetidin-2-one', '163222-32-0', '/images/product/intermediate/39.png', 4),
(42, 12, '(3[-{2{(S)(4-Benzyloxyphenyl)(4-fluorophenylamino)methyl}-5-(4-fluorophenyl)-(5S)-5-trimethylsilanoyloxypentanoyl]-(4S)-4-phenyl-1,3-oxazolidin-2-one', '1197343-07-9', '/images/product/intermediate/40.png', 5),
(43, 12, '(3R,4S)-1-(4-fluorophenyl)-3-[3-(4-fluorophenyl)-3-oxopropyl]-4-[4-(benzyloxy) phenyl] azetidin-2-one', '190595-65-4', '/images/product/intermediate/41.png', 6),
(44, 12, '(3R,4S)-1-(4-fluorophenyl)-3-[3-(4-fluorophenyl)-3-oxopropyl]-4-(4- hydroxyphenyl)azetidin-2-one', '191330-56-0', '/images/product/intermediate/CAS-191330-56-0.png', 7),
(45, 13, '6-Hydroxy 7-methoxyquinazolin-4(3H)-one', '179688-52-9', '/images/product/intermediate/42.png', 0),
(46, 13, '4-Methoxy-5-[3-(morpholin-4-yl)propoxy]-2-nitrobenzonitrile', '675126-26-8', '/images/product/intermediate/43.png', 1),
(47, 13, '7-Methoxy-4-oxo-3,4-dihydroquinazolin-6-yl acetate', '179688-53-0', '/images/product/intermediate/44.png', 2),
(48, 13, '7-Methoxy-6-[3-(morpholin -4-yl)propoxy] quinazolin-4(3H)-one', '199327-61-2', '/images/product/intermediate/CAS-199327-61-2.png', 3),
(49, 14, '{(5R)-3-[3-Fluoro-4-(morpholin-4-yl)phenyl]-2-oxo-1,3-oxazolidin-5-yl}methyl methanesulfonate', '174649-09-3', '/images/product/intermediate/49.png', 0),
(50, 14, '(5R)-5-(Azidomethyl)-3-[3-fluoro-4-(morpholin-4-yl)phenyl]-1,3-oxazolidin-2-one', '168828-84-0', '/images/product/intermediate/50.png', 1),
(51, 14, '(5R)-3-(3-Fluoro-4-(4-morpholinyl)phenyl)-5-hydroxymethyl-2-oxazolidione', '168828-82-8', '/images/product/intermediate/CAS-168828-82-8.png', 2),
(52, 14, '(5S)-5-(aminomethyl-3-(3-fluoro-4-morpholinophenyl)-1,3-oxazolidin-2one', '168828-90-8', '/images/product/intermediate/CAS-168828-90-8.png', 3),
(53, 15, 'Methyl 6-chloro-4-hydroxy-2-methyl-2Hthieno[2,3e][1,2]thiazine-3-carboxylate 1,1-dioxide', '70415-50-8', '/images/product/intermediate/51.png', 0),
(54, 16, '5-Chlorothiophene-2-carboxylic acid', '24065-33-6', '/images/product/intermediate/57.png', 0),
(55, 16, '4-(4-Aminophenyl)morpholin-3-one', '438056-69-0', '/images/product/intermediate/CAS-438056-69-0.png', 1),
(56, 16, '5- Chlorothiophene-2-carbonyl chloride', '42518-98-9', '/images/product/intermediate/CAS-42518-98-9.png', 2),
(57, 17, '3-(Bromomethyl)-7-Chlorobenzo[b]Thiophen', '17512-61-7', '/images/product/intermediate/59.png', 0),
(58, 18, '4-chloro-N-methylpyridine-2-carboxamide', '220000-87-3', '/images/product/intermediate/60.png', 0),
(59, 18, '4-(4-aminophenoxy)-N-methylpyridine-2-carboxamide', '284462-37-9', '/images/product/intermediate/61.png', 1),
(60, 18, '1-[4-chloro-3-(trifluoromethyl)phenyl]-3-(4-hydroxyphenyl)urea', NULL, '/images/product/intermediate/62.png', 2),
(61, 19, '5-formyl-2,4-dimethyl,1H-pyrrole-3-carboxylic acid', '253870-02-9', '/images/product/intermediate/63.png', 0),
(62, 19, '5-fluoro-2-oxiindole', '56341-41-4', '/images/product/intermediate/64.png', 1),
(63, 20, 'N,N''-(Succinyldioxydiethylene)Bis(Trimethylammonium)-Dichloride-Dihydrate.', '6101-15-1', '/images/product/intermediate/CAS-6101-15-1.png', 0),
(64, 20, '5-Chlorothiophene-2-yl sulfonamide', '53595-66-7', '/images/product/intermediate/CAS-53595-66-7.png', 1),
(65, 20, '2-Acetyl-5-bromo-4-methylthiophene', '859199-06-7', '/images/product/intermediate/CAS-859199-06-7.png', 2),
(66, 21, '4-Bromo-1,1-bis(3-methyl-2-thienyl)-1-butene', '109857-81-0', '/images/product/intermediate/65.png', 0),
(67, 22, '2-Chloro-3-methylthiophene', '14345-97-2', '/images/product/intermediate/66.png', 0),
(68, 23, 'methyl-2-hydroxy-2,2-(dithiophen-2-yl)acetate', '26447-85-8', '/images/product/intermediate/CAS-26447-85-8.png', 0),
(69, 24, '1-(1-Benzothiophen-2-yl)ethanone', '22720-75-8', '/images/product/intermediate/67.png', 0),
(70, 25, '2-Benzoylpyridine', '91-02-1', '/images/product/pyridine/1.png', 0),
(71, 25, '2-Benzylpyridine', '101-82-6', '/images/product/pyridine/2.png', 1),
(72, 25, '4-Benzoylpyridine', '14548-46-0', '/images/product/pyridine/3.png', 2),
(73, 25, '4-Benzylpyridine', '2116-65-6', '/images/product/pyridine/4.png', 3),
(74, 26, '2-Chlorothiophene', '96-43-5', '/images/product/thiophene/3.png', 0),
(75, 26, '3-Chlorothiophene', '17249-80-8', '/images/product/thiophene/4.png', 1),
(76, 26, '2-Bromothiophene', '1003-09-4', '/images/product/thiophene/5.png', 2),
(77, 26, 'Ethyl-5-chlorothiophene-2-yl sulfonyl carbamate', '849793-87-9', '/images/product/thiophene/8.png', 3),
(78, 26, '5-Bromothiophene-2-carboxylic acid', '7311-63-9', '/images/product/thiophene/11.png', 4),
(79, 26, '5-Formylthiophene-2-carboxylic acid', '4565-31-5', '/images/product/thiophene/12.png', 5),
(80, 26, '2,5-dichlorothiophene-3-carboxylic acid', '36157-41-2', '/images/product/thiophene/14.png', 6),
(81, 26, '2-Acetylthiophene', '14345-97-2', '/images/product/thiophene/16.png', 7),
(82, 26, '2-Chloro-3- methylthiophene', '14282-76-9', '/images/product/thiophene/17.png', 8),
(83, 26, '2-Bromo-3- methylthiophene', '4701-17-1', '/images/product/thiophene/18.png', 9);

INSERT INTO gallery_banner_slides (image_path, alt_text, order_index) VALUES
('/images/banner2.jpg', '', 0),
('/images/banner3.jpg', '', 1),
('/images/banner4.jpg', '', 2),
('/images/banner5.jpg', '', 3);

INSERT INTO gallery_images (thumb_path, full_path, order_index) VALUES
('/images/gallery/gal-pg-img12.jpg', '/images/gallery/gal-pg-big-img12.jpg', 0),
('/images/gallery/gal-pg-img13.jpg', '/images/gallery/gal-pg-big-img13.jpg', 1),
('/images/gallery/gal-pg-img14.jpg', '/images/gallery/gal-pg-big-img14.jpg', 2),
('/images/gallery/gal-pg-img15.jpg', '/images/gallery/gal-pg-big-img15.jpg', 3),
('/images/gallery/gal-pg-img16.jpg', '/images/gallery/gal-pg-big-img16.jpg', 4),
('/images/gallery/gal-pg-img2.jpg', '/images/gallery/gal-pg-big-img2.jpg', 5),
('/images/gallery/gal-pg-img4.jpg', '/images/gallery/gal-pg-big-img4.jpg', 6),
('/images/gallery/gal-pg-img5.jpg', '/images/gallery/gal-pg-big-img5.jpg', 7),
('/images/gallery/gal-pg-img6.jpg', '/images/gallery/gal-pg-big-img6.jpg', 8),
('/images/gallery/gal-pg-img7.jpg', '/images/gallery/gal-pg-big-img7.jpg', 9),
('/images/gallery/gal-pg-img10.jpg', '/images/gallery/gal-pg-big-img10.jpg', 10),
('/images/gallery/gal-pg-img11.jpg', '/images/gallery/gal-pg-big-img11.jpg', 11),
('/images/gallery/MIPL 5.jpg', '/images/gallery/MIPL 5.jpg', 12),
('/images/gallery/MIPL 6.jpg', '/images/gallery/MIPL 6.jpg', 13),
('/images/gallery/MIPL 7.jpg', '/images/gallery/MIPL 7.jpg', 14),
('/images/gallery/MIPL 8.jpg', '/images/gallery/MIPL 8.jpg', 15),
('/images/gallery/MIPL 9.jpg', '/images/gallery/MIPL 9.jpg', 16),
('/images/gallery/MIPL 11.jpg', '/images/gallery/MIPL 11.jpg', 17),
('/images/gallery/MIPL 12.jpg', '/images/gallery/MIPL 12.jpg', 18),
('/images/gallery/MIPL 13.jpg', '/images/gallery/MIPL 13.jpg', 19);

INSERT INTO cms_pages (slug, content) VALUES
('rnd', '{"banner":{"image":"/images/pro-banner-1.jpg","alt":"Research and Development"},"breadcrumb":[{"label":"HOME","href":"/"},{"label":"R & D","href":"/rnd"}],"pageTitle":"Research and Development","intro":{"title":"Research and Development","htmlIntro":"Our R&D centre located at Mumbai  provides process research for API intermediates.<br/>Our team of researchers have developed several novel processes for producing intermediates of well-known API''s. Other activities include analytical process development and IP analysis.","image":"/images/rnd-img.jpg","imageAlt":"Research & Development"},"majorActivities":{"title":"Major Activities:","items":["Route screening","Process Development","Scale up","Technology Transfer","Synthesizing Impurities","Contract Research"]},"analyticalDevelopment":{"title":"Analytical Development","description":"We have a dedicated analytical development laboratory to support the synthesis group.","subTitle":"Major activities:","items":["Analytical method development & validation, for RM, WIP & Finished Products","OVI method development & Method validation","Impurity profile studies"]}}'),
('manufacturing', '{"banner":{"image":"/images/manu-img.jpg","alt":"Manufacturing"},"breadcrumb":[{"label":"HOME","href":"/"},{"label":"MANUFACTURING","href":"/manufacturing"}],"pageTitle":"Manufacturing","whereWeAre":{"description":"Our Manufacturing  unit is located at Plot No. D-26/1, Kurkumbh MIDC, Tal – Daund, Dist – Pune,  State – Maharashtra, India  413802."},"facilities":{"items":["Multipurpose manufacturing plant.","Installed Reaction capacity of 81.53 KL with 22 reactors - 6 Stainless Steel reactors, 16 Glass Lined reactors, One Cryogenic reactor, ranging from 630 L to 6,300 L.","Reaction Temperature ranging from -75°C to +150°C.","High vacuum distillation.","Utilities such as Thermic fluid heater, Steam boiler, Chilling plant, brine circulation and Liquid Nitrogen based cryogenic facility."],"temperatureUsesSuperscript":true},"warehousing":{"items":["Separate storage facility for Solid and Liquid Raw Materials","Separate area for Packing Material storage","Solid Raw Material storage capacity of 150 MT","Liquid Raw Material storage capacity of 72 KL","Separate dispensing area for Solid and Liquid Raw Material","Separate Quarantine area, sampling room, washing area"]},"images":{"manuImg":"/images/manu-img.jpg","warehouseImg":"/images/warehouse-img.jpg","mipl4Img":"/images/MIPL 4.jpg"}}'),
('quality', '{"banner":{"image":"/images/qc-banner2.jpg","alt":"Quality"},"breadcrumb":[{"label":"HOME","href":"/"},{"label":"QUALITY","href":"/quality"}],"pageTitle":"Quality","qualityAssurance":{"title":"Quality Assurance","paragraphs":["Modepro''s commitment to quality  is demonstarted through our adherance to industry leading standards. Oure quality systems align with the guidelines set forth by ICH Q7A, ensuring robust quality management throughout our operations. To ensure the effectiveness and compliance of our Quality Management Systems (QMS), we undergo regular audits conducted by multinational pharmaceutical companies. These audits serve as a validation of our commitment to cGMP (current Good Manufacturing Practices) requirements, reinforcing our reputation as a reliable and compliant partner in the pharmaceutical industry.","Our company was successfully audited by USFDA during August, 2022."]},"qualityControl":{"title":"Quality Control","description":"Well-equipped  laboratories performing comprehensive tests for the finished products, WIP, raw  materials, equipment cleaning in compliance to ICH Q7 guidelines, In-house  test methods and customer''s requirements."},"equipment":{"title":"Quality Control Lab is equipped with:","items":["HPLCs","GC with Head Space","UV Spectrophotometer","FTIR Spectrophotometer","Polarimeter","Potentiometric Titrator","Karl-Fischer Titrator","pH Meter","Conductivity Meter","Analytical Balances"]},"images":[{"src":"/images/MIPL 1.JPG","alt":"Quality Lab"},{"src":"/images/MIPL 2.JPG","alt":"Quality Lab"},{"src":"/images/MIPL 3.jpg","alt":"Quality Lab"},{"src":"/images/MIPL 10.jpg","alt":"Quality Lab"}]}'),
('ehs', '{"banner":{"image":"/images/ehs-banner.jpg","alt":"EHS"},"breadcrumb":[{"label":"HOME","href":"/"},{"label":"EHS","href":"/ehs"}],"title":"EHS","sections":{"infrastructure":{"title":"Infrastructure","anchor":"infra","items":["Kurkumbh facility is a Zero liquid discharge unit.","Compliant with state & local EHS regulations","HAZOP studies of processes after development","Emergency response measures to control and limit the impact of incidents"]},"policy":{"title":"Policy","anchor":"policy","items":["To ensure that all manufacturing activities are performed in the safest possible manner.","To ensure that appropriate health and safety studies are performed during development.","Provide comfortable and safe workplace for employees as well as our associates and third party personnel","Enhance quality, environment, health and safety standards","To contribute to community development by actively participating in community development programs as part of our corporate social responsibility."]}}}'),
('capabilities', '{"banner":{"image":"/images/capabilities-banner.jpg","alt":"Capabilities"},"breadcrumb":[{"label":"HOME","href":"/"},{"label":"Capabilities","href":"/capabilities"}],"title":"Capabilities","table":{"headers":["Named reactions","Types of reaction","Reagents and chemicals"],"rows":[{"named":"Haloform reaction","types":"Halogenation/Halogen exchange reaction","reagents":"Liquid Br2, HBr, HCl, PBPB"},{"named":"Friedel Crafts reaction","types":"Halomethylation","reagents":"PCl5, SOCl2, POCl3,"},{"named":"Grignard reaction","types":"Dehalogenation","reagents":"Metals like Na, Mg, Zn, nBuLi"},{"named":"Landenburg reaction","types":"Carboxylation/decarboxylation","reagents":"Pd/C,  Pt/C,  Ru/C"},{"named":"Jones oxidation ","types":"Amination, Cyanation","reagents":"KMnO4, MnO2, NaOCl,"},{"named":"Prins reaction","types":"Esterification/ Hydrolysis","reagents":"Oxone, H2O2,"},{"named":"Michael addition","types":"Ring closing/opening","reagents":"Gases like  Cl2, ethylene oxide,"},{"named":"Mannich reaction","types":"Oxidation / Reduction","reagents":"H2, SO2,"},{"named":"Vilsmeier heck reaction","types":"Dealkylation/debenzylation","reagents":"Chemicals like Liquid NH3,"},{"named":"Suzuki Coupling ","types":"Chiral reactions & resolutions","reagents":"Benzyl chloride"},{"named":"Blanc / Knoevenagel  etc..","types":"Hydrogenation etc.,","reagents":"BH3-DMS , NaBH4 etc.,"}]}}'),
('careers', '{"banner":{"image":"/images/career-banner.jpg","alt":"Careers"},"breadcrumb":[{"label":"HOME","href":"/"},{"label":"CAREERS","href":"/careers"}],"title":"Careers","sections":{"welcome":{"title":"Welcome to Careers at Modepro","anchor":"car","text":"Teamwork and growth keep people here as they build their careers. A career here translates into continual opportunities to expand on what you can do."},"openings":{"title":"Current Openings","anchor":"current","text":"Apply for the post of immediate requirement of candidates in Production, Q.C., R&D, E.H.S. and other area.","subText":"Sutaible candidate can send their resume to ","email":"info@modepro.com","emailHref":"mailto:info@modepro.com"}}}'),
('contact', '{"banner":{"image":"/images/contact-banner.jpg","alt":"Contact Us"},"breadcrumb":[{"label":"HOME","href":"/"},{"label":"CONTACT US","href":"/contact"}],"title":"CONTACT","titleHighlight":"US","reachTitle":"REACH US","address":{"label":"Address :","html":"409, Bezzola Complex,<br/> Sion Trombay Road , <br/>Chembur, Mumbai - 400 071. India."},"phone":{"label":"Phone :","numbers":["+91-22- 2522 1698","+91-22- 4250 4650"]},"email":{"label":"Email :","addresses":[{"label":"info@modepro.com","href":"mailto:info@modepro.com"},{"label":"mkavalam@modepro.com","href":"mailto:mkavalam@modepro.com"}]},"map":{"embedSrc":"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.2106769466764!2d72.88403680012937!3d19.054472610565597!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8badfc57947%3A0x711ad4ec476e6ae7!2sModepro+India+Pvt+Ltd!5e0!3m2!1sen!2sin!4v1507889458340"}}');

INSERT INTO page_seo (page_slug, meta_title) VALUES
('home', 'Manufacturer of advanced intermediates of API''s | Indian pharmaceutical company | Modepro India Pvt. Ltd'),
('about', 'Modepro India | About Us'),
('products', 'Modepro India | Products'),
('rnd', 'Modepro India |  R & D'),
('manufacturing', 'Modepro India | Manufacturing'),
('quality', 'Modepro India | Quality'),
('ehs', 'Modepro India | EHS'),
('capabilities', 'Modepro | Capabilities'),
('careers', 'Modepro India | Careers'),
('gallery', 'Modepro | Gallery'),
('contact', 'Modepro | Contact Us');

INSERT INTO users (username, email, password_hash, full_name, role, is_active) VALUES
('admin', 'admin@modepro.com', '$2b$10$ME0XCproyJAamdDdtOdpeuO4aToNqBs0wZtYnOY7mibiilPvwS8y6', 'Modepro Admin', 'super_admin', 1);

-- Login: admin@modepro.com / Modepro@123