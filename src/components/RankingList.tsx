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

    const sortedScores = (scores ?? []).reduce((acc, cur) => {
        // On va mapper chaque jour pour calculer le score de chacun chaque jour
        const currentDayDate = cur.date
        if (isAfter(new Date(currentDayDate), new Date())) {
            return acc
        }
        const currentDayScores = (users ?? [])
            .map((u) => ({
                ...u,
                score: (scores ?? [])
                    .filter(
                        (s) =>
                            isAfter(new Date(currentDayDate), new Date(s.date)) ||
                            isSameDay(new Date(currentDayDate), new Date(s.date))
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
                users: currentDayScores,
            },
        ]
    }, [] as ScorePerDay[])

    React.useEffect(() => {
        if (dateIdxSelected === undefined && sortedScores.length) {
            setDateIdxSelected(sortedScores.length - 1)
        }
    }, [sortedScores, dateIdxSelected])

    const displayingDates = (scores ?? []).map((s) => s.date)
    const displayingScores = dateIdxSelected !== undefined && sortedScores[dateIdxSelected]

    const renderUserRank = (userScore: ScorePerUser, index: number) => {
        const currentUserRank = index
        const previousUserRank =
            dateIdxSelected === 0 || dateIdxSelected === undefined
                ? index
                : sortedScores[dateIdxSelected - 1].users.findIndex((toto) => {
                      return toto.id === userScore.id
                  })

        const differenceRank = previousUserRank - currentUserRank
        const score = () => {
            if (SCORE_TYPES[type] === 'time') {
                const bestTime = displayingScores && displayingScores.users[0].score
                const fullseconds = index === 0 ? userScore.score : userScore.score - bestTime
                const hours = Math.trunc(fullseconds / 3600)
                const minutes = Math.trunc((fullseconds - 3600 * hours) / 60)
                const seconds = Math.trunc(fullseconds - 3600 * hours - 60 * minutes)

                const label = hours + 'h ' + minutes + "' " + seconds + "''"
                return index === 0 ? label : '+ ' + label
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
                    {!!differenceRank && (
                        <styled.span
                            color={
                                differenceRank === 0
                                    ? undefined
                                    : differenceRank > 0
                                    ? 'green.500'
                                    : 'red.500'
                            }
                            width="30px">
                            {differenceRank > 0 && '+'} {differenceRank}
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
            <CustomDatePicker
                dateList={displayingDates}
                dateIdxSelected={dateIdxSelected}
                setDateIdxSelected={(idx: number) => {
                    setDateIdxSelected(idx)
                }}
            />

            {displayingScores ? (
                <Stack gap="0">
                    {displayingScores.users.map((item, index) => renderUserRank(item, index))}
                </Stack>
            ) : (
                <Stack
                    align="center"
                    justify="center"
                    height="100%"
                    width="100%"
                    padding={4}
                    textAlign="center">
                    <p>La compétition n'a pas commencé</p>
                </Stack>
            )}
        </Card>
    )
}

export default RankingList
