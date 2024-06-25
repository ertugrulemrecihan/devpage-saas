import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx,mdx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '0',
      screens: {
        '2xl': '1000px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'horizontal-edit-mode-line-move': {
          '0%': {
            width: '0',
            height: '16px',
          },
          '100%': {
            width: '50%',
            height: '16px',
          },
        },
        'vertical-edit-mode-line-move': {
          '0%': {
            width: '16px',
            height: '0px',
          },
          '100%': {
            width: '16px',
            height: '100%',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'edit-mode-top': 'horizontal-edit-mode-line-move 0.5s 0.5s forwards',
        'edit-mode-vertical': 'vertical-edit-mode-line-move 0.5s 0.9s forwards',
        'edit-mode-bottom': 'horizontal-edit-mode-line-move 0.5s 1.4s forwards',
      },
      boxShadow: {
        'project-card': '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
        'project-image':
          '0px 0.778px 6.222px 0px rgba(100, 116, 139, 0.08), 0px 0.778px 0.778px 0px rgba(100, 116, 139, 0.14)',
        'social-media-icon': '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
        'profile-image':
          '0px 1px 10px 0px rgba(177, 128, 255, 0.12), 0px 1px 2px 0px rgba(177, 128, 255, 0.18)',
        'edit-mode':
          '0px 1px 4px 0px rgba(131, 95, 237, 0.45), 0px 0px 7px 5px rgba(131, 95, 237, 0.16)',
        'edit-mode-badge': '0px 2px 4px 0px rgba(0, 0, 0, 0.04)',
        'project-card-button': '0px 0px 0px 1px #835FED',
        'project-edit-mode': '0px 12px 20px 0px rgba(0, 0, 0, 0.10)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
