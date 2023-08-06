import { Stack, styled } from '../../styled-system/jsx'

const R = 6371

interface Props {
    from: LatLong & { name: string }
    to: LatLong
}

const Distance = ({ from, to }: Props) => {
    const { acos, sin, cos, trunc, PI } = Math
    const latA = to.latitude * (PI / 180)
    const lonA = to.longitude * (PI / 180)
    const latB = from.latitude * (PI / 180)
    const lonB = from.longitude * (PI / 180)
    const distance = R * acos(sin(latA) * sin(latB) + cos(latA) * cos(latB) * cos(lonA - lonB))
    const cityDistance = trunc(distance)

    return (
        <Stack align={'center'} textAlign={'center'}>
            <styled.span
                bg="secondary"
                color="white"
                lineHeight="tight"
                fontSize={'sm'}
                fontWeight={'medium'}
                px={2}
                borderRadius={'full'}>
                {cityDistance} km
            </styled.span>
            <styled.span fontSize={'xs'}>depuis {from.name}</styled.span>
        </Stack>
    )
}

export default Distance
