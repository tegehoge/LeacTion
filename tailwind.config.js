module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    enabled: process.env.NODE_ENV == "production",
    content: ["./src/**/*.vue", "./src/**/*.html"],
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};
