import * as React from 'react'

import { isAfter, isSameDay } from 'date-fns'
import { useQueries } from 'react-query'
import { getScores, getUsers } from '../services/webservices'
import CustomDatePicker from './CustomDatePicker'
import { HStack, Stack, styled, Flex } from '../../styled-system/jsx'

import Card from './Card'
import { circle } from '../../styled-system/patterns'
import Title from './Title'
import RankingTypePicker from './RankingTypePicker'

const SCORE_TYPES: Record<RankingType, ScoreType> = { green: 'point', red: 'point', yellow: 'time' }

const RankingList = () => {
    const [dateIdxSelected, setDateIdxSelected] = React.useState<number>()
    const [type, setType] = React.useState<RankingType>('yellow')
    const [, startTransition] = React.useTransition()

    const queries = useQueries([
        { queryKey: ['Scores', type], queryFn: () => getScores(type) },
        { queryKey: ['Users'], queryFn: () => getUsers() },
    ])
    const [{ data: scores }, { data: users }] = queries
    const status = queries.some((q) => q.isLoading)
        ? 'loading'
        : queries.some((q) => q.isError)
        ? 'error'
        : 'fetched'

    const sorted_scores = (scores ?? []).reduce((acc, cur) => {
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
    }, [] as ScorePerDay[])

    React.useEffect(() => {
        if (dateIdxSelected === undefined && sorted_scores.length) {
            setDateIdxSelected(sorted_scores.length - 1)
        }
    }, [sorted_scores, dateIdxSelected])

    const displaying_dates = (scores ?? []).map((s) => s.date)
    const displaying_scores = dateIdxSelected !== undefined && sorted_scores[dateIdxSelected]

    const renderUserRank = (userScore: ScorePerUser, index: number) => {
        const current_position = index
        const previous_position =
            dateIdxSelected === 0 || dateIdxSelected === undefined
                ? index
                : sorted_scores[dateIdxSelected - 1].users.findIndex((toto) => {
                      return toto.id === userScore.id
                  })

        const difference_position = previous_position - current_position
        const score = () => {
            if (SCORE_TYPES[type] === 'time') {
                const best_time = displaying_scores && displaying_scores.users[0].score
                const fullseconds = index === 0 ? userScore.score : userScore.score - best_time
                const hours = Math.trunc(fullseconds / 3600)
                const minutes = Math.trunc((fullseconds - 3600 * hours) / 60)
                const seconds = Math.trunc(fullseconds - 3600 * hours - 60 * minutes)

                const libelle = hours + 'h ' + minutes + "' " + seconds + "''"
                return index === 0 ? libelle : '+ ' + libelle
            }

            return userScore.score
        }

        return (
            <HStack
                color={'secondary'}
                justifyContent={'space-between'}
                borderBottomWidth={'2px'}
                borderBottomColor={'primary'}
                pb="10px"
                pt="10px"
                key={userScore.username}
                _last={{ border: 0 }}>
                <HStack>
                    <span>{index + 1} -</span>
                    <img
                        src={userScore.picture}
                        className={circle({ size: 35, objectFit: 'cover' })}
                    />
                    <Flex>{userScore.username}</Flex>
                </HStack>
                <HStack gap={5}>
                    {!!difference_position && (
                        <styled.span
                            color={
                                difference_position === 0
                                    ? undefined
                                    : difference_position > 0
                                    ? 'green.500'
                                    : 'red.500'
                            }
                            width="30px">
                            {difference_position > 0 && '+'} {difference_position}
                        </styled.span>
                    )}
                    <styled.span width="100px" textAlign="right">
                        {score()}
                    </styled.span>
                </HStack>
            </HStack>
        )
    }

    const selectTab = (rankingType: RankingType) => startTransition(() => setType(rankingType))

    return (
        <Card
            status={status}
            header={
                <Stack gap={0}>
                    <Title type="card" mb={-2}>
                        Le classement
                    </Title>
                    <RankingTypePicker selectType={selectTab} selectedType={type} />
                </Stack>
            }>
            {dateIdxSelected && (
                <CustomDatePicker
                    dateList={displaying_dates}
                    dateIdxSelected={dateIdxSelected}
                    setDateIdxSelected={(idx: number) => {
                        setDateIdxSelected(idx)
                    }}
                />
            )}
            {displaying_scores && (
                <Stack gap="0">
                    {displaying_scores.users.map((item, index) => renderUserRank(item, index))}
                </Stack>
            )}
        </Card>
    )
}

export default RankingList
