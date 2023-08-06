import * as React from 'react'

import Card from './Card'
import { Flex } from '../../styled-system/jsx'
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
import { getSteps } from '../services/webservices'
import { format, isBefore } from 'date-fns'
import { LatLngBoundsExpression, LatLngExpression } from 'leaflet'

const DEFAULT_ZOOM = 11
const DEFAULT_LOC = { lat: 48.864716, lng: 2.349014 }

const MapComponent = () => {
    const [status, setStatus] = React.useState<CardStatus>('loading')
    const [steps, setSteps] = React.useState<StepData[]>([])
    const [polyline, setPolyline] = React.useState<LatLngExpression[][]>([])

    React.useEffect(() => {
        getSteps()
            .then((res) => {
                const visible_steps = res
                    .filter((s) => isBefore(new Date(s.date), new Date()))
                    .slice(0, 10)
                setSteps(visible_steps)
                setPolyline(
                    visible_steps.map((a) => [
                        a.lat as unknown as LatLngExpression,
                        a.lon as unknown as LatLngExpression,
                    ])
                )
                setStatus('fetched')
            })
            .catch(() => setStatus('error'))
    })

    return (
        <Card status={status}>
            <Flex height={'100%'}>
                <MapContainer
                    bounds={polyline as unknown as LatLngBoundsExpression}
                    center={DEFAULT_LOC}
                    zoom={steps.length < 2 ? DEFAULT_ZOOM : undefined}
                    style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Polyline positions={polyline} />
                    {steps.map((step, idx) => (
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
                                            : `${steps[idx - 1].city} - ${step.city}`}
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
