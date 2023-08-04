import { HashRouter, Route, Routes } from 'react-router-dom'
import routes from './routes'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <HashRouter>
                <Routes>
                    {routes.map(({ path, Component }) => (
                        <Route key={path} path={path} Component={Component} />
                    ))}
                </Routes>
            </HashRouter>
        </QueryClientProvider>
    )
}

export default App
