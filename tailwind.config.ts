import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Semantic colors from CSS variables
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
                // Olive & Agriculture Theme
                olive: {
                    50: '#f5f7f4',
                    100: '#d4e7c5',
                    200: '#b8d4a8',
                    300: '#9caf88',
                    400: '#6b7f5a',
                    500: '#3d4f2f',
                    600: '#2f3d24',
                    700: '#232d1b',
                    800: '#1a2114',
                    900: '#12170e',
                },
                earth: {
                    50: '#f9f6f3',
                    100: '#e8dfd5',
                    200: '#d4c4b3',
                    300: '#bfaa91',
                    400: '#8b7355',
                    500: '#6b5842',
                    600: '#544632',
                    700: '#3d3325',
                    800: '#2d2416',
                    900: '#1f1910',
                },
                harvest: {
                    50: '#fef9ee',
                    100: '#fcedc7',
                    200: '#f9d88f',
                    300: '#f5c257',
                    400: '#daa520',
                    500: '#b8891a',
                    600: '#966d14',
                    700: '#74520f',
                    800: '#523a0a',
                    900: '#302206',
                },
                leaf: {
                    50: '#f4f7f0',
                    100: '#d9e7c7',
                    200: '#bdd79e',
                    300: '#a1c775',
                    400: '#6b9f3d',
                    500: '#4d7c0f',
                    600: '#3d630c',
                    700: '#2e4a09',
                    800: '#1f3106',
                    900: '#101803',
                },
            },
            fontFamily: {
                serif: ['var(--font-playfair)', 'Georgia', 'Times New Roman', 'serif'],
                sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            backgroundImage: {
                'olive-gradient': 'linear-gradient(135deg, #3d4f2f 0%, #6b7f5a 100%)',
                'earth-gradient': 'linear-gradient(135deg, #2d2416 0%, #3d4f2f 50%, #2d2416 100%)',
                'harvest-gradient': 'linear-gradient(135deg, #daa520 0%, #d97706 100%)',
            },
            boxShadow: {
                'olive': '0 4px 20px rgba(61, 79, 47, 0.3)',
                'harvest': '0 4px 20px rgba(218, 165, 32, 0.3)',
                'earth': '0 8px 32px rgba(0, 0, 0, 0.4)',
            },
            animation: {
                'leaf-fall': 'leaf-fall 15s linear infinite',
                'earth-shift': 'earth-shift 25s ease infinite',
            },
        },
    },
    plugins: [],
}
export default config
