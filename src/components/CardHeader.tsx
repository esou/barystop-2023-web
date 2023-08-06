import { RecipeVariantProps, cva } from '../../styled-system/css'
import { styled } from '../../styled-system/jsx'

const cardHeaderStyles = cva({
    base: {
        borderTopRadius: 'md',
    },
    variants: {
        color: {
            dark: { bg: 'secondary', color: 'white', marginX: -2, marginTop: -2 },
            light: { bg: 'white', color: 'secondary' },
        },
    },
    defaultVariants: {
        color: 'dark',
    },
})

export type CardHeaderVariants = RecipeVariantProps<typeof cardHeaderStyles>

export default styled('div', cardHeaderStyles)
