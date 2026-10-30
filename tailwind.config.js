import plugin from 'tailwindcss/plugin'

/**
 * Colour from a CSS variable that still supports opacity modifiers (bg-data-ink/10).
 * @param {string} name CSS custom property
 */
const token = (name) => `color-mix(in srgb, var(${name}) calc(<alpha-value> * 100%), transparent)`

/**
 * State variants that react to the real state and can be forced with
 * data-force="hover|focus" (used by /_styleguide to show every state).
 */
const forcedStates = plugin(({ addVariant }) => {
  addVariant('is-hover', ['&:hover', '&[data-force~="hover"]'])
  addVariant('is-focus', ['&:focus-visible', '&[data-force~="focus"]'])
  addVariant('is-focus-within', ['&:focus-within', '&[data-force~="focus"]'])
  addVariant('group-is-hover', [':merge(.group):hover &', ':merge(.group)[data-force~="hover"] &'])
})

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Analysis app (dark theme)
        'bg-primary': '#0a0f1e',
        'bg-secondary': '#1a2744',
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
        line: {
          DEFAULT: 'var(--border)',
          // Form elements only (DESIGN_BRIEF §3 "Formen")
          strong: 'var(--border-strong)',
        },
        'error-ink': token('--error-ink'),
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
        // Data colours: only the ink level is exposed. On light ground it is
        // the darker ink value, inside .surface-inverse the bright dashboard
        // colour (DESIGN_BRIEF §3, contrast rule). The bright tokens are
        // deliberately not available as classes.
        'data-ink': token('--data-ink'),
        'risk-ink': token('--risk-ink'),
        'gain-ink': token('--gain-ink'),
        'warn-ink': token('--warn-ink'),
        path: {
          improve: token('--path-improve'),
          automate: token('--path-automate'),
          keep: token('--path-keep'),
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
  plugins: [forcedStates],
}
