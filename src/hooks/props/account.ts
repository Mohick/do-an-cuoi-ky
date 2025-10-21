






export interface PropsAccount {
    data: {
        user: {
            username: string,
            email: string,
            verify: boolean
        }
    }
    blockcall: boolean
}