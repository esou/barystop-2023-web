import * as React from 'react'

import { isAfter, isSameDay } from 'date-fns'
import { useQueries } from 'react-query'
import { getScores, getUsers } from '../services/webservices'
import CustomDatePicker from './CustomDatePicker'
import { HStack, Stack } from '../../styled-system/jsx'
import { css } from '../../styled-system/css'

interface Props {
    type: RankingType
}
const PROFILE_SIZE = 35

const RankingList = ({ type }: Props) => {
    const [dateIdxSelected, setDateIdxSelected] = React.useState<number>(0)

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

    const renderItem = (item: ScorePerUser, index: number) => {
        const current_position = index
        const previous_position =
            dateIdxSelected === 0
                ? index
                : sorted_scores[dateIdxSelected - 1].users.findIndex((toto) => {
                      return toto.id === item.id
                  })

        const difference_position = previous_position - current_position

        return (
            <HStack
                className={css({
                    color: 'secondary',
                    justifyContent: 'space-between',
                    borderBottomColor: 'primary',
                    borderBottom: '2px solid',
                    pb: '10px',
                    gap: '10px',
                })}
                key={item.username}>
                <HStack>
                    <span>{index + 1} -</span>
                    <img
                        src={item.picture}
                        className={css({
                            height: PROFILE_SIZE,
                            width: PROFILE_SIZE,
                            borderRadius: 'full',
                            objectFit: 'cover',
                        })}
                    />
                    <span>{item.username}</span>
                </HStack>
                {!!difference_position && (
                    <span
                        className={css({
                            color:
                                difference_position === 0
                                    ? undefined
                                    : difference_position > 0
                                    ? 'green.500'
                                    : 'red.500',
                        })}>
                        {difference_position > 0 && '+'} {difference_position}
                    </span>
                )}
                <span>{item.score}</span>
            </HStack>
        )
    }

    return (
        <div className={status}>
            <CustomDatePicker
                dateList={displaying_dates}
                dateIdxSelected={dateIdxSelected}
                setDateIdxSelected={setDateIdxSelected}
            />
            {displaying_scores ? (
                <Stack>
                    {displaying_scores.users.map((item, index) => renderItem(item, index))}
                </Stack>
            ) : (
                <div>activity indicator</div>
            )}
        </div>
    )
}

export default RankingList
