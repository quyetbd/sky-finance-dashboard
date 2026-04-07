import type { Config } from "tailwindcss";
import { COLORS_CONFIG } from "./lib/utils/configColors";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontSize: {
      fontSizeBase: ["14px", "22px"],
      fontSizeLG: ["16px", "24px"],
      fontSizeSM: ["12px", "20px"],
      fontSizeHeading1: ["38px", "46px"],
      fontSizeHeading2: ["30px", "38px"],
      fontSizeHeading3: ["24px", "32px"],
      fontSizeHeading4: ["20px", "28px"],
      fontSizeHeading5: ["16px", "24px"],
    },
    fontWeight: {
      fontWeightNormal: "400",
      fontWeightMedium: "500",
      fontWeightStrong: "600",
    },
    size: {
      xxs: "4px",
      xs: "8px",
      sm: "12px",
      base: "16px",
      ms: "16px",
      md: "20px",
      lg: "24px",
      xl: "32px",
      xxl: "48px",
    },
    screens: {
      xs: "480px",
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      xxl: "1400px",
      "2xl": "1400px",
    },
    extend: {
      colors: { ...COLORS_CONFIG },
      borderRadius: {
        xs: "2px",
        sm: "4px",
        base: "6px",
        lg: "8px",
      },
      margin: {
        xxs: "4px",
        xs: "8px",
        sm: "12px",
        base: "16px",
        md: "20px",
        lg: "24px",
        xl: "32px",
        xxl: "48px",
      },
      padding: {
        xxs: "4px",
        xs: "8px",
        sm: "12px",
        base: "16px",
        md: "20px",
        lg: "24px",
        xl: "32px",
        "x-sm": "16px",
        "y-sm": "8px",
        "x-base": "16px",
        "y-base": "12px",
        "x-lg": "24px",
        "y-lg": "16px",
      },
      height: {
        xs: "16px",
        sm: "24px",
        base: "32px",
        lg: "40px",
      },
      gap: {
        xxs: "4px",
        xs: "8px",
        sm: "12px",
        base: "16px",
        md: "20px",
        lg: "24px",
        xl: "32px",
        xxl: "48px",
      },
      boxShadow: {
        default:
          "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
        tertiary:
          "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
        secondary:
          "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee 20s linear infinite",
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [
    // require("tailwindcss-animate"),
    // plugin(({ addUtilities }) => {
    //   addUtilities(
    //     {
    //       ".text-break": {
    //         "overflow-wrap": "anywhere",
    //         "word-break": "break-word",
    //       },
    //     },
    //     {
    //       respectPrefix: true,
    //       respectImportant: true,
    //     }
    //   )
    // }),
  ],
};
export default config;
