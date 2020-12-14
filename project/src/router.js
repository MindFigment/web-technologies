import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home";
import RateHorsesByClass from "./views/RateHorsesByClass";
import LeaderPanel from "./views/LeaderPanel";
import ViewerPanel from "./views/ViewerPanel";
import HorseList from "./views/HorseList";
import HorseDetails from "./views/HorseDetails";
import JudgeList from "./views/JudgeList";
import JudgeDetails from "./views/JudgeDetails";
import ClassList from "./views/ClassList";
import ClassDetails from "./views/ClassDetails";
import Login from "./views/Login";

import store from "./store/store";

Vue.use(Router);

let router = new Router({
    routes: [
        {
            path: "/login",
            name: "login",
            component: Login
        },
        {
            path: "/",
            name: "home",
            component: Home
        },
        {
            path: "/rate-horses/:id/:judgesNum",
            name: "rate-horses",
            component: RateHorsesByClass,
            props: true,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/leader-panel",
            name: "leader-panel",
            component: LeaderPanel,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/viewer-panel",
            name: "viewer-panel",
            component: ViewerPanel
        },
        {
            path: "/horses",
            name: "horses",
            component: HorseList,
            props: true,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/horse/:id",
            name: "horse-details",
            component: HorseDetails,
            props: true,
            beforeEnter (routeTo, routeFrom, next) {
                store.dispatch("horse/fetchHorse", routeTo.params.id)
                    .then(horse => {
                        routeTo.params.horse = horse;
                        next();
                    });
            },
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/judges",
            name: "judges",
            component: JudgeList,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/judge/:id",
            name: "judge-details",
            component: JudgeDetails,
            props: true,
            beforeEnter (routeTo, routeFrom, next) {
                store.dispatch("judge/fetchJudge", routeTo.params.id)
                    .then(judge => {
                        routeTo.params.judge = judge;
                        next();
                    });
            },
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/classes",
            name: "classes",
            component: ClassList,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/class/:id",
            name: "class-details",
            component: ClassDetails,
            props: true,
            beforeEnter (routeTo, routeFrom, next) {
                store.dispatch("classes/fetchClass", routeTo.params.id)
                    .then(() => {
                        routeTo.params.class_ = store.state.classes.class_;
                        next();
                    });
            },
            meta: {
                requiresAuth: true
            }
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters["login/isLoggedIn"]) {
            next();
        } else {
            next("/login");
        }
    } else {
        next();
    }
});

export default router;
