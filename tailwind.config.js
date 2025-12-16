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
                neo: {
                    bg: '#FFFDF5', // Cream/Off-White
                    ink: '#000000', // Pure Black
                    accent: '#FF6B6B', // Hot Red
                    secondary: '#FFD93D', // Vivid Yellow
                    muted: '#C4B5FD', // Soft Violet
                    white: '#FFFFFF',
                }
            },
            fontFamily: {
                sans: ['"Space Grotesk"', 'sans-serif'],
            },
            boxShadow: {
                'neo-sm': '4px 4px 0px 0px #000',
                'neo-md': '8px 8px 0px 0px #000',
                'neo-lg': '12px 12px 0px 0px #000',
                'neo-xl': '16px 16px 0px 0px #000',
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
