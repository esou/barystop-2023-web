import axios from 'axios'
import { format } from 'date-fns'

const NO_CACHE = `?timestamp=${new Date().getTime()}`

const STEPS_PATH =
    'https://raw.githubusercontent.com/rpzcancoillote/urban-guacamole/main/steps/steps.json' +
    NO_CACHE

// const STEP_DETAILS_PATH = (stepId: string) =>
//     `https://raw.githubusercontent.com/rpzcancoillote/urban-guacamole/main/steps/${stepId}.json` +
//     NO_CACHE

// const POLYGONS_PATH =
//     'https://raw.githubusercontent.com/rpzcancoillote/urban-guacamole/main/steps/polygons.json' +
//     NO_CACHE

const USERS_PATH =
    'https://raw.githubusercontent.com/rpzcancoillote/urban-guacamole/main/users/users.json' +
    NO_CACHE

const SCORES_PATH = {
    yellow:
        'https://raw.githubusercontent.com/rpzcancoillote/urban-guacamole/main/scores/scores_yellow.json' +
        NO_CACHE,
    red:
        'https://raw.githubusercontent.com/rpzcancoillote/urban-guacamole/main/scores/scores_red.json' +
        NO_CACHE,
    green:
        'https://raw.githubusercontent.com/rpzcancoillote/urban-guacamole/main/scores/scores_green.json' +
        NO_CACHE,
}

// const RULES_PATH =
//     'https://raw.githubusercontent.com/rpzcancoillote/urban-guacamole/main/content/rules.json' +
//     NO_CACHE

// const CHALLENGES_PATH =
//     'https://raw.githubusercontent.com/rpzcancoillote/urban-guacamole/main/content/challenges.json' +
//     NO_CACHE

// const HELP_PATH =
//     'https://raw.githubusercontent.com/rpzcancoillote/urban-guacamole/main/content/help.json' +
//     NO_CACHE

const getSteps = (): Promise<StepData[]> => axios.get(STEPS_PATH).then((res) => res.data.steps)

// const getStepDetail = (stepId: string): Promise<ContentScreen> =>
//     axios.get(STEP_DETAILS_PATH(stepId)).then((res) => res.data.step)

// const getPolygons = (): Promise<CityPolygon[]> =>
//     axios.get(POLYGONS_PATH).then((res) => res.data.polygons)

const getUsers = (): Promise<UserData[]> => axios.get(USERS_PATH).then((res) => res.data.users)

const getScores = (type: RankingType): Promise<ScorePerUserPerDay[]> =>
    axios.get(SCORES_PATH[type]).then((res) => res.data.scores)

// const getRules = (): Promise<ContentScreen> => axios.get(RULES_PATH).then((res) => res.data.rules)

// const getChallenges = (): Promise<ContentScreen> =>
//     axios.get(CHALLENGES_PATH).then((res) => res.data.challenges)

// const getHelp = (): Promise<ContentScreen> => axios.get(HELP_PATH).then((res) => res.data.help)

const getMeteo = (latitude: number, longitude: number): Promise<WeatherData> => {
    const date = format(new Date(), 'yyyy-MM-dd')
    return axios
        .get(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_min,temperature_2m_max&timezone=auto&start_date=${date}&end_date=${date}`
        )
        .then((res) => ({
            ...res.data.current_weather,
            min: res.data.daily.temperature_2m_min,
            max: res.data.daily.temperature_2m_max,
        }))
}

export {
    getSteps,
    // getStepDetail,
    // getPolygons,
    getUsers,
    getScores,
    // getRules,
    // getChallenges,
    // getHelp,
    getMeteo,
}
