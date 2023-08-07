import { Grid, GridItem } from '../../styled-system/jsx'

import RankingList from '../components/RankingList'
import InstagramFeed from '../components/InstagramFeed'
import Today from '../components/Today'
import MapComponent from '../components/Map'
import Contenders from '../components/Contenders'

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
                <MapComponent />
            </GridItem>
            <GridItem colStart={2} smDown={{ height: '300px' }}>
                <Today />
            </GridItem>
            <GridItem rowSpan={2}>
                <InstagramFeed />
            </GridItem>
            <GridItem colSpan={2}>
                <Contenders />
            </GridItem>
        </Grid>
    )
}

export default Home
