import { BrowserRouter, Route, Routes } from 'react-router-dom'
import routes from './routes'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    {routes.map(({ path, Component }) => (
                        <Route key={path} path={path} Component={Component} />
                    ))}
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default App
