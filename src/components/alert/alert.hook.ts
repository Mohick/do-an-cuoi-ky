import { create } from "zustand"
import type { PropsAlertHook } from "./alert.interpace"


const useAlert = create((set): PropsAlertHook => {
    return {
        id: 0,
        listAlert: [],
        addAlert: (alert: any) => set((state: any) => ({ listAlert: [...state.listAlert, alert] })),
        removeAlert: (id: number) => set((state: any) => ({ listAlert: state.listAlert.filter((alert: any) => alert.id !== id) }))
    }
})

export {
    useAlert
}