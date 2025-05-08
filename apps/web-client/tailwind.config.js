/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base colors from CSS variables
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        
        // Primary color scale
        primary: {
          50: '#f5f9ff',
          100: '#e0edff',
          200: '#c2daff',
          300: '#9ac2ff',
          400: '#75a3ff',
          500: '#4d7eff', // Primary brand color
          600: '#3a5eff',
          700: '#2c46db',
          800: '#2538ad',
          900: '#233285',
          950: '#141c4d',
          DEFAULT: '#4d7eff',
        },
        
        // Secondary color scale
        secondary: {
          50: '#fcf5ff',
          100: '#f5e8ff',
          200: '#eacfff',
          300: '#d9a6ff',
          400: '#c77dff',
          500: '#ad4bfc', // Secondary brand color
          600: '#9e38e6',
          700: '#8529c8',
          800: '#6c22a3',
          900: '#591e83',
          950: '#35114d',
          DEFAULT: '#ad4bfc',
        },
        
        // Tertiary color scale
        tertiary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Tertiary brand color
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
          DEFAULT: '#22c55e',
        },
        
        // Accent color
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        
        // Utility colors
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        
        // Pet-friendly colors
        'pet-brown': {
          100: '#f7e7d5',
          500: '#a57c52',
          900: '#5c4025',
          DEFAULT: '#a57c52',
        },
        'pet-beige': {
          100: '#f8f4e3',
          500: '#e6d7ae',
          900: '#baa676',
          DEFAULT: '#e6d7ae',
        },
        
        // Status/alert colors
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-montserrat)', 'Montserrat', 'Georgia', 'serif'],
      },
      
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '4xl': '2rem',
      },
      
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};

