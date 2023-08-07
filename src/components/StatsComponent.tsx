import * as React from 'react'
import { VictoryChart, VictoryScatter, VictoryLine, VictoryBar } from 'victory'

interface Props {
    title: string
    stats: StatsData
    type?: 'line' | 'bar'
}

const StatsComponent = ({ title, stats, type = 'line' }: Props) => {
    switch (type) {
        case 'line':
            return (
                <>
                    <div>
                        <div>{title}</div>
                    </div>
                    <VictoryChart
                        height={300}
                        domain={{
                            x: [stats.minDomain.x, stats.maxDomain.x],
                            y: [stats.minDomain.y, stats.maxDomain.y],
                        }}>
                        <VictoryLine
                            data={stats.datas}
                            style={{
                                data: {
                                    stroke: '#F00',
                                },
                            }}
                            animate={{
                                duration: 2000,
                                onLoad: { duration: 1000 },
                            }}
                        />
                        <VictoryScatter
                            style={{ data: { fill: '#F00' } }}
                            size={5}
                            data={stats.datas}
                            animate={{
                                duration: 2000,
                                onLoad: { duration: 1000 },
                            }}
                        />
                    </VictoryChart>
                </>
            )
        case 'bar':
            return (
                <>
                    <div>
                        <div>{title}</div>
                    </div>
                    <VictoryChart
                        height={300}
                        domain={{
                            x: [stats.minDomain.x, stats.maxDomain.x],
                            y: [stats.minDomain.y, stats.maxDomain.y],
                        }}>
                        <VictoryBar
                            data={stats.datas}
                            style={{
                                data: {
                                    fill: '#F00',
                                },
                            }}
                            alignment="start"
                            animate={{
                                duration: 1000,
                                onLoad: { duration: 1000 },
                            }}
                        />
                    </VictoryChart>
                </>
            )
    }
}

export default StatsComponent
