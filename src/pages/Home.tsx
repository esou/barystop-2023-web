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
            gradientTo={'secondary'}
            height={'100%'}
            width={'100%'}
            columns={2}
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
            <GridItem colStart={2} colSpan={1} rowStart={1} rowSpan={1}>
                <MapComponent />
            </GridItem>
            <GridItem colStart={1} colSpan={1} rowStart={2} rowSpan={1}>
                <InstagramFeed />
            </GridItem>
            <GridItem colStart={2} colSpan={1} rowStart={2} rowSpan={1}>
                <RankingList />
            </GridItem>
            <GridItem colStart={1} colSpan={2} colEnd={2} rowStart={3} rowSpan={1}>
                <StatsList />
            </GridItem>
        </Grid>
    )
}

export default Home
