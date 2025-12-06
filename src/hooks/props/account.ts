






export interface PropsAccount {
    data: {
        user: {
            _id: string,
            username: string,
            email: string,
            verify: boolean
        }
    }
    blockcall: boolean
}