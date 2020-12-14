import Vue from "vue";
import Vuex from "vuex";
import * as judge from "@/store/modules/judge.js";
import * as country from "@/store/modules/country.js";
import * as classes from "@/store/modules/classes.js";
import * as horse from "@/store/modules/horse.js";
import * as login from "@/store/modules/login.js";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        judge,
        country,
        classes,
        horse,
        login
    },
    state: {
        url: "http://172.17.0.1:4444"
    },
    mutations: {

    },
    actions: {

    }
});
