export type Card = {
    id: number
    it: string
    pl: string
    learnt?: boolean
    lastTurn?: number
    repetitions?: number
    presentIndicative: {
        singular: {
            first: string,
            second: string,
            third: string
        },
        plural: {
            first: string,
            second: string,
            third: string
        }
    }
}

export enum CardsPool {
    ALL = 'ALL',
    IRREGULAR = 'IRREGULAR',
    SAVED = 'SAVED',
    TEST = 'TEST',
    NEW = 'NEW',
}

export type Configuration = {
    maxNumberOfCards: number
    cardsPool: CardsPool
    fromNative: boolean
    sameSpeed: boolean
}