import { cva } from '../../styled-system/css'
import { styled } from '../../styled-system/jsx'

const cardHeaderStyles = cva({
    base: {
        borderTopRadius: 'md',
        marginX: -2,
        marginTop: -2,
    },
    variants: {
        color: {
            dark: { bg: 'secondary', color: 'whitesmoke' },
        },
    },
    defaultVariants: {
        color: 'dark',
    },
})

export default styled('div', cardHeaderStyles)
