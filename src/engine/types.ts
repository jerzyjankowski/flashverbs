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