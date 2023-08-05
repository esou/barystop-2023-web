import * as React from 'react'

import { isAfter, isSameDay } from 'date-fns'
import { useQueries } from 'react-query'
import { getScores, getUsers } from '../services/webservices'
import CustomDatePicker from './CustomDatePicker'
import { AspectRatio, HStack, Stack, styled } from '../../styled-system/jsx'

import Card from './Card'

const PROFILE_SIZE = 35
const RANKING_TYPES: RankingType[] = ['yellow', 'red', 'green']
const RANKING_LABELS: Record<RankingType, string> = { green: 'vert', red: 'rouge', yellow: 'jaune' }

const RankingList = () => {
    const [dateIdxSelected, setDateIdxSelected] = React.useState<number>(0)
    const [type, setType] = React.useState<RankingType>('yellow')
    const [_isPending, startTransition] = React.useTransition()

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
                b.score === a.score ? a.username.localeCompare(b.username) : b.score - a.score
            )
        return [
            ...acc,
            {
                date: date_du_jour,
                users: scores_du_jour,
            },
        ]
    }, [] as ScorePerDay[])

    const displaying_dates = (scores ?? []).map((s) => s.date)
    const displaying_scores = sorted_scores[dateIdxSelected]

    const renderUserRank = (userScore: ScorePerUser, index: number) => {
        const current_position = index
        const previous_position =
            dateIdxSelected === 0
                ? index
                : sorted_scores[dateIdxSelected - 1].users.findIndex((toto) => {
                      return toto.id === userScore.id
                  })

        const difference_position = previous_position - current_position

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
                    <styled.img
                        src={userScore.picture}
                        height={PROFILE_SIZE}
                        width={PROFILE_SIZE}
                        borderRadius={'full'}
                        objectFit={'cover'}
                    />
                    <span>{userScore.username}</span>
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
                            }>
                            {difference_position > 0 && '+'} {difference_position}
                        </styled.span>
                    )}
                    <span>{userScore.score}</span>
                </HStack>
            </HStack>
        )
    }

    const selectTab = (rankingType: RankingType) => startTransition(() => setType(rankingType))

    return (
        <Card
            status={status}
            header={
                <Stack textAlign={'center'} textJustify={'inter-word'} gap={0}>
                    <styled.h2 fontWeight={'medium'} paddingTop={2}>
                        Le classement
                    </styled.h2>
                    <HStack justifyContent={'space-evenly'} cursor={'pointer'}>
                        {RANKING_TYPES.map((rankingType) => {
                            const selected = rankingType === type
                            return (
                                <HStack
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
            <CustomDatePicker
                dateList={displaying_dates}
                dateIdxSelected={dateIdxSelected}
                setDateIdxSelected={setDateIdxSelected}
            />
            {displaying_scores && (
                <Stack>
                    {displaying_scores.users.map((item, index) => renderUserRank(item, index))}
                </Stack>
            )}
        </Card>
    )
}

export default RankingList
