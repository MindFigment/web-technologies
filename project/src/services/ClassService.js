import { apiClient } from "./AxiosInstance";

export default {
    getClasses () {
        return apiClient.get("/klasy");
    },
    getClassById (id) {
        return apiClient.get("/klasy/" + id);
    },
    postClass (class_) {
        console.log("post class", class_);
        return apiClient.post("/klasy", class_);
    },
    deleteClass (id) {
        return apiClient.delete("/klasy/" + id);
    },
    updateClass (id, class_) {
        return apiClient.put("/klasy/" + id, class_);
    },
    getHorsesInClass (classId) {
        return apiClient.get("/klasy/konie/" + classId);
    },
    getJudgeClasses (judgeId) {
        return apiClient.get("/klasy/sedziowie/" + judgeId);
    },
    getInactiveCategories () {
        return apiClient.get("/klasy/tylko/zakonczone");
    },
    getArbitrator (classId) {
        return apiClient.get("/klasy/arbitrator/" + classId);
    }
};
