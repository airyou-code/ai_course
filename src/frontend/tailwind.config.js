/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
		fontFamily: {
			sans: ['AvertaCY light', 'sans-serif'],
			heading: ['AvertaCY bold', 'sans-serif'],
			breadcrumbs: ['AvertaCY regulat', 'sans-serif'],
		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
		typography: {
			DEFAULT: {
			  css: {
				p: {
				  marginLeft: "1rem",
				  marginRight: "1rem",
				},
				li: {
				  marginLeft: "1.5rem",
				},
				h1: {
				  fontSize: "2rem",
				  marginTop: "1.5rem",
				  marginBottom: "0.75rem",
				},
				h2: {
				  fontSize: "1.75rem",
				  marginTop: "1.25rem",
				  marginBottom: "0.5rem",
				},
				h3: {
				  fontSize: "1.5rem",
				  marginTop: "1rem",
				  marginBottom: "0.5rem",
				},
				h4: {
				  fontSize: "1.25rem",
				  marginTop: "0.75rem",
				  marginBottom: "0.5rem",
				},
				"ul > li": {
				  paddingLeft: "0.5rem",
				},
				"ol > li": {
				  paddingLeft: "0.5rem",
				},
				pre: {
				  padding: "1rem",
				  marginLeft: "1rem",
				  marginRight: "1rem",
				},
				code: {
				  fontSize: "0.875rem",
				},
				blockquote: {
				  marginLeft: "1rem",
				  marginRight: "1rem",
				},
			  },
			},
			/* 
			 * If you use the `prose-lg` class, these settings will apply
			 * with slightly larger font sizes and spacing.
			 */
			lg: {
			  css: {
				p: {
				  marginLeft: "1rem",
				  marginRight: "1rem",
				},
				li: {
				  marginLeft: "1.5rem",
				},
				h1: {
				  fontSize: "2.25rem",
				  marginTop: "1.75rem",
				  marginBottom: "1rem",
				},
				h2: {
				  fontSize: "2rem",
				  marginTop: "1.5rem",
				  marginBottom: "0.75rem",
				},
				h3: {
				  fontSize: "1.75rem",
				  marginTop: "1.25rem",
				  marginBottom: "0.75rem",
				},
				h4: {
				  fontSize: "1.5rem",
				  marginTop: "1rem",
				  marginBottom: "0.5rem",
				},
				pre: {
				  padding: "1rem",
				  marginLeft: "1rem",
				  marginRight: "1rem",
				},
				code: {
				  fontSize: "0.875rem",
				},
				blockquote: {
				  marginLeft: "1rem",
				  marginRight: "1rem",
				},
			  },
			},
		},
  	}
  },
  plugins: [
	require("@tailwindcss/typography"),
	function({ addBase, theme }) {
		addBase({
			'body': { fontFamily: theme('fontFamily.sans') },
			'h1': { fontFamily: theme('fontFamily.heading') },
			'h2': { fontFamily: theme('fontFamily.heading') },
			'h3': { fontFamily: theme('fontFamily.heading') },
			'h4': { fontFamily: theme('fontFamily.heading') },
		});
	},
],
}