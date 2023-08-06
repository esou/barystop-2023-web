interface InstagramItem {
    id: string
    caption: string
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
    media_url: string
    permalink: string
    thumbnail_url: string
}

interface StepData {
    id: string
    date: string
    country: string
    city: string
    countryCode: string
    image: string
    // Geo data
    lat: number
    lon: number
}

interface LatLong {
    latitude: number
    longitude: number
}

// interface CityPolygon {
//     step: string
//     type: 'Polygon' | 'MultiPolygon'
//     coordinates: number[][][]
//     bbox: number[] // See if string needed
// }

interface WeatherData {
    is_day: number
    temperature: number
    time: Date
    weathercode: number
    winddirection: number
    windspeed: number
    min: number
    max: number
}

// Ranking screens
declare type RankingType = 'yellow' | 'green' | 'red'
declare type ScoreType = 'time' | 'point'

interface ScorePerUserPerDay {
    date: string
    eva: number
    gabrielle: number
    marie: number
    salome: number
    corentin: number
    florian: number
    julian: number
    simon: number
}

interface UserData {
    id: keyof Omit<ScorePerUserPerDay, 'date'>
    username: string
    age: number
    homeplace: string
    stories: string[]
    hobbies: string[]
    picture: string
}

interface ScorePerDay {
    date: string // date
    users: ScorePerUsers[]
}

interface ScorePerUser extends UserData {
    score: number
}

declare type CardStatus = 'loading' | 'error' | 'fetched'
