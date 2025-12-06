import { QueryClient, useQueryClient } from "@tanstack/react-query"
import { loginAPI } from "../../../api/user"














const handleSubmitSignIn = (data: any, setError: any, navigate: any, queryClient: QueryClient) => {
    loginAPI(data)
        .then((res) => {
            queryClient.refetchQueries({ queryKey: ['account'] });
            navigate('/verify-email')
        })
        .catch((err) => {
            setError("email", { message: err.response.data.message })
        })
}

export {
    handleSubmitSignIn
}