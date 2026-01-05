/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'quantum-dark': '#0f172a',
                'quantum-light': '#f8fafc',
                'quantum-accent': '#8b5cf6'
            }
        },
    },
    plugins: [],
}
