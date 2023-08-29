import axios from "axios"

const access_token = process.env.REACT_APP_ACCESS_TOKEN

// create axios instance for api calls.
const api = axios.create(
    {
        baseURL: `https://switch-yam-equator.azurewebsites.net/api/`,
        headers: {
            "x-chmura-cors": access_token
        }
    }
)

export default api