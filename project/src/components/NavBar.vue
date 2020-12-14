<template>
    <header id="header">
        <img :src="require('@/assets/horse-head-64.png')" @click="toHomePage"/>
        <div id="nav">
            <router-link class="bookmark" :to="{ name: 'leader-panel' }">Panel Prowadzącego</router-link>
            <router-link class="bookmark" :to="{ name: 'viewer-panel' }">Panel Kibica</router-link>
            <router-link v-if="!isLoggedIn" class="bookmark" :to="{ name: 'login' }">Zaloguj się</router-link>
            <span class="bookmark" v-if="isLoggedIn" @click="logout"> Wyloguj się ({{username}}) </span>
        </div>
    </header>
</template>

<script>
    import { mapGetters } from "vuex";

    export default {
        computed: {
            username: function () {
                return this.$store.state.login.username;
            },
            ...mapGetters({
                isLoggedIn: "login/isLoggedIn"
            })
        },
        methods: {
            toHomePage: function () {
                this.$router.push({ name: "home" });
            },
            logout () {
                this.$store.dispatch("login/logout")
                    .then(() => {
                        this.$router.push({ name: "home" });
                    });
            }
        }
    };
</script>

<style lang="less">
#header {
    position: fixed;
    left: 0;
    right: 0;
    padding: 10px 40px;
    margin-bottom: 100px;
    background-color: rgba(255,255,255,0.9);
    display: flex;
    align-items: center;
    justify-content: space-between;
    #nav {
       justify-content: flex-end;
        .bookmark {
            font-size: 14px;
            padding: 0;
            margin: 0 10px;
            height: 40px;
            &:hover {
                color: #8f6e64;
            }
        }
    }
    img {
        float: left;
        width: 48px;
        height: 48px;
    }
}

</style>
