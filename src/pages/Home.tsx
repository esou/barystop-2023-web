import { css } from '../../styled-system/css'
import RankingList from '../components/RankingList'

const Home: React.FC = () => {
    return (
        // <div className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'cool' })}>Hello 🐼!</div>
        <RankingList type={'yellow'} />
    )
}

export default Home
