import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import VueSocketIO from "vue-socket.io";

import BaseButton from "@/components/BaseButton.vue";
import BaseSelect from "@/components/BaseSelect.vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseModal from "@/components/BaseModal.vue";

Vue.component("BaseButton", BaseButton);
Vue.component("BaseSelect", BaseSelect);
Vue.component("BaseInput", BaseInput);
Vue.component("BaseModal", BaseModal);

Vue.use(new VueSocketIO({
    debug: true,
    connection: store.state.url,
    vuex: {
        store,
        actionPrefix: "SOCKET_",
        mutationPrefix: "SOCKET_",
        options: {
            useConnectionNamespace: true
        }
    }
}));

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
