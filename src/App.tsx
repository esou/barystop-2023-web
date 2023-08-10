import { HashRouter, Route, Routes } from 'react-router-dom'
import routes from './routes'
import { QueryClient, QueryClientProvider } from 'react-query'
import { setDefaultOptions } from 'date-fns'
import { fr } from 'date-fns/locale'
import React from 'react'
import { token } from '../styled-system/tokens'

const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity, refetchInterval: 60 * 60 * 1000 } },
})

function App() {
    setDefaultOptions({ locale: fr })

    React.useEffect(() => {
        console.log(
            '%cGros malins, pas de spoil SVP ;)',
            `color: ${token('colors.primary')}; font-size: 50px;`
        )
    }, [])

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
