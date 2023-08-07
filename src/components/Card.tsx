import { PropsWithChildren, ReactNode } from 'react'
import { RecipeVariantProps, cva } from '../../styled-system/css'
import { Flex, styled } from '../../styled-system/jsx'
import { token } from '../../styled-system/tokens'
import { Radio } from 'react-loader-spinner'
import Loader from './Loader'
import CardHeader, { CardHeaderVariants } from './CardHeader'

const cardStyle = cva({
    base: {
        display: 'flex',
        flexDirection: 'column',
        bg: 'white',
        borderRadius: 'md',
        boxShadow: 'sm',
        height: '100%',
        position: 'relative',
        '& .ContentContainer': {
            padding: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        },
    },
    variants: {
        type: {
            bordered: {
                borderWidth: 2,
                borderColor: 'secondary',
            },
        },
        withoutPadding: {
            true: {
                '& .ContentContainer': {
                    padding: 0,
                },
            },
        },
    },
})

type Props = PropsWithChildren<{
    status?: CardStatus
    header?: ReactNode
    headerVariant?: CardHeaderVariants
}> &
    RecipeVariantProps<typeof cardStyle>

const Card: React.FC<Props> = ({ status, children, header, headerVariant, ...cardVariants }) => {
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
        <div className={cardStyle(cardVariants)}>
            {header && <CardHeader {...headerVariant}>{header}</CardHeader>}
            <div className="ContentContainer">{renderContent()}</div>
        </div>
    )
}

export default Card
