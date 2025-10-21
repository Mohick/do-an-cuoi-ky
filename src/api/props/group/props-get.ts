




export interface PropsGetGroup {
    valid?: boolean;
    working?: {
        creator: string
        deadline: Date
        image: string
        name_project: string
        status: string

    }[]
    done?: {
        creator: string
        deadline: Date
        image: string
        name_project: string
        status: string
    }[]
    cancel?: {
        creator: string
        deadline: Date
        image: string
        name_project: string
        status: string

    }[]
}