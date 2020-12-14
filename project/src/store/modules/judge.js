import JudgeService from "@/services/JudgeService.js";

export const namespaced = true;

export const state = {
    judges: [],
    judge: {}
};

export const mutations = {
    ADD_JUDGE (state, judge) {
        state.judges.push(judge);
    },
    SET_JUDGES (state, judges) {
        state.judges = judges;
    },
    SET_JUDGE (state, judge) {
        state.judge = judge;
    },
    DELETE_JUDGE (state, judges) {
        state.judges = judges;
    }
};

export const actions = {
    createJudge ({ commit }, judge) {
        return JudgeService.postJudge(judge)
            .then((response) => {
                commit("ADD_JUDGE", response.data);
                return response.data;
            });
    },
    fetchJudges ({ commit }) {
        return JudgeService.getJudges()
            .then(response => {
                commit("SET_JUDGES", response.data);
            });
    },
    fetchJudge ({ commit, getters, state }, id) {
        if (id === state.judge.id) {
            return state.judge;
        }

        let judge = getters.getJudgeById(id);

        if (judge) {
            commit("SET_JUDGE", judge);
            return judge;
        } else {
            return JudgeService.getJudge(id)
                .then(response => {
                    commit("SET_JUDGE", response.data);
                    return response.data;
                });
        }
    },
    deleteJudge ({ commit, getters }, id) {
        return JudgeService.deleteJudge(id)
            .then(deleted => {
                let judges = getters.deleteJudgeById(deleted.id);
                commit("DELETE_JUDGE", judges);
            });
    },
    updateJudge ({ commit }, judge) {
        return JudgeService.updateJudge(judge.id, judge)
            .then(response => {
                commit("SET_JUDGE", response.data);
                return response.data;
            });
    }
};

export const getters = {
    getJudgeById: state => id => {
        return state.judges.find(judge => judge.id === id);
    },
    deleteJudgeById: state => id => {
        return state.judges.find(judge => judge.id !== id);
    },
    getJudgesFromIds: state => ids => {
        return state.judges.filter(judge => ids.includes(judge.id));
    }
};
