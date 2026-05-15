import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "425px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      menu: "800px",
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0798bc",
          dark: "#076e88",
          nav: "#0999bd",
          media: "#0898bd",
          table: "#0d6d97",
          "nav-hover": "#0463a9",
          "desktop-nav-hover": "#ffb34f",
          link: "#01355b",
        },
        modepro: {
          text: "#3d3d3d",
          muted: "#606060",
          "footer-muted": "#bcbcbc",
          section: "#f8f8f8",
          breadcrumb: "#e6e6e6",
          "table-odd": "#e2f4fd",
          "table-even": "#dddddd",
          "table-alt": "#e7e7e8",
          "footer-start": "#07273d",
          "footer-end": "#07324f",
          "footer-mobile": "#083555",
          dashed: "#acacac",
          scroll: "#f8d42f",
        },
      },
      fontFamily: {
        raleway: ["Raleway", "sans-serif"],
        "open-sans": ['"Open Sans"', "sans-serif"],
        lato: ["Lato", "sans-serif"],
        sans: ["Raleway", "sans-serif"],
      },
      fontSize: {
        "modepro-xs": ["9px", { lineHeight: "1.5" }],
        "modepro-sm": ["13px", { lineHeight: "1.5" }],
        "modepro-base": ["14px", { lineHeight: "1.5" }],
        "modepro-md": ["15px", { lineHeight: "1.5" }],
        "modepro-lg": ["16px", { lineHeight: "1.5" }],
        "modepro-xl": ["18px", { lineHeight: "1.5" }],
        "modepro-2xl": ["20px", { lineHeight: "1.5" }],
        "modepro-3xl": ["26px", { lineHeight: "1.5" }],
      },
      maxWidth: {
        site: "1170px",
        logo: "225px",
        "logo-header": "300px",
      },
      boxShadow: {
        nav: "0px -5px 6px -6px #0d335c",
      },
      transitionDuration: {
        menu: "300ms",
        media: "600ms",
      },
      letterSpacing: {
        table: "1px",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "slide-down": "slideDown 0.3s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
