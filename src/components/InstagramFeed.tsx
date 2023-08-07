import * as React from 'react'

import { getInstagrams } from '../services/webservices'

import Card from './Card'
import { AspectRatio, Grid, styled } from '../../styled-system/jsx'
import Title from './Title'

const InstagramFeed = () => {
    const [status, setStatus] = React.useState<CardStatus>()
    const [content, setContent] = React.useState<InstagramItem[]>([])

    React.useEffect(() => {
        getInstagrams()
            .then((res) => {
                setContent(res)
                setStatus('fetched')
            })
            .catch(() => {
                setStatus('error')
            })
    }, [])

    const InstagramItem = ({ itm }: { itm: InstagramItem }) => {
        switch (itm.media_type) {
            case 'IMAGE':
            case 'CAROUSEL_ALBUM':
                return <styled.img src={itm.media_url} alt={itm.caption} objectFit="cover" />
            case 'VIDEO':
                return <styled.img src={itm.thumbnail_url} alt={itm.caption} objectFit="cover" />
            default:
                return null
        }
    }

    return (
        <Card status={status} header={<Title type="card">Des nouvelles de la compétition</Title>}>
            <Grid columns={3} gridTemplateRows={3}>
                {content.slice(0, 14).map((itm, idx) => (
                    <>
                        {idx === 2 && (
                            <AspectRatio
                                key={'fixed_ig_link'}
                                onClick={() =>
                                    window.open(
                                        'https://instagram.com/barystop?igshid=MmIzYWVlNDQ5Yg=='
                                    )
                                }
                                cursor="pointer">
                                <styled.img
                                    src={'./barystop_qr.png'}
                                    alt="Instagram page"
                                    objectFit="cover"
                                />
                            </AspectRatio>
                        )}
                        <AspectRatio
                            ratio={1}
                            key={idx}
                            onClick={() => window.open(itm.permalink)}
                            cursor="pointer">
                            <InstagramItem itm={itm} />
                        </AspectRatio>
                    </>
                ))}
            </Grid>
        </Card>
    )
}

export default InstagramFeed
