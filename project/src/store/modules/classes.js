import ClassService from "@/services/ClassService.js";

export const namespaced = true;

export const state = {
    classes: [],
    class_: {},
    horsesInClass: [],
    judgedClasses: [],
    inactiveCategories: [],
    arbitrator: {}
};

export const mutations = {
    ADD_CLASS (state, class_) {
        state.classes.push(class_);
    },
    SET_CLASSES (state, classes) {
        state.classes = classes;
    },
    SET_CLASS (state, class_) {
        state.class_ = class_;
    },
    DELETE_CLASS (state, classes) {
        state.classes = classes;
    },
    SET_CLASS_HORSES (state, horses) {
        state.horsesInClass = horses;
    },
    SET_JUDGED_CLASSES (state, classes) {
        state.judgedClasses = classes;
    },
    SET_INACTIVE_CATEGORIES (state, classes) {
        state.inactiveCategories = classes;
    },
    SET_ARBITRATOR (state, arbitrator) {
        state.arbitrator = arbitrator;
    }
};

export const actions = {
    createClass ({ commit }, class_) {
        console.log("vuex post class", class_);
        return ClassService.postClass(class_)
            .then((response) => {
                commit("ADD_CLASS", response.data);
                return response.data;
            });
    },
    fetchClasses ({ commit }) {
        return ClassService.getClasses()
            .then(response => {
                commit("SET_CLASSES", response.data);
            });
    },
    fetchClass ({ commit, getters, state }, id) {
        return ClassService.getClassById(id)
            .then(response => {
                console.log("RESPONSE DATA", response.data);
                commit("SET_CLASS", response.data);
            });
    },
    deleteClass ({ commit, getters }, id) {
        return ClassService.deleteClass(id)
            .then(deleted => {
                let classes = getters.deleteClassById(deleted.id);
                commit("DELETE_CLASS", classes);
            });
    },
    updateClass ({ commit }, class_) {
        return ClassService.updateClass(class_.id, class_)
            .then(response => {
                commit("SET_CLASS", response.data);
                return response.data;
            });
    },
    fetchHorsesInClass ({ commit }, classId) {
        return ClassService.getHorsesInClass(classId)
            .then(response => {
                commit("SET_CLASS_HORSES", response.data);
                return response.data;
            });
    },
    fetchJudgeClasses ({ commit }, judgeId) {
        return ClassService.getJudgeClasses(judgeId)
            .then(response => {
                commit("SET_JUDGED_CLASSES", response.data);
                return response.data;
            });
    },
    getInactiveCategories ({ commit }) {
        return ClassService.getInactiveCategories()
            .then(response => {
                commit("SET_INACTIVE_CATEGORIES", response.data);
                return response.data;
            });
    },
    getArbitrator ({ commit }, classId) {
        return ClassService.getArbitrator(classId)
            .then((response) => {
                commit("SET_ARBITRATOR", response.data);
            });
    }
};

export const getters = {
    getClassById: state => id => {
        return state.classes.find(class_ => class_.id === id);
    },
    deleteClassById: state => id => {
        return state.classes.find(class_ => class_.id !== id);
    },
    getClassesIdAndCategory: state => () => {
        return state.classes.map(class_ => {
            return { id: class_.id, kat: class_.kat, numer: class_.numer };
        });
    },
    getClassesForSelect: state => () => {
        return state.classes.filter(class_ => !class_.kat.includes("czempionat"))
            .map(class_ => {
                let label = class_.numer + ". " + class_.kat + (class_.hasOwnProperty("czempionat") ? "- czempionat nr." + class_.czempionat : "");
                return { label: label, id: class_.id };
            });
    }
};
