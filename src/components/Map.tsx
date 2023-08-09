import Card from './Card'
import { Circle, Divider, Flex, Stack } from '../../styled-system/jsx'
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
import { getSteps } from '../services/webservices'
import { format, isBefore } from 'date-fns'
import { DivIcon, LatLngBoundsExpression, LatLngExpression } from 'leaflet'
import Title from './Title'
import { useQuery } from 'react-query'
import { renderToString } from 'react-dom/server'
import { token } from '../../styled-system/tokens'

const DEFAULT_ZOOM = 11
const DEFAULT_LOC = { lat: 48.864716, lng: 2.349014 }

const MapComponent = () => {
    const {
        data: steps,
        isLoading,
        isError,
    } = useQuery({ queryKey: ['Steps'], queryFn: () => getSteps() })

    const status = isLoading ? 'loading' : isError ? 'error' : 'fetched'

    const visibleSteps = (steps ?? []).filter((s) => isBefore(new Date(s.date), new Date()))

    const polyline = visibleSteps.map((a) => [
        a.lat as unknown as LatLngExpression,
        a.lon as unknown as LatLngExpression,
    ])

    return (
        <Card
            status={status}
            withoutPadding
            header={<Title type="card">Résumé du trajet parcouru</Title>}>
            <Flex height={'100%'} borderBottomRadius={'sm'} overflow={'hidden'}>
                <MapContainer
                    bounds={polyline as unknown as LatLngBoundsExpression}
                    center={
                        visibleSteps.length === 1
                            ? { lat: visibleSteps[0].lat, lng: visibleSteps[0].lon }
                            : DEFAULT_LOC
                    }
                    zoom={visibleSteps.length < 2 ? DEFAULT_ZOOM : undefined}
                    style={{
                        height: '100%',
                        width: '100%',
                        minHeight: '300px',
                    }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Polyline positions={polyline} color={token('colors.secondary')} />
                    {visibleSteps.map((step, idx) => (
                        <Marker
                            key={idx}
                            position={{ lat: step.lat, lng: step.lon }}
                            icon={
                                new DivIcon({
                                    html: renderToString(
                                        <Circle
                                            bg={'primary'}
                                            size={'20px'}
                                            position="relative"
                                            top={'-5px'}
                                            left={'-5px'}
                                            boxShadow={`2px 2px 0px token(colors.secondary)`}
                                            border={`2px solid token(colors.secondary)`}
                                        />
                                    ),
                                })
                            }>
                            <Popup>
                                <Stack fontFamily={'paris'} color={'secondary'}>
                                    <div>
                                        {`${format(new Date(step.date), 'dd/MM/YYYYY')} - Étape ${
                                            idx + 1
                                        }`}
                                    </div>
                                    <Divider
                                        color={'primary'}
                                        thickness={'2px'}
                                        width={'33%'}
                                        alignSelf={'center'}
                                    />
                                    <div>
                                        {idx === 0
                                            ? `Départ de ${step.city}`
                                            : `${visibleSteps[idx - 1].city} - ${step.city}`}
                                    </div>
                                </Stack>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </Flex>
        </Card>
    )
}

export default MapComponent
