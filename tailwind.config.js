module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    enabled: true,
    content: ["./src/**/*.vue", "./src/**/*.html"],
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};
