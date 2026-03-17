/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./lib/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                pixel: {
                    ink: '#1a1a1a',
                    body: '#f6e5c0',
                    panel: '#fff9ed',
                    red: '#e64a4e',
                    green: '#5b9e54',
                    orange: '#e58c3a',
                    blue: '#3666b3',
                    yellow: '#e8c440',
                    purple: '#8e52a3',
                    focus: '#e0f7fa',
                    sky: '#9cd3db',
                },
                neo: {
                    bg: '#fff9ed',
                    cream: '#f6e5c0',
                    ink: '#1a1a1a',
                    accent: '#e64a4e',
                    secondary: '#e58c3a',
                    muted: '#d5c39c',
                    white: '#fffdf7',
                    yellow: '#e8c440',
                    green: '#5b9e54',
                    purple: '#8e52a3',
                    blue: '#3666b3',
                }
            },
            fontFamily: {
                sans: ['"Fusion Pixel"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
                mono: ['"Fusion Pixel Mono"', '"Fusion Pixel"', 'monospace'],
                cnhy: ['"Fusion Pixel"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
                'pixel-display': ['"Press Start 2P"', 'monospace'],
                'pixel-ui': ['"Silkscreen"', 'monospace'],
            },
            boxShadow: {
                'neo-sm': '4px 4px 0px 0px #1a1a1a',
                'neo-md': '8px 8px 0px 0px #1a1a1a',
                'neo-lg': '12px 12px 0px 0px #1a1a1a',
                'neo-xl': '16px 16px 0px 0px #1a1a1a',
            },
            borderWidth: {
                DEFAULT: '4px',
                '2': '2px',
                '4': '4px',
                '8': '8px',
            },
            borderRadius: {
                none: '0px',
                full: '9999px', // Only for pills
            }
        },
    },
    plugins: [],
}
