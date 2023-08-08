import { VictoryChart, VictoryScatter, VictoryLine, VictoryBar, VictoryAxis } from 'victory'
import Title from './Title'
import { token } from '../../styled-system/tokens'

interface Props {
    title: string
    stats: StatsData
    type?: 'line' | 'bar'
    className?: string
    inverted?: boolean
}

const StatsComponent = ({ title, stats, type = 'line', className, inverted }: Props) => {
    switch (type) {
        case 'line':
            return (
                <div className={className}>
                    <Title type="stats">{title}</Title>
                    <VictoryChart
                        domain={{
                            x: [stats.minDomain.x, stats.maxDomain.x],
                            y: [stats.minDomain.y, stats.maxDomain.y],
                        }}>
                        <VictoryAxis
                            orientation="left"
                            dependentAxis
                            tickValues={[]}
                            invertAxis={!!inverted}
                        />
                        <VictoryAxis orientation="bottom" tickValues={[]} />
                        <VictoryLine
                            data={stats.datas}
                            style={{
                                data: {
                                    stroke: token.var('colors.secondary'),
                                },
                            }}
                            animate={{
                                duration: 2000,
                                onLoad: { duration: 1000 },
                            }}
                        />
                        <VictoryScatter
                            style={{ data: { fill: token.var('colors.primary') } }}
                            size={5}
                            data={stats.datas}
                            animate={{
                                duration: 2000,
                                onLoad: { duration: 1000 },
                            }}
                        />
                    </VictoryChart>
                </div>
            )
        case 'bar':
            return (
                <div className={className}>
                    <Title type="stats">{title}</Title>
                    <VictoryChart
                        domain={{
                            x: [stats.minDomain.x, stats.maxDomain.x],
                            y: [stats.minDomain.y, stats.maxDomain.y],
                        }}>
                        <VictoryBar
                            data={stats.datas}
                            style={{
                                data: {
                                    fill: token.var('colors.secondary'),
                                },
                            }}
                            alignment="start"
                            animate={{
                                duration: 1000,
                                onLoad: { duration: 1000 },
                            }}
                        />
                    </VictoryChart>
                </div>
            )
    }
}

export default StatsComponent
