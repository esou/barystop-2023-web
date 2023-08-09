import Card from './Card'
import { Flex } from '../../styled-system/jsx'
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
import { getSteps } from '../services/webservices'
import { format, isBefore } from 'date-fns'
import { LatLngBoundsExpression, LatLngExpression } from 'leaflet'
import Title from './Title'
import { useQuery } from 'react-query'

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
                    <Polyline positions={polyline} />
                    {visibleSteps.map((step, idx) => (
                        <Marker key={idx} position={{ lat: step.lat, lng: step.lon }}>
                            <Popup>
                                <div>
                                    <div>
                                        {`${format(new Date(step.date), 'dd/MM/YYYYY')} - Étape ${
                                            idx + 1
                                        }`}
                                    </div>
                                    <div>
                                        {idx === 0
                                            ? `Départ de ${step.city}`
                                            : `${visibleSteps[idx - 1].city} - ${step.city}`}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </Flex>
        </Card>
    )
}

export default MapComponent
