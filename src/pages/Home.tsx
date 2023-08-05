import { Grid, GridItem } from '../../styled-system/jsx'
import RankingList from '../components/RankingList'
import Card from '../components/Card'
import { gridItem } from '../../styled-system/patterns'
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
            <Card className={gridItem({ rowSpan: 2 })}>
                <RankingList type="yellow" />
            </Card>
            <Card className={gridItem({ colSpan: 2 })}></Card>
            <Card className={gridItem({ colStart: 2 })}>etape du jour</Card>
            <GridItem rowSpan={2}>
                <InstagramEmbed url="https://www.instagram.com/p/CsmF6elIkgK/" />
            </GridItem>
            <Card className={gridItem({ colSpan: 2 })}> concurrents</Card>
        </Grid>
    )
}

export default Home
