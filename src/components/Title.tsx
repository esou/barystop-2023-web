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
        },
    },
})

export default styled('h2', titleStyles)