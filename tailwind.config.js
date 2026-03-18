/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: "var(--color-canvas)",
        "canvas-dot": "var(--color-canvas-dot)",
        surface: "var(--color-surface)",
        elevated: "var(--color-elevated)",
        accent: {
          DEFAULT: "var(--color-accent)",
          muted: "var(--color-accent-muted)",
        },
        glass: {
          fill: "var(--color-glass-fill)",
          stroke: "var(--color-glass-stroke)",
          "fill-heavy": "var(--color-glass-fill-heavy)",
          "fill-dense": "var(--color-glass-fill-dense)",
          "stroke-light": "var(--color-glass-stroke-light)",
          "stroke-subtle": "var(--color-glass-stroke-subtle)",
          "stroke-faint": "var(--color-glass-stroke-faint)",
        },
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        muted: "var(--color-muted)",
        subtle: "var(--color-subtle)",
        danger: {
          DEFAULT: "var(--color-danger)",
          light: "var(--color-danger-light)",
        },
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        frame: {
          code: "var(--color-frame-code)",
          search: "var(--color-frame-search)",
          email: "var(--color-frame-email)",
          workflow: "var(--color-frame-workflow)",
          conversation: "var(--color-frame-conversation)",
        },
      },
      boxShadow: {
        glass: "var(--shadow-glass)",
        "glass-sm": "var(--shadow-glass-sm)",
        frame: "0 4px 20px rgba(0, 0, 0, 0.25), 0 1px 2px rgba(0, 0, 0, 0.13)",
        "glow-accent": "0 3px 12px #30D15840, 0 0 2px 1px #30D15820",
        "glow-accent-sm": "0 2px 6px #30D15830",
        "card-modal": "0 10px 40px -6px #00000060, 0 2px 4px #00000025",
        "input-focus": "0 2px 10px #30D15825, 0 0 2px 1px #30D15815",
      },
      borderRadius: {
        glass: "12px",
        frame: "10px",
      },
    },
  },
  plugins: [],
};
