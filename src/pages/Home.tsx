import { Grid } from '../../styled-system/jsx'
import RankingList from '../components/RankingList'
import Card from '../components/Card'
import { gridItem } from '../../styled-system/patterns'
import EmbeddedInstagram from '../components/EmbeddedInstagram'

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
            padding={3}>
            <Card className={gridItem({ rowSpan: 2 })}>
                <RankingList type={'yellow'} />
            </Card>
            <Card className={gridItem({ colSpan: 2 })}>coucou</Card>
            <Card className={gridItem({ colStart: 2 })}>coucou</Card>
            <Card>
                <EmbeddedInstagram />
            </Card>
        </Grid>
    )
}

export default Home
