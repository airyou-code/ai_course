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
                        'body': {
                            lineHeight: '1.4', /* вместо стандартного ~1.6 */
                        },
                        /* Абзацы: чуть меньше отступа снизу */
                        p: {
                            marginBottom: '0.75rem', /* было, например, 1rem*/
                            lineHeight: '1.5',
                        },
                        /* Заголовки: уменьшаем вертикальные отступы */
                        h1: {
                            marginTop: '1rem',        /* вместо 1.5rem */
                            marginBottom: '0.5rem',   /* вместо 0.75rem */
                            lineHeight: '1.2',
                        },
                        h2: {
                            marginTop: '0.875rem',    /* вместо 1.25rem */
                            marginBottom: '0.5rem',   /* вместо 0.5rem (можно ещё уменьшить) */
                            lineHeight: '1.25',
                        },
                        h3: {
                            marginTop: '0.75rem',     /* вместо 1rem */
                            marginBottom: '0.5rem',   /* вместо 0.5rem */
                            lineHeight: '1.3',
                        },
                        h4: {
                            marginTop: '0.5rem',      /* вместо 0.75rem */
                            marginBottom: '0.5rem',   /* вместо 0.5rem */
                            lineHeight: '1.35',
                        },
                        /* Элементы списка: убираем чрезмерные отступы */
                        'ul > li, ol > li': {
                            marginTop: '0',           /* по умолчанию у Tailwind Typography для li нет margin-top */
                            marginBottom: '0.25rem',  /* вместо 0.5rem–0.75rem */
                            lineHeight: '1.5',
                        },
                        /* Списки внутри списков (вложенные) */
                        'ul > li > ul > li, ol > li > ol > li': {
                            marginBottom: '0.25rem',
                        },
                        /* Блоки кода: уменьшаем padding и отступы */
                        pre: {
                            padding: '0.75rem',       /* вместо 1rem */
                            marginTop: '0.75rem',     /* вместо 1rem */
                            marginBottom: '0.75rem',  /* вместо 1rem */
                        },
                        code: {
                            fontSize: '0.875rem',
                            lineHeight: '1.4',
                        },
                        /* Цитаты: сжимаем отступы */
                        blockquote: {
                            marginTop: '0.75rem',     /* вместо 1rem */
                            marginBottom: '0.75rem',  /* вместо 1rem */
                            paddingLeft: '1rem',      /* можно оставить или чуть уменьшить */
                            lineHeight: '1.4',
                        },
                        /* Горизонтальная линия: уменьшаем внешний отступ */
                        hr: {
                            marginTop: '0.75rem',
                            marginBottom: '0.75rem',
                        },
                        /* Таблицы: уменьшаем gap между строками */
                        table: {
                            display: "block",
                            width: "100%",
                            overflowX: "auto",
                            borderCollapse: "collapse",
                        },
                        /* Заголовки таблицы */
                        // "thead th": {
                        //     /* Обеспечиваем, что текст не будет переноситься */
                        //     whiteSpace: "nowrap",
                        //     padding: "0.5rem",        /* по желанию: настраиваем паддинг */
                        //     borderBottom: "1px solid #e2e8f0", /* светлая граница */
                        // },
                        // /* Ячейки тела таблицы */
                        // "tbody td": {
                        //     whiteSpace: "nowrap",
                        //     padding: "0.5rem",
                        //     borderBottom: "1px solid #e2e8f0",
                        // },
                    },
                },
                /* 
                 * If you use the `prose-lg` class, these settings will apply
                 * with slightly larger font sizes and spacing.
                 */
                lg: {
                    css: {
                        'body': {
                            lineHeight: '1.4',
                        },
                        p: {
                            marginBottom: '0.75rem',
                            lineHeight: '1.5',
                        },
                        h1: {
                            marginTop: '1rem',
                            marginBottom: '0.5rem',
                            lineHeight: '1.2',
                        },
                        h2: {
                            marginTop: '0.875rem',
                            marginBottom: '0.5rem',
                            lineHeight: '1.25',
                        },
                        h3: {
                            marginTop: '0.75rem',
                            marginBottom: '0.5rem',
                            lineHeight: '1.3',
                        },
                        h4: {
                            marginTop: '0.5rem',
                            marginBottom: '0.5rem',
                            lineHeight: '1.35',
                        },
                        'ul > li, ol > li': {
                            marginTop: '0',
                            marginBottom: '0.25rem',
                            lineHeight: '1.5',
                        },
                        'ul > li > ul > li, ol > li > ol > li': {
                            marginBottom: '0.25rem',
                        },
                        pre: {
                            padding: '0.75rem',
                            marginTop: '0.75rem',
                            marginBottom: '0.75rem',
                        },
                        code: {
                            fontSize: '0.875rem',
                            lineHeight: '1.4',
                        },
                        blockquote: {
                            marginTop: '0.75rem',
                            marginBottom: '0.75rem',
                            paddingLeft: '1rem',
                            lineHeight: '1.4',
                        },
                        hr: {
                            marginTop: '0.75rem',
                            marginBottom: '0.75rem',
                        },
                        table: {
                            marginTop: '0.75rem',
                            marginBottom: '0.75rem',
                        },
                        'thead th': {
                            padding: '0.5rem',
                        },
                        'tbody td': {
                            padding: '0.5rem',
                        },
                    },
                },
            },
        }
    },
    plugins: [
        require("@tailwindcss/typography"),
        function ({ addBase, theme }) {
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