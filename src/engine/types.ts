export type Card = {
    id: number
    it: string
    pl: string
    learnt?: boolean
    lastTurn?: number
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
}

export type Configuration = {
    maxNumberOfCards: number
    cardsPool: CardsPool
    fromNative: boolean
    sameSpeed: boolean
}