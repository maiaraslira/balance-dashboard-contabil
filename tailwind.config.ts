import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'sans': ['ui-sans-serif', 'system-ui', 'sans-serif'],
				'inter': ['Inter', 'sans-serif'],
				'playfair': ['Playfair Display', 'serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				/* Corporate blue theme colors */
				'primary-blue': 'hsl(var(--primary-blue))',
				'primary-blue-dark': 'hsl(var(--primary-blue-dark))',
				'primary-blue-light': 'hsl(var(--primary-blue-light))',
				'success-green': 'hsl(var(--success-green))',
				'success-green-dark': 'hsl(var(--success-green-dark))',
				'warning-orange': 'hsl(var(--warning-orange))',
				'destructive-red': 'hsl(var(--destructive-red))',
				'corporate-blue': 'hsl(var(--corporate-blue))',
				'corporate-blue-dark': 'hsl(var(--corporate-blue-dark))',
				'corporate-gray': 'hsl(var(--corporate-gray))',
				'corporate-gray-light': 'hsl(var(--corporate-gray-light))',
				'accent-green': 'hsl(var(--accent-green))',
				'dark-surface': 'hsl(var(--dark-surface))',
				'dark-surface-elevated': 'hsl(var(--dark-surface-elevated))',
				/* Financial indicator colors updated */
				'positive': 'hsl(var(--success-color))',
				'negative': 'hsl(var(--danger-color))',
				'neutral': 'hsl(var(--neutral-color))',
				'warning': 'hsl(var(--warning-color))',
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-gold': 'var(--gradient-gold)',
				'gradient-elegant': 'var(--gradient-elegant)',
				'gradient-executive': 'var(--gradient-executive)',
				'gradient-card': 'var(--gradient-card)',
			},
			boxShadow: {
				'executive': 'var(--shadow-executive)',
				'success': 'var(--shadow-success)',
				'card-executive': 'var(--shadow-card)',
				'subtle': 'var(--shadow-subtle)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
