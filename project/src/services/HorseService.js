import { apiClient } from "./AxiosInstance";

export default {
    getHorses () {
        return apiClient.get("/konie");
    },
    getHorseById (id) {
        return apiClient.get("/konie/" + id);
    },
    postHorse (horse) {
        return apiClient.post("/konie", horse);
    },
    deleteHorse (id) {
        return apiClient.delete("/konie/" + id);
    },
    updateHorse (id, horse) {
        return apiClient.put("/konie/" + id, horse);
    },
    updateHorses (horses) {
        return apiClient.put("/konie", horses);
    },
    getPageHorses (perPage, page) {
        return apiClient.get(`/konie/pagination/${perPage}/${page}`);
    }
};
