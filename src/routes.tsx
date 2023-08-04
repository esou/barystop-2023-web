import { RouteObject } from 'react-router-dom'
import Home from './pages/Home'

const routes: RouteObject[] = [
    {
        Component: Home,
        path: '/',
    },
    {
        path: '/statistics',
        Component: () => <div>En construction</div>,
    },
]

export default routes
