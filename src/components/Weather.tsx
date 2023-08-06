import * as React from 'react'

import { AspectRatio, Flex, HStack, Stack, styled } from '../../styled-system/jsx'
import { getMeteo } from '../services/webservices'

const Weather = ({ latitude, longitude }: LatLong) => {
    const [currentWeather, setCurrentWeather] = React.useState<WeatherData | undefined>()

    React.useEffect(() => {
        getMeteo(latitude, longitude).then((res) => {
            setCurrentWeather(res)
        })
    }, [])

    const imagePath = React.useMemo(() => {
        if (!currentWeather) {
            return './weather/girouette.gif'
        }

        switch (Math.trunc(currentWeather?.weathercode / 10)) {
            case 0:
                return './weather/sun.gif'
            case 1:
                return './weather/cloudy.gif'
            case 2:
                return './weather/clouds.gif'
            case 3:
                return './weather/rainsun.gif'
            case 4:
                return './weather/drizzle.gif'
            case 5:
                return './weather/rain.gif'
            case 6:
                return './weather/rain.gif'
            case 7:
                return './weather/rain.gif'
            case 8:
                return './weather/snow.gif'
            case 9:
                return './weather/storm.gif'
            default:
                return './weather/girouette.gif'
        }
    }, [currentWeather])

    return (
        <HStack>
            <Flex align={'center'} justify={'center'}>
                <AspectRatio height={'75px'} width={'75px'}>
                    <img src={imagePath} />
                </AspectRatio>
            </Flex>
            {currentWeather && (
                <Stack justify={'space-around'} align={'center'} color={'secondary'}>
                    <styled.span fontSize={'sm'} fontWeight={'medium'}>
                        {currentWeather.temperature}°C
                    </styled.span>
                    <Flex>
                        <styled.span fontSize={'xs'}>
                            {currentWeather.min}°C - {currentWeather.max}°C
                        </styled.span>
                    </Flex>
                </Stack>
            )}
        </HStack>
    )
}

export default Weather
