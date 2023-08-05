import { cva } from '../../styled-system/css'
import { styled } from '../../styled-system/jsx'

const cardStyle = cva({
    base: {
        display: 'flex',
        flexDirection: 'column',
        padding: '2',
        bg: 'whitesmoke',
        borderRadius: 'md',
        boxShadow: 'sm',
    },
})

export default styled('div', cardStyle)
