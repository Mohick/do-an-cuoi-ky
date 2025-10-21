import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { autoLoginAPI } from "../api/user"
import type { PropsAccount } from "./props/account"





const useAccount = (): UseQueryResult<PropsAccount> => {
  return useQuery<PropsAccount>({
    queryKey: ['account'],
    queryFn: async () => {
      const res = await autoLoginAPI();
      return res as any
    },
    gcTime: 60 * 1000
  })
}
export {
    useAccount
}