import * as React from 'react'

import Card from './Card'
import { styled } from '../../styled-system/jsx'
import { getUsers } from '../services/webservices'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Title from './Title'

const SLIDER_SETTINGS = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
}

const Contenders = () => {
    const [status, setStatus] = React.useState<CardStatus>('loading')
    const [users, setUsers] = React.useState<UserData[]>([])

    React.useEffect(() => {
        getUsers()
            .then((res) => {
                setUsers(res)
                setStatus('fetched')
            })
            .catch(() => setStatus('error'))
    })

    return (
        <Card status={status} header={<Title type="card">Les concurrents</Title>}>
            <styled.div>
                <Slider {...SLIDER_SETTINGS}>
                    {users.map((u, i) => (
                        <styled.img key={i} src={u.picture} objectFit="cover" height="300px" />
                    ))}
                </Slider>
            </styled.div>
        </Card>
    )
}

export default Contenders
