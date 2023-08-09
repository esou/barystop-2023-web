import * as React from 'react'

import { isAfter, isBefore, isSameDay } from 'date-fns'
import { useQueries } from 'react-query'
import { getScores, getUsers } from '../services/webservices'
import { Grid, HStack, Stack, styled } from '../../styled-system/jsx'

import Card from './Card'
import Title from './Title'
import StatsComponent from './StatsComponent'
import RankingTypePicker from './RankingTypePicker'
import { css } from '../../styled-system/css'
import { stack, circle, center } from '../../styled-system/patterns'

const SCORE_TYPES: Record<RankingType, ScoreType> = { green: 'point', red: 'point', yellow: 'time' }

const DEFAULT_STATS: StatsData = {
    minDomain: { x: 1, y: 0 },
    maxDomain: { x: 1, y: 0 },
    datas: [],
}

const StatsList = () => {
    const [type, setType] = React.useState<RankingType>('yellow')
    const [selectedUser, selectUser] = React.useState<UserData | undefined>(undefined)

    const [, startTransition] = React.useTransition()

    useQueries(
        (Object.keys(SCORE_TYPES) as RankingType[]).map((t) => ({
            queryKey: ['Scores', t],
            queryFn: () => getScores(t),
        }))
    )

    const queries = useQueries([
        { queryKey: ['Scores', type], queryFn: () => getScores(type) },
        { queryKey: ['Users'], queryFn: () => getUsers() },
    ])
    const [{ data: scores }, { data: users }] = queries

    React.useEffect(() => {
        if (!selectedUser) selectUser(users?.[0])
    }, [users])

    const status = queries.some((q) => q.isLoading)
        ? 'loading'
        : queries.some((q) => q.isError)
        ? 'error'
        : 'fetched'

    const hasData = (scores ?? []).findIndex((a) => isBefore(new Date(a.date), new Date())) !== -1
    const displayScore = (scoreAsNumber: number) => {
        if (SCORE_TYPES[type] === 'time') {
            const milliseconds = scoreAsNumber * 60
            const hours = Math.trunc(milliseconds / 3600)
            const minutes = Math.trunc((milliseconds - 3600 * hours) / 60)
            const seconds = Math.trunc(milliseconds - 3600 * hours - 60 * minutes)

            const libelle = hours + 'h ' + minutes + "' " + seconds + "''"
            return libelle
        }
        return scoreAsNumber
    }

    const sortedScores = React.useMemo(
        () =>
            (scores ?? []).reduce((acc, cur) => {
                // On va mapper chaque jour pour calculer le score de chacun chaque jour
                const currentDayDate = cur.date
                const currentDayScore = (users ?? [])
                    .map((u) => ({
                        ...u,
                        score: (scores ?? [])
                            .filter(
                                (s) =>
                                    isAfter(new Date(cur.date), new Date(s.date)) ||
                                    isSameDay(new Date(cur.date), new Date(s.date))
                            )
                            .reduce((pts, pt) => Number(pts) + pt[u.id], 0),
                    }))
                    .sort((a, b) =>
                        b.score === a.score
                            ? a.username.localeCompare(b.username)
                            : SCORE_TYPES[type] === 'point'
                            ? b.score - a.score
                            : a.score - b.score
                    )
                return [
                    ...acc,
                    {
                        date: currentDayDate,
                        users: currentDayScore,
                    },
                ]
            }, [] as ScorePerDay[]),
        [users, scores, type]
    )

    if (!selectedUser) {
        return <Card status={status} />
    }

    const scoreEvolution = (scores ?? []).reduce((acc, cur, idx) => {
        if (isAfter(new Date(cur.date), new Date())) {
            return acc
        }
        const x = acc.datas.length + 1
        const previousY =
            idx !== 0 &&
            (SCORE_TYPES[type] === 'time' ? acc.datas[idx - 1].y * 60 : acc.datas[idx - 1].y)
        const totalY = previousY ? cur[selectedUser?.id] + previousY : cur[selectedUser?.id]
        const y = SCORE_TYPES[type] === 'time' ? totalY / 60 : totalY
        return {
            minDomain: { x: Math.min(acc.minDomain.x, x), y: Math.min(acc.minDomain.y, y) },
            maxDomain: { x: Math.max(acc.maxDomain.x, x), y: Math.max(acc.maxDomain.y, y) },
            datas: [...acc.datas, { x, y }],
        }
    }, DEFAULT_STATS)

    const scorePerDay = (scores ?? []).reduce((acc, cur) => {
        if (isAfter(new Date(cur.date), new Date())) {
            return acc
        }
        const x = acc.datas.length + 1
        const y = SCORE_TYPES[type] === 'time' ? cur[selectedUser.id] / 60 : cur[selectedUser.id]
        return {
            minDomain: { x: Math.min(acc.minDomain.x, x), y: Math.min(acc.minDomain.y, y) },
            maxDomain: { x: Math.max(acc.maxDomain.x, x), y: Math.max(acc.maxDomain.y, y) },
            datas: [...acc.datas, { x, y }],
        }
    }, DEFAULT_STATS)

    const rankPerDay = sortedScores.reduce((acc, cur) => {
        if (isAfter(new Date(cur.date), new Date())) {
            return acc
        }
        const x = acc.datas.length + 1
        const y = cur.users.findIndex((a) => a.id === selectedUser.id) + 1
        return {
            minDomain: { x: 1, y: 1 },
            maxDomain: { x: Math.max(acc.maxDomain.x, x), y: (users ?? []).length },
            datas: [...acc.datas, { x, y }],
        }
    }, DEFAULT_STATS)

    const totalScore = scoreEvolution.datas[scoreEvolution.datas.length - 1]?.y
    const userRank =
        sortedScores[sortedScores.length - 1]?.users.findIndex((a) => a.id === selectedUser.id) + 1
    const rankLabel = userRank === 1 ? 'er' : 'ème'

    const selectTab = (rankingType: RankingType) => startTransition(() => setType(rankingType))

    return (
        <Card
            status={status}
            withoutPadding
            header={
                <Stack gap={0}>
                    <Title type="card" mb={-2}>
                        Les statistiques
                    </Title>
                    <RankingTypePicker selectType={selectTab} selectedType={type} />
                </Stack>
            }>
            <HStack height={'100%'}>
                <Stack
                    className={css({
                        bg: 'secondary',
                        height: '100%',
                        borderBottomLeftRadius: 'sm',
                        color: 'white',
                        justifyContent: 'space-evenly',
                        padding: 2,
                    })}>
                    {users?.map((user) => {
                        const selected = selectedUser.id === user.id
                        return (
                            <styled.div
                                onClick={() => selectUser(user)}
                                _hover={{
                                    cursor: 'pointer',
                                    '& > span': {
                                        opacity: selected ? '1' : '0.75',
                                    },
                                }}
                                className={center({ flexDir: 'column' })}
                                key={user.id}>
                                <img
                                    src={user.picture}
                                    alt={user.username}
                                    className={circle({
                                        size: 35,
                                        objectFit: 'cover',
                                        borderWidth: '2px',
                                        borderColor: selected ? 'primary' : 'primary',
                                        borderStyle: selected ? 'solid' : 'inset',
                                        zIndex: 1,
                                    })}
                                />
                                <styled.span
                                    fontSize={'xs'}
                                    bg={'primary'}
                                    color={selected ? 'secondary' : 'black'}
                                    borderRadius="full"
                                    paddingX={2}
                                    marginTop={-1}
                                    opacity={selected ? '1' : '0'}>
                                    {user.username}
                                </styled.span>
                            </styled.div>
                        )
                    })}
                </Stack>
                {hasData ? (
                    <Grid
                        height={'100%'}
                        width={'100%'}
                        columns={2}
                        margin={2}
                        padding={2}
                        smDown={{ display: 'flex', flexDirection: 'column' }}>
                        <Stack>
                            <Title type="stats">{`Statistiques de ${selectedUser?.username}`}</Title>
                            <span>{`Position actuelle : ${userRank}${rankLabel}`}</span>
                            <span>
                                {` ${
                                    SCORE_TYPES[type] === 'time'
                                        ? 'Temps total cumulé'
                                        : 'Score cumulé'
                                } :  ${displayScore(totalScore)}`}
                            </span>
                        </Stack>
                        <StatsComponent
                            className={stack({ justify: 'center', gap: 0 })}
                            title={'Position au classement général'}
                            type="line"
                            stats={rankPerDay}
                            inverted
                        />
                        <StatsComponent
                            className={stack({ justify: 'center', gap: 0 })}
                            title={
                                SCORE_TYPES[type] === 'time'
                                    ? 'Temps de trajet à chaque étape'
                                    : 'Score obtenu par jour'
                            }
                            type="bar"
                            stats={scorePerDay}
                        />
                        <StatsComponent
                            className={stack({ justify: 'center', gap: 0 })}
                            title={
                                SCORE_TYPES[type] === 'time'
                                    ? 'Cumul du temps de trajet'
                                    : 'Évolution du score total'
                            }
                            type="line"
                            stats={scoreEvolution}
                        />
                    </Grid>
                ) : (
                    <Stack align={'center'} justify={'center'} height={'100%'} width={'100%'}>
                        <styled.img src="./calculatrice.gif" height={'100px'} />
                        <div>{'Les calculs ne sont pas bons Kévin.'}</div>
                        <div>{'Les statistiques arrivent bientôt !'}</div>
                    </Stack>
                )}
            </HStack>
        </Card>
    )
}

export default StatsList
