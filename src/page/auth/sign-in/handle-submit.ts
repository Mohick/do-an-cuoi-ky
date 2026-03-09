import { QueryClient } from "@tanstack/react-query"
import { loginAPI } from "../../../api/user"














const handleSubmitSignIn = (data: any, setError: any, navigate: any, queryClient: QueryClient) => {
    loginAPI(data)
        .then(() => {
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