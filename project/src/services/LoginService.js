import { apiClient } from "./AxiosInstance";

export default {
    login (user) {
        return apiClient.post("/login", user);
    },
    logout (user) {
        return apiClient.get("/logout");
    }
};
