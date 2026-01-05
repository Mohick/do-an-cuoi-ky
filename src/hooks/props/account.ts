






export interface PropsAccount {
    data: {
        user: {
            _id: string,
            username: string,
            email: string,
            verify: boolean
            avatar: string
        }
    }
    blockcall: boolean
}