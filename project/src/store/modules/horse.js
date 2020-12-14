import HorseService from "@/services/HorseService.js";

export const namespaced = true;

export const state = {
    horses: [],
    horse: {},
    horsesTotal: 0,
    perPage: 30,
    pageHorses: []
};

export const mutations = {
    ADD_HORSE (state, horse) {
        state.horses.push(horse);
    },
    SET_HORSES (state, horses) {
        state.horses = horses;
    },
    SET_PAGE_HORSES (state, pageHorses) {
        state.pageHorses = pageHorses;
    },
    SET_HORSE (state, horse) {
        state.horse = horse;
    },
    DELETE_HORSE (state, horse) {
        state.horses = state.horses.filter((h) => horse.id !== h.id);
    },
    SET_HORSES_TOTAL (state, horsesTotal) {
        state.horsesTotal = horsesTotal;
    },
    UPDATE_HORSE (state, horse) {
        state.horse = horse;
    }
};

export const actions = {
    createHorse ({ commit }, horse) {
        return HorseService.postHorse(horse)
            .then((response) => {
                commit("ADD_HORSE", response.data);
                return response.data;
            });
    },
    fetchHorses ({ commit }) {
        return HorseService.getHorses()
            .then(response => {
                commit("SET_HORSES_TOTAL", response.data.length);
                commit("SET_HORSES", response.data);
                return response.data;
            });
    },
    fetchPageHorses ({ commit, state }, { page }) {
        return HorseService.getPageHorses(state.perPage, page)
            .then(response => {
                commit("SET_HORSES_TOTAL", response.data.len);
                commit("SET_PAGE_HORSES", response.data.pageHorses);
                return response.data;
            });
    },
    fetchHorse ({ commit, getters, state }, id) {
        return HorseService.getHorseById(id)
            .then(response => {
                commit("SET_HORSE", response.data);
                return response.data;
            });
    },
    deleteHorse ({ commit, getters }, id) {
        return HorseService.deleteHorse(id)
            .then(deleted => {
                let horse = getters.deleteHorseById(deleted.id);
                commit("DELETE_HORSE", horse);
            });
    },
    updateHorse ({ commit }, horse) {
        return HorseService.updateHorse(horse.id, horse)
            .then(response => {
                commit("UPDATE_HORSE", response.data);
                return response.data;
            });
    }
};

export const getters = {
    getHorseById: state => id => {
        return state.horses.find(horse => horse.id === id);
    },
    deleteHorseById: state => id => {
        return state.horses.find(horse => horse.id !== id);
    },
    getHorsesFromIds: state => ids => {
        return state.horses.filter(horse => ids.includes(horse.id));
    }
};
