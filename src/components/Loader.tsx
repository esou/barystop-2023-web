import { Rings } from 'react-loader-spinner'
import { Flex } from '../../styled-system/jsx'
import { token } from '../../styled-system/tokens'

const Loader = () => (
    <Flex alignItems={'center'} justifyContent={'center'} height={'100%'}>
        <Rings color={token.var('colors.primary')} />
    </Flex>
)

export default Loader
