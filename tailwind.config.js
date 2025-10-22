module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        orange: {
          DEFAULT: "var(--color-orange)",
          500: "var(--color-orange)",
        },
        bg: "var(--color-bg)",
        "delivery-orange": "var(--color-delivery-orange)",
      },
      spacing: {
        54: "13.5rem",
      },
      border: {
        "delivery-stroke": 4,
      },
    },
  },
  plugins: [],
};
