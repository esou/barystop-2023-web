import { BrowserRouter, Route, Routes } from 'react-router-dom'
import routes from './routes'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {routes.map(({ path, Component }) => (
                    <Route key={path} path={path} Component={Component} />
                ))}
            </Routes>
        </BrowserRouter>
    )
}

export default App
