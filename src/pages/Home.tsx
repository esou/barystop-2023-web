import { Grid, GridItem } from '../../styled-system/jsx'

import RankingList from '../components/RankingList'
import InstagramFeed from '../components/InstagramFeed'
import Today from '../components/Today'
import MapComponent from '../components/Map'
import StatsList from '../components/StatsList'

const Home: React.FC = () => {
    return (
        <Grid
            bgGradient={'to-br'}
            gradientFrom={'sky.200'}
            gradientTo={'primary'}
            height={'100%'}
            width={'100%'}
            columns={4}
            gap={3}
            padding={3}
            smDown={{ display: 'flex', flexDirection: 'column' }}>
            <GridItem
                smDown={{ height: '300px' }}
                colStart={1}
                colSpan={1}
                rowStart={1}
                rowSpan={1}>
                <Today />
            </GridItem>
            <GridItem colSpan={2}>
                <MapComponent />
            </GridItem>
            <GridItem>
                <InstagramFeed limit={5} />
            </GridItem>
            <GridItem>
                <RankingList />
            </GridItem>
            <GridItem colSpan={3}>
                <StatsList />
            </GridItem>
        </Grid>
    )
}

export default Home
