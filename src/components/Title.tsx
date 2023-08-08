import { cva } from '../../styled-system/css'
import { styled } from '../../styled-system/jsx'

const titleStyles = cva({
    base: {
        fontWeight: 'medium',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    variants: {
        type: {
            card: { paddingY: 2 },
            city: {
                bg: 'primary',
                color: 'secondary',
                lineHeight: 'tight',
                fontSize: 'xl',
            },
            stats: {
                bg: 'primary',
                color: 'secondary',
                fontWeight: 'light',
            },
        },
    },
})

const Title = styled('h2', titleStyles)

export default Title
