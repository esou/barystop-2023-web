import * as React from 'react'

import Card from './Card'
import { styled } from '../../styled-system/jsx'
import { getUsers } from '../services/webservices'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Title from './Title'

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
                <Slider
                    dots
                    infinite
                    autoplay
                    speed={1000}
                    autoplaySpeed={5000}
                    arrows={false}
                    className="center"
                    centerPadding="20px"
                    centerMode
                    slidesToShow={4}
                    slidesToScroll={4}
                    initialSlide={0}
                    responsive={[
                        {
                            breakpoint: 1200,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 4,
                                initialSlide: 0,
                            },
                        },
                        {
                            breakpoint: 600,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 2,
                                initialSlide: 0,
                            },
                        },
                        {
                            breakpoint: 500,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                initialSlide: 0,
                            },
                        },
                    ]}>
                    {users.map((u, i) => (
                        <styled.img key={i} src={u.picture} objectFit="cover" height="300px" />
                    ))}
                </Slider>
            </styled.div>
        </Card>
    )
}

export default Contenders
