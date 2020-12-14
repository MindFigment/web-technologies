import { apiClient } from "./AxiosInstance";

export default {
    getCountries () {
        return apiClient.get("/kraje");
    }
};
