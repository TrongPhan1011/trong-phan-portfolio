/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                'tp-orange': '#F85023',
            },
            boxShadow: {
                '2t-blue-1': ' 0px 0px 15px 3px rgba(0, 194, 255, 0.01)',
                '2t-green-1': ' 0px 0px 15px 3px rgba(0, 200, 44, 0.01)',
            },
            backgroundImage: {
                'tp-slider': "url('/src/assets/img/bg-slider.jpeg')",
            },
            screens: {
                xs: '600px',
            },
        },
    },
    plugins: [],
};
