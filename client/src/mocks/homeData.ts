export const homeData = {
  company: {
    name: "Modepro India Pvt. Ltd",
    tagline: "A Rallis Group Company",
    established: 1993,
  },
  navLinks: [
    { label: "Home", href: "/" },
    {
      label: "Modepro",
      href: "/about",
      children: [
        { label: "Who We Are", href: "/about#whoweare" },
        { label: "Our People", href: "/about#ourpeople" },
        { label: "Manufacturing Locations", href: "/about#mfglocation" },
        { label: "Process Development", href: "/about#processdevelopment" },
        { label: "Quality Management Systems", href: "/about#qms" },
        { label: "Respect for intellectual Property", href: "/about#rip" },
        { label: "Envirnomental Health and Safety", href: "/about#ehs" },
        { label: "Photo Gallery", href: "/gallery" },
      ],
    },
    {
      label: "Products Portfolio",
      href: "/products",
      children: [{ label: "Our Products", href: "/products" }],
    },
    {
      label: "R & D",
      href: "/rnd",
      children: [
        { label: "Research and Development", href: "/rnd" },
        { label: "Major Activities", href: "/rnd#activities" },
        { label: "Analytical Development", href: "/rnd#develop" },
      ],
    },
    {
      label: "Manufacturing",
      href: "/manufacturing",
      children: [
        { label: "Where we are", href: "/manufacturing" },
        { label: "Facilities", href: "/manufacturing#fact" },
        { label: "warehousing", href: "/manufacturing#ware" },
        { label: "Capabilities", href: "/capabilities" },
      ],
    },
    {
      label: "Quality",
      href: "/quality",
      children: [
        { label: "Quality Assurance", href: "/quality" },
        { label: "Quality Control", href: "/quality#control" },
      ],
    },
    {
      label: "EHS",
      href: "/ehs",
      children: [
        { label: "Infrastructure", href: "/ehs" },
        { label: "Policy", href: "/ehs#policy" },
      ],
    },
    {
      label: "Careers",
      href: "/careers",
      children: [
        { label: "Careers at Modepro", href: "/careers#car" },
        { label: "Current Openings", href: "/careers#current" },
      ],
    },
    { label: "Contacts Us", href: "/contact" },
  ],
  heroSlides: [
    { image: "/images/banner2.jpg", alt: "" },
    { image: "/images/banner3.jpg", alt: "" },
    { image: "/images/banner4.jpg", alt: "" },
    { image: "/images/banner5.jpg", alt: "" },
  ],
  welcome: {
    image: "/images/aboutimg-hm.jpg",
    title: "WELCOME TO",
    titleHighlight: "MODEPRO",
    paragraphs: [
      "Modepro is a private ltd company which was established in 1993 primarily to manufacture pharmaceutical intermediates and fine chemicals. Modepro is a reliable partner for multinational companies engaged in pharmaceutical manufacturing.",
      "We are a team of highly qualified individuals having vast experience in various facets of chemical process development, process scale-up, chemical technology & manufacturing expertise. We are able to provide cost effective solutions for our customer's diverse requirements. Our staff & workers are well trained in all process & safety requirements.",
      "Ours is a versatile plant, we have glass lined & stainless steel reactors, pressure reactors etc capable of carrying out various different kinds of reactions under different conditions. Our infrastructure is designed to carry out many types of processes including hazardous reactions in a safe manner",
    ],
    ctaText: "Read More",
    ctaHref: "/about",
  },
  features: [
    {
      image: "/images/research-img.jpg",
      title: "RESEARCH & DEVELOPMENT",
      ctaText: "Read More",
      ctaHref: "/rnd",
    },
    {
      image: "/images/capabilities-img.jpg",
      title: "CAPABILITIES",
      ctaText: "Read More",
      ctaHref: "/capabilities",
    },
    {
      images: [
        "/images/gal-hm-img1.jpg",
        "/images/gal-hm-img2.jpg",
        "/images/gal-hm-img3.jpg",
        "/images/gal-hm-img4.jpg",
        "/images/gal-hm-img5.jpg",
        "/images/gal-hm-img6.jpg",
        "/images/gal-hm-img7.jpg",
        "/images/gal-hm-img8.jpg",
      ],
      title: "GALLERY",
      ctaText: "Read More",
      ctaHref: "/gallery",
    },
  ],
  footer: {
    navigation: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Products", href: "/products" },
      { label: "R & D", href: "/rnd" },
      { label: "Manufacturing", href: "/manufacturing" },
      { label: "Quality", href: "/quality" },
      { label: "EHS", href: "/ehs" },
      { label: "Careers", href: "/careers" },
      { label: "Contact Us", href: "/contact" },
    ],
    officeAddress: {
      title: "OFFICE ADDRESS",
      text: "409, Bezzola Complex, Sion Trombay Road, Chembur, Mumbai - 400 071. India.",
    },
    factoryAddress: {
      title: "FACTORY ADDRESS",
      text: "Plot No. D-26/1, Kurkumbh MIDC, Tal - Daund, Dist - Pune, State - Maharashtra, India 413802.",
    },
    careers: {
      title: "CAREERS",
      description:
        "Teamwork and growth keep people here as they build their careers. A career here translates into continual opportunities to expand on what you can do.",
      ctaText: "Current Openings",
      ctaHref: "/careers",
    },
    copyright: "Copyright 2024 Modepro India Pvt. Ltd.",
    managedBy: {
      text: "Managed by",
      logo: "/images/ftlogo.png",
      href: "https://www.effervescent.in",
    },
  },
};