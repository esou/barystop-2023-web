import { Grid, GridItem } from '../../styled-system/jsx'

import Card from '../components/Card'

import RankingList from '../components/RankingList'
import InstagramFeed from '../components/InstagramFeed'
import Today from '../components/Today'

const Home: React.FC = () => {
    return (
        <Grid
            bgGradient={'to-br'}
            gradientFrom={'sky.200'}
            gradientTo={'secondary'}
            height={'100%'}
            width={'100%'}
            columns={3}
            gap={3}
            padding={3}
            smDown={{ display: 'flex', flexDirection: 'column' }}>
            <GridItem rowSpan={2}>
                <RankingList />
            </GridItem>
            <GridItem colSpan={2}>
                <Card status="loading">map</Card>
            </GridItem>
            <GridItem colStart={2}>
                <Today />
            </GridItem>
            <GridItem rowSpan={2}>
                <InstagramFeed />
            </GridItem>
            <GridItem colSpan={2}>
                <Card status="fetched">concurrents</Card>
            </GridItem>
        </Grid>
    )
}

export default Home
