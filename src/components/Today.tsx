import { useQueries } from 'react-query'
import { getSteps } from '../services/webservices'
import { format, isAfter, isBefore } from 'date-fns'

import CityCard from './CityCard'

const DEFAULT_STEP: StepData = {
    city: 'Paris',
    image: 'https://media.cntraveler.com/photos/63ebc6d5e5c30f2b2ef06794/1:1/w_1280%2Ch_1280%2Cc_limit/Paris_GettyImages-183109547.jpg',
    lat: 48.864716,
    lon: 2.349014,
    country: 'France',
    countryCode: 'FR',
    id: 'default',
    date: format(new Date(), 'yyyy-MM-dd HH:ss'),
}

const Today = () => {
    const queries = useQueries([{ queryKey: ['Steps'], queryFn: () => getSteps() }])
    const [{ data: steps }] = queries
    const status = queries.some((q) => q.isLoading)
        ? 'loading'
        : queries.some((q) => q.isError)
        ? 'error'
        : 'fetched'

    const today = format(new Date(), 'yyyy-MM-dd HH:ss')
    const todayStepIndex = steps?.findIndex((s) => s.date.startsWith(today))
    const competitionStarted = steps ? isAfter(new Date(), new Date(steps[0].date)) : false

    const todayHasStep = todayStepIndex !== undefined && todayStepIndex > -1 && steps !== undefined

    const todaysStep =
        (todayHasStep
            ? steps[todayStepIndex]
            : competitionStarted
            ? steps?.reduceRight<StepData | undefined>(
                  (stepToReturn, s) =>
                      !stepToReturn && isBefore(new Date(s.date), new Date(today))
                          ? s
                          : stepToReturn,
                  undefined
              )
            : DEFAULT_STEP) ?? DEFAULT_STEP

    const previousStep = steps?.reduceRight<StepData | undefined>(
        (stepToReturn, s) =>
            !stepToReturn && isBefore(new Date(s.date), new Date(todaysStep.date))
                ? s
                : stepToReturn,
        undefined
    )

    return (
        <CityCard
            {...todaysStep}
            date={today}
            status={status}
            previousStep={previousStep}
            competitionStarted={competitionStarted}
        />
    )
}

export default Today
