import { registerAPI } from "../../../api/user";
import type { PropsRegister } from "../../../api/props/user/props-register";





const handleSubmitRegister = async (data: PropsRegister, setError: any, setToggle:
    (toggle: boolean) => void, setAlertMessage: (toggle: boolean) => void): Promise<any> => {
    registerAPI(data)
        .then(() => {
            setToggle(true)
            setAlertMessage(true)
        })
        .catch((err) => {
            if (err.response) {
                if (err.response.data.message.toLowerCase().includes("email") && err.response.status === 400) {
                    setError("email", { message: err.response.data.message })
                }
                if (!err.response.data.message && err.response.status === 400) {
                    delete err.response.data.valid
                    const getListKey = Object.keys(err.response.data);
                    getListKey.map((key) => {
                        setError(`${key}`.toLowerCase(), { message: err.response.data[key] })
                    })
                }
            }else{
                setAlertMessage(false)
            }
        })
}

export { handleSubmitRegister }