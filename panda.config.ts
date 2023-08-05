import { defineConfig } from '@pandacss/dev'

export default defineConfig({
    // Whether to use css reset
    preflight: true,

    // Where to look for your css declarations
    include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

    // Files to exclude
    exclude: [],

    // Useful for theme customization
    theme: {
        extend: {
            tokens: {
                colors: {
                    primary: { value: '#89d9d6' },
                    secondary: { value: '#163e59' },
                    tinder: {
                        primary: { value: '#E94463' },
                        secondary: { value: '#F3A361' },
                    },
                },
            },
        },
    },
    globalCss: {
        body: {
            minHeight: '100vh',
            minWidth: '100%',
            display: 'flex',
        },
        '#root': {
            width: '-webkit-fill-available',
        },
    },

    // The output directory for your css system
    outdir: 'styled-system',
    jsxFramework: 'react',
})
