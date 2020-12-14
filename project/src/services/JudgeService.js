import { apiClient } from "./AxiosInstance";

export default {
    getJudges () {
        return apiClient.get("/sedziowie");
    },
    getJudge (id) {
        return apiClient.get("/sedziowie/" + id);
    },
    postJudge (judge) {
        return apiClient.post("/sedziowie", judge);
    },
    deleteJudge (id) {
        return apiClient.delete("/sedziowie/" + id);
    },
    updateJudge (id, judge) {
        return apiClient.put("/sedziowie/" + id, judge);
    }
};
