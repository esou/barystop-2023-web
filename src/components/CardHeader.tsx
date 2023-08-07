import { RecipeVariantProps, cva } from '../../styled-system/css'
import { styled } from '../../styled-system/jsx'

const cardHeaderStyles = cva({
    base: {
        borderTopRadius: 'md',
    },
    variants: {
        color: {
            dark: { bg: 'secondary', color: 'white' },
            light: { bg: 'white', color: 'secondary' },
        },
    },
    defaultVariants: {
        color: 'dark',
    },
})

export type CardHeaderVariants = RecipeVariantProps<typeof cardHeaderStyles>

const CardHeader = styled('div', cardHeaderStyles)

export default CardHeader
