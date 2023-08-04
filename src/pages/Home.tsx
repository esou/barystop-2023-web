import { Link } from 'react-router-dom'
import { Container } from '../../styled-system/jsx'
import RankingList from '../components/RankingList'

const Home: React.FC = () => {
    return (
        <Container>
            <Link to={'/statistics'}>Statistics</Link>
            <RankingList type={'yellow'} />
        </Container>
    )
}

export default Home
