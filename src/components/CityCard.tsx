import { format } from 'date-fns'
import { AspectRatio, Divider, Flex, Grid, Stack, styled } from '../../styled-system/jsx'
import Card from './Card'
import Title from './Title'
import { gridItem } from '../../styled-system/patterns'
import Distance from './Distance'
import ReactCountryFlag from 'react-country-flag'
import Weather from './Weather'

interface Props extends Omit<StepData, 'id'> {
    status: CardStatus
    previousStep?: StepData
    competitionStarted?: boolean
}

const CityCard: React.FC<Props> = ({
    status,
    city,
    image,
    lat,
    lon,
    date,
    previousStep,
    countryCode,
    competitionStarted,
}) => {
    return (
        <Card
            status={status}
            headerVariant={{ color: 'light' }}
            type={'bordered'}
            header={
                <Stack
                    position="absolute"
                    top={0}
                    right={0}
                    bg="secondary"
                    color="primary"
                    textTransform="uppercase"
                    textAlign="center"
                    height="75px"
                    width="75px"
                    gap="0.5"
                    fontSize="sm"
                    justifyContent="center"
                    lineHeight="tight"
                    boxShadow="xs"
                    zIndex={1}>
                    <span>{format(new Date(date), 'EEE')}</span>
                    <styled.span fontSize={'lg'}>{format(new Date(date), 'dd')}</styled.span>
                    <span>{format(new Date(date), 'MMM')}</span>
                </Stack>
            }>
            <Stack width={'50%'} zIndex={1}>
                <Title type="city">{city ?? 'Paris'}</Title>
                <Divider mt="1" width="25%" alignSelf="center" color="secondary" />
            </Stack>
            <AspectRatio position="absolute" top="0" left="0" bottom="0" right="60%" zIndex={0}>
                <img src={image} />
            </AspectRatio>

            <Grid
                columns={2}
                position={'absolute'}
                bottom="0"
                right="0"
                left="40%"
                top="30%"
                padding={2}>
                <Flex className={gridItem({ colSpan: 2 })} align={'center'} justify={'center'}>
                    <Weather latitude={lat} longitude={lon} />
                </Flex>
                <Flex align={'center'} justify={'center'}>
                    {previousStep ? (
                        <Distance
                            to={{ latitude: lat, longitude: lon }}
                            from={{
                                latitude: previousStep.lat,
                                longitude: previousStep.lon,
                                name: previousStep.city,
                            }}
                        />
                    ) : (
                        !competitionStarted && (
                            <Stack
                                fontSize={'xs'}
                                align={'center'}
                                justify={'center'}
                                textAlign={'center'}>
                                {/* <Loader /> */}
                                <span>la compétition n'a pas commencé</span>
                            </Stack>
                        )
                    )}
                </Flex>
                <Flex align={'center'} justify={'center'}>
                    <ReactCountryFlag countryCode={countryCode} style={{ fontSize: '2rem' }} />
                </Flex>
            </Grid>
        </Card>
    )
}

export default CityCard
