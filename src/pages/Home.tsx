import { Container } from '../../styled-system/jsx'
import RankingList from '../components/RankingList'

const Home: React.FC = () => {
    return (
        <Container>
            <RankingList type={'yellow'} />
        </Container>
    )
}

export default Home
