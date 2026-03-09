

export interface PropsAlertHook {
    id: number
    listAlert: PropsAlertComponent[]
    addAlert: (alert: any) => void
    removeAlert: (id: number) => void,
}

export interface PropsAlertComponent {
    id: number
    title: string
    message: string
    status: 'error' | 'success'
}