module.exports = {
  purge: {
    enabled: process.env.NODE_ENV == "production",
    content: ["./src/**/*.vue", "./src/**/*.html"],
  },
  theme: {
    extend: {
      colors: {
        "blue-700": "#066CB5",
      },
    },
    cursor: {
      grab: "grab",
      grabbing: "grabbing",
    },
  },
  variants: {},
  plugins: [],
};
