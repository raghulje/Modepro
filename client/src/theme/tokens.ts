/**
 * Design tokens extracted from modepro.co.in/css (style.css, menu.css, responsive.css, etc.)
 * Source of truth: original static site — do not approximate values.
 */

export const colors = {
  brand: {
    primary: "#0798bc",
    primaryDark: "#076e88",
    primaryNav: "#0999bd",
    primaryMedia: "#0898bd",
    primaryTable: "#0d6d97",
    hoverNav: "#0463a9",
    hoverDesktopNav: "#ffb34f",
    link: "#01355b",
  },
  text: {
    black: "#000000",
    body: "#3d3d3d",
    muted: "#606060",
    footerMuted: "#bcbcbc",
    white: "#ffffff",
  },
  background: {
    white: "#ffffff",
    section: "#f8f8f8",
    breadcrumb: "#e6e6e6",
    dropdown: "#e5e5e5",
    tableOdd: "#e2f4fd",
    tableEven: "#dddddd",
    tableAlt: "#e7e7e8",
    overlay: "rgba(250, 250, 250, 0.8)",
    loading: "#ffffff",
  },
  footer: {
    gradientStart: "#07273d",
    gradientEnd: "#07324f",
    mobile: "#083555",
  },
  border: {
    nav: "#7f7f7f",
    menu: "#c6c6c6",
    dashed: "#acacac",
    gallery: "#dddddd",
    table: "#4e95f4",
    divider: "#bdbebf",
  },
  accent: {
    scrollTop: "#f8d42f",
    red: "#B9121B",
  },
  copyright: "#000000",
} as const;

export const fonts = {
  raleway: '"Raleway", sans-serif',
  openSans: '"Open Sans", sans-serif',
  lato: '"Lato", sans-serif',
} as const;

export const fontSize = {
  xs: "9px",
  sm: "10px",
  caption: "12px",
  small: "13px",
  base: "14px",
  md: "15px",
  lg: "16px",
  xl: "18px",
  "2xl": "20px",
  "3xl": "26px",
} as const;

export const fontWeight = {
  normal: "400",
  semibold: "600",
  bold: "700",
} as const;

export const lineHeight = {
  list: "20px",
  default: "1.42857143",
} as const;

export const letterSpacing = {
  tableHeader: "1px",
  nav: "0",
} as const;

export const spacing = {
  containerMax: "1170px",
  logoMax: "225px",
  logoHeaderMax: "300px",
} as const;

export const borderRadius = {
  sm: "4px",
  gallery: "4px",
  tag: "10px",
} as const;

export const shadows = {
  nav: "0px -5px 6px -6px #0d335c",
} as const;

export const transitions = {
  menu: "0.3s ease-in-out",
  menuBody: "0.4s ease-in-out",
  icon: "0.2s ease-in-out",
  media: "0.6s",
  galleryBorder: "0.2s ease-in-out",
  carousel: "2s ease-in-out 0.1s",
} as const;

/** Page title underline max-widths (px) — from :after rules in style.css */
export const titleUnderlineWidth = {
  welcome: 200,
  product: 292,
  about: 229,
  gallery: 208,
  ehs: 50,
  rnd: 344,
  manufacturing: 182,
  quality: 80,
  career: 80,
  capabilities: 145,
  contact: 160,
  /** Mobile 425px overrides */
  mobile: {
    product: 205,
    about: 152,
    manufacturing: 125,
    rnd: 235,
    contact: 110,
    capabilities: 100,
  },
} as const;

export const breakpoints = {
  menu: "800px",
  tablet: "768px",
  mobile: "425px",
} as const;
