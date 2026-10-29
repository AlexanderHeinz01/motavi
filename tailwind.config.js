/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Analysis app (dark theme)
        'bg-primary': '#0a0f1e',
        'bg-secondary': '#1a2744',
        accent: '#e63946',
        neutral: '#f4f4f6',
        brand: {
          DEFAULT: '#6C3AED',
          hover: '#5a2bd4',
          light: '#F1ECFE',
        },
        // Website tokens, see src/styles/tokens.css and docs/DESIGN_BRIEF.md §3
        page: {
          DEFAULT: 'var(--bg)',
          subtle: 'var(--bg-subtle)',
          inverse: 'var(--bg-inverse)',
        },
        line: 'var(--border)',
        ink: {
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
          inverse: 'var(--text-inverse)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          soft: 'var(--primary-soft)',
        },
        // Data colours shared by website and app
        data: '#00b4d8',
        risk: 'var(--risk)',
        gain: 'var(--gain)',
        warn: 'var(--warn)',
        path: {
          improve: 'var(--path-improve)',
          automate: 'var(--path-automate)',
          keep: 'var(--path-keep)',
        },
      },
      fontFamily: {
        headline: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        btn: '8px',
        card: '12px',
      },
    },
  },
  plugins: [],
}
