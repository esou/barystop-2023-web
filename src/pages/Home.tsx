import { Grid, GridItem } from '../../styled-system/jsx'
import RankingList from '../components/RankingList'
import Card from '../components/Card'
import { InstagramEmbed } from 'react-social-media-embed'

const Home: React.FC = () => {
    return (
        <Grid
            bgGradient={'to-br'}
            gradientFrom={'sky.200'}
            gradientTo={'primary'}
            height={'100%'}
            width={'100%'}
            columns={3}
            gap={3}
            padding={3}
            smDown={{ display: 'flex', flexDirection: 'column' }}>
            <GridItem rowSpan={2}>
                <RankingList type="yellow" />
            </GridItem>
            <GridItem colSpan={2}>
                <Card status="fetched">map</Card>
            </GridItem>
            <GridItem colStart={2}>
                <Card status="fetched">etape du jour</Card>
            </GridItem>
            <GridItem rowSpan={2}>
                <InstagramEmbed url="https://www.instagram.com/p/CsmF6elIkgK/" />
            </GridItem>
            <GridItem colSpan={2}>
                <Card status="fetched">concurrents</Card>
            </GridItem>
        </Grid>
    )
}

export default Home
