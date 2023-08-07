import * as React from 'react'

import { isAfter, isBefore, isSameDay } from 'date-fns'
import { useQueries } from 'react-query'
import { getScores, getUsers } from '../services/webservices'
import { AspectRatio, HStack, Stack, VStack, styled } from '../../styled-system/jsx'

import Card from './Card'
import Title from './Title'
import StatsComponent from './StatsComponent'

const RANKING_TYPES: RankingType[] = ['yellow', 'red', 'green']
const RANKING_LABELS: Record<RankingType, string> = { green: 'vert', red: 'rouge', yellow: 'jaune' }
const SCORE_TYPES: Record<RankingType, ScoreType> = { green: 'point', red: 'point', yellow: 'time' }

const DEFAULT_STATS: StatsData = {
    minDomain: { x: 1, y: 0 },
    maxDomain: { x: 1, y: 0 },
    datas: [],
}

const StatsList = () => {
    const [type, setType] = React.useState<RankingType>('yellow')

    const [, startTransition] = React.useTransition()

    const queries = useQueries([
        { queryKey: ['Scores', type], queryFn: () => getScores(type) },
        { queryKey: ['Users'], queryFn: () => getUsers() },
    ])
    const [{ data: scores }, { data: users }] = queries

    // Changer pas le user selector custom
    const user = (users ?? [])[0]

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

    const score_evolution = (scores ?? []).reduce((acc, cur, idx) => {
        if (isAfter(new Date(cur.date), new Date())) {
            return acc
        }
        const x = acc.datas.length + 1
        const previous_y =
            idx !== 0 &&
            (SCORE_TYPES[type] === 'time' ? acc.datas[idx - 1].y * 60 : acc.datas[idx - 1].y)
        const total_y = previous_y ? cur[user?.id] + previous_y : cur[user?.id]
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
        const y = SCORE_TYPES[type] === 'time' ? cur[user.id] / 60 : cur[user.id]
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
        const y = cur.users.findIndex((a) => a.id === user.id) + 1
        return {
            minDomain: { x: 1, y: 1 },
            maxDomain: { x: Math.max(acc.maxDomain.x, x), y: (users ?? []).length },
            datas: [...acc.datas, { x, y }],
        }
    }, DEFAULT_STATS)

    const total_score = score_evolution.datas[score_evolution.datas.length - 1]?.y
    const user_position =
        sorted_scores[sorted_scores.length - 1]?.users.findIndex((a) => a.id === user.id) + 1
    const position_libelle = user_position === 1 ? 'er' : 'ème'

    const selectTab = (rankingType: RankingType) => startTransition(() => setType(rankingType))

    return (
        <Card
            status={status}
            header={
                <Stack gap={0}>
                    <Title type="card" mb={-2}>
                        Les statistiques
                    </Title>
                    <div style={{ backgroundColor: 'red', height: 50 }}>USER CUSTOM SELECTOR</div>
                    <HStack justifyContent={'space-evenly'} cursor={'pointer'}>
                        {RANKING_TYPES.map((rankingType, idx) => {
                            const selected = rankingType === type
                            return (
                                <HStack
                                    key={idx}
                                    height={'100%'}
                                    width={'100%'}
                                    borderBottomWidth={selected ? 3 : 0}
                                    borderBottomColor={
                                        rankingType === 'yellow'
                                            ? 'yellow.400'
                                            : rankingType === 'red'
                                            ? 'red.400'
                                            : 'green.400'
                                    }
                                    justifyContent={'center'}>
                                    <AspectRatio ratio={1} width={'1/5'}>
                                        <img src={`./${rankingType}.png`} width={'100%'} />
                                    </AspectRatio>
                                    <styled.button
                                        key={rankingType}
                                        color={'inherit'}
                                        padding={2}
                                        onClick={() => selectTab(rankingType)}
                                        fontWeight={selected ? 'bold' : 'medium'}
                                        textTransform={'uppercase'}
                                        cursor={'pointer'}>
                                        {RANKING_LABELS[rankingType]}
                                    </styled.button>
                                </HStack>
                            )
                        })}
                    </HStack>
                </Stack>
            }>
            {has_datas ? (
                <VStack>
                    <VStack>
                        <div>{'Informations générales'}</div>
                        <VStack>
                            <div>{`Statistiques de ${user?.username}`}</div>
                            <HStack>
                                <div>{'Position actuelle'}</div>
                                <div>
                                    {user_position}
                                    {position_libelle}
                                </div>
                            </HStack>
                            <HStack>
                                <div>
                                    {SCORE_TYPES[type] === 'time'
                                        ? 'Temps total cumulé'
                                        : 'Score cumulé'}
                                </div>
                                <div>{display_score(total_score)}</div>
                            </HStack>
                        </VStack>
                        <StatsComponent
                            title={
                                SCORE_TYPES[type] === 'time'
                                    ? 'Temps de trajet à chaque étape'
                                    : 'Score obtenu par jour'
                            }
                            type="bar"
                            stats={score_par_jour}
                        />
                    </VStack>
                    <VStack>
                        <div>
                            {SCORE_TYPES[type] === 'time'
                                ? 'Temps de chaque étape'
                                : 'Score de chaque étape'}
                        </div>
                        {score_par_jour.datas.map((itm, idx) => (
                            <HStack key={idx}>
                                <div>{`Étape ${idx + 1}`}</div>
                                <div>{display_score(itm.y)}</div>
                            </HStack>
                        ))}
                    </VStack>
                    <StatsComponent
                        title={
                            SCORE_TYPES[type] === 'time'
                                ? 'Cumul du temps de trajet'
                                : 'Évolution du score total'
                        }
                        type="line"
                        stats={score_evolution}
                    />
                    <VStack>
                        <div>
                            {SCORE_TYPES[type] === 'time'
                                ? 'Cumul du temps à chaque étape'
                                : 'Score cumulé à chaque étape'}
                        </div>
                        {score_evolution.datas.map((itm, idx) => (
                            <HStack key={idx}>
                                <div>{`Étape ${idx + 1}`}</div>
                                <div>{display_score(itm.y)}</div>
                            </HStack>
                        ))}
                    </VStack>
                    <StatsComponent
                        title={'Position au classement général'}
                        type="line"
                        stats={position_par_jour}
                    />
                    <VStack>
                        <div>{'Évolution au classement'}</div>
                        {position_par_jour.datas.map((itm, idx) => (
                            <HStack key={idx}>
                                <div>{`Étape ${idx + 1}`}</div>
                                <div>{itm.y}</div>
                            </HStack>
                        ))}
                    </VStack>
                </VStack>
            ) : (
                <div>
                    <img src="./calculatrice.gif" style={{ height: 100, width: 100 }} />
                    <div>{'Les calculs ne sont pas bons Kévin.'}</div>
                    <div>{'Les statistiques arrivent bientôt !'}</div>
                </div>
            )}
        </Card>
    )
}

export default StatsList
