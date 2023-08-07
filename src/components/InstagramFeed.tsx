import * as React from 'react'

import { getInstagrams } from '../services/webservices'

import Card from './Card'
import { AspectRatio, Grid, styled } from '../../styled-system/jsx'
import Title from './Title'
import { gridItem } from '../../styled-system/patterns'
import { useQuery } from 'react-query'

interface Props {
    limit?: number
}

const InstagramFeed: React.FC<Props> = ({ limit = 11 }) => {
    const {
        data: content = [],
        isLoading,
        isError,
    } = useQuery({ queryFn: () => getInstagrams(), queryKey: 'Instagrams' })
    const status = isLoading ? 'loading' : isError ? 'error' : 'fetched'

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
        <Card status={status} header={<Title type="card">En direct</Title>}>
            <Grid columns={3} height={'100%'}>
                <AspectRatio
                    onClick={() =>
                        window.open('https://instagram.com/barystop?igshid=MmIzYWVlNDQ5Yg==')
                    }
                    cursor="pointer"
                    className={gridItem({ colSpan: 2, rowSpan: 2 })}>
                    <styled.img src={'./barystop_qr.png'} alt="Instagram page" objectFit="cover" />
                </AspectRatio>
                {content.slice(0, limit).map((itm, idx) => (
                    <AspectRatio
                        key={idx}
                        ratio={1}
                        onClick={() => window.open(itm.permalink)}
                        cursor="pointer">
                        <InstagramItem itm={itm} />
                    </AspectRatio>
                ))}
            </Grid>
        </Card>
    )
}

export default InstagramFeed
