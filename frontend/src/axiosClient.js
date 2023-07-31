import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const axiosClient = axios.create({
    // エンドポイントとなるURLのベース
    baseURL: BASE_URL,
});

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (err) => {
        throw err.response;
    }
);

export default axiosClient;