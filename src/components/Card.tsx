import { PropsWithChildren, ReactNode } from 'react'
import { cva } from '../../styled-system/css'
import { Flex, styled } from '../../styled-system/jsx'
import { token } from '../../styled-system/tokens'
import { Radio } from 'react-loader-spinner'
import Loader from './Loader'
import CardHeader from './CardHeader'

const cardStyle = cva({
    base: {
        display: 'flex',
        flexDirection: 'column',
        padding: '2',
        bg: 'white',
        borderRadius: 'md',
        boxShadow: 'sm',
        height: '100%',
    },
})

interface Props extends PropsWithChildren {
    status?: CardStatus
    header?: ReactNode
}

const Card: React.FC<Props> = ({ status, children, header }) => {
    const renderContent = () => {
        switch (status) {
            case 'error':
                return (
                    <Flex
                        alignItems={'center'}
                        height={'100%'}
                        justifyContent={'center'}
                        flexDirection={'column'}>
                        <Radio
                            colors={[
                                token.var('colors.red.100'),
                                token.var('colors.red.200'),
                                token.var('colors.red.300'),
                            ]}
                        />
                        <styled.p color={'red.500'} textAlign={'center'}>
                            Mmh... pas de réseau?
                        </styled.p>
                    </Flex>
                )
            case 'fetched':
                return children
            case 'loading':
            default:
                return <Loader />
        }
    }
    return (
        <div className={cardStyle()}>
            {header && <CardHeader>{header}</CardHeader>}
            {renderContent()}
        </div>
    )
}

export default Card
