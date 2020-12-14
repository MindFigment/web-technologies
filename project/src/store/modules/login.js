import LoginService from "@/services/LoginService.js";
// import axios from "axios";

export const namespaced = true;

export const state = {
    status: "",
    username: localStorage.getItem("username") || "",
    user: {}
};

export const mutations = {
    AUTH_REQUEST (state) {
        state.status = "loading";
    },
    AUTH_SUCCESS (state, username, user) {
        state.status = "success";
        state.username = username;
        state.user = user;
    },
    AUTH_ERROR (state) {
        state.status = "error";
    },
    LOGOUT (state) {
        state.status = "";
        state.username = "";
    }
};

export const actions = {
    login ({ commit }, user) {
        return LoginService.login(user)
            .then(resp => {
                localStorage.setItem("username", resp.data.username);
                commit("AUTH_SUCCESS", resp.data.username, user);
                return resp;
            });
    },
    logout ({ commit }) {
        return LoginService.logout()
            .then(resp => {
                commit("LOGOUT");
                localStorage.removeItem("username");
            });
    }
};

export const getters = {
    isLoggedIn: state => !!state.username,
    authStatus: state => state.status
};
