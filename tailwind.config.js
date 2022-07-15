module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  daisyui: {
    themes: [
      {
        mytheme: {

          "primary": "#f43f5e",

          "secondary": "#fb923c",

          "accent": "#22d3ee",

          "neutral": "#44403c",

          "base-100": "#1c1917",

          "info": "#3ABFF8",

          "success": "#36D399",

          "warning": "#FBBD23",

          "error": "#F87272",
        },
      },
      "bumblebee"
    ],
  },
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
