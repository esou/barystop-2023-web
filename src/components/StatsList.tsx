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

    const has_datas = (scores ?? []).findIndex((a) => isBefore(new Date(a.date), new Date())) !== -1
    const display_score = (score_in_number: number) => {
        if (SCORE_TYPES[type] === 'time') {
            const milliseconds = score_in_number * 60
            const hours = Math.trunc(milliseconds / 3600)
            const minutes = Math.trunc((milliseconds - 3600 * hours) / 60)
            const seconds = Math.trunc(milliseconds - 3600 * hours - 60 * minutes)

            const libelle = hours + 'h ' + minutes + "' " + seconds + "''"
            return libelle
        }
        return score_in_number
    }

    const sorted_scores = React.useMemo(
        () =>
            (scores ?? []).reduce((acc, cur) => {
                // On va mapper chaque jour pour calculer le score de chacun chaque jour
                const date_du_jour = cur.date
                const scores_du_jour = (users ?? [])
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
                        date: date_du_jour,
                        users: scores_du_jour,
                    },
                ]
            }, [] as ScorePerDay[]),
        [users, scores, type]
    )

    if (!selectedUser) {
        return <Card status={status} />
    }

    const score_evolution = (scores ?? []).reduce((acc, cur, idx) => {
        if (isAfter(new Date(cur.date), new Date())) {
            return acc
        }
        const x = acc.datas.length + 1
        const previous_y =
            idx !== 0 &&
            (SCORE_TYPES[type] === 'time' ? acc.datas[idx - 1].y * 60 : acc.datas[idx - 1].y)
        const total_y = previous_y ? cur[selectedUser?.id] + previous_y : cur[selectedUser?.id]
        const y = SCORE_TYPES[type] === 'time' ? total_y / 60 : total_y
        return {
            minDomain: { x: Math.min(acc.minDomain.x, x), y: Math.min(acc.minDomain.y, y) },
            maxDomain: { x: Math.max(acc.maxDomain.x, x), y: Math.max(acc.maxDomain.y, y) },
            datas: [...acc.datas, { x, y }],
        }
    }, DEFAULT_STATS)

    const score_par_jour = (scores ?? []).reduce((acc, cur) => {
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

    const position_par_jour = sorted_scores.reduce((acc, cur) => {
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

    const total_score = score_evolution.datas[score_evolution.datas.length - 1]?.y
    const user_position =
        sorted_scores[sorted_scores.length - 1]?.users.findIndex((a) => a.id === selectedUser.id) +
        1
    const position_libelle = user_position === 1 ? 'er' : 'ème'

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
                                className={center({ flexDir: 'column' })}>
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
                {has_datas ? (
                    <Grid
                        height={'100%'}
                        width={'100%'}
                        columns={2}
                        margin={2}
                        padding={2}
                        smDown={{ display: 'flex', flexDirection: 'column' }}>
                        <Stack>
                            <Title type="stats">{`Statistiques de ${selectedUser?.username}`}</Title>
                            <span>{`Position actuelle : ${user_position}${position_libelle}`}</span>
                            <span>
                                {` ${
                                    SCORE_TYPES[type] === 'time'
                                        ? 'Temps total cumulé'
                                        : 'Score cumulé'
                                } :  ${display_score(total_score)}`}
                            </span>
                        </Stack>
                        <StatsComponent
                            className={stack({ justify: 'center', gap: 0 })}
                            title={'Position au classement général'}
                            type="line"
                            stats={position_par_jour}
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
                            stats={score_par_jour}
                        />
                        <StatsComponent
                            className={stack({ justify: 'center', gap: 0 })}
                            title={
                                SCORE_TYPES[type] === 'time'
                                    ? 'Cumul du temps de trajet'
                                    : 'Évolution du score total'
                            }
                            type="line"
                            stats={score_evolution}
                        />
                    </Grid>
                ) : (
                    <Stack align={'center'} justify={'center'} height={'100%'} width={'100%'}>
                        <img src="./calculatrice.gif" style={{ height: 100, width: 100 }} />
                        <div>{'Les calculs ne sont pas bons Kévin.'}</div>
                        <div>{'Les statistiques arrivent bientôt !'}</div>
                    </Stack>
                )}
            </HStack>
        </Card>
    )
}

export default StatsList
