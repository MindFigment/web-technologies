<template>
    <div class="wrapper">
        <SideBar/>
        <div v-if="!showAdd" class="content">
            <h1> Lista koni
                <span class="badge -fill-gradient">{{ numberOfHorses }}</span>
            </h1>
            <div v-show="ready == 2">
                <Search :data="horses" :searchFields="['nazwa', 'kraj']"/>
            </div>
            <div class="row">
                <BaseButton @click="showAdd = true"> Dodaj </BaseButton>
            </div>
            <div>
                <div class="long-list" v-show="ready == 2">
                    <HorseCard v-for="horse in currentHorses" :key="horse.id" :horse="horse"/>
                </div>
                <div class="content">
                    <template v-if="page != 1">
                        <router-link :to="{ name: 'horses', query: { page: page - 1 } }" rel="prev">
                            Poprzednia</router-link>
                        <template v-if="hasNextPage"> | </template>
                    </template>
                    <router-link v-if="hasNextPage" :to="{ name: 'horses', query: { page: page + 1 } }" rel="next">
                        Kolejna</router-link>
                </div>
            </div>
        </div>
        <div v-if="showAdd" class="content">
            <h1> Dodaj konia </h1>
            <BaseButton @click="showAdd = false"> Lista </BaseButton>
            <AddHorse :func="add" :horses="horses"/>
        </div>
    </div>
</template>

<script>
    import HorseCard from "@/components/HorseCard.vue";
    import AddHorse from "@/components/AddHorse.vue";
    import store from "@/store/store";
    import SideBar from "@/components/SideBar.vue";
    import { mapState } from "vuex";
    import Search from "@/components/Search.vue";

    function getPageHorses (routeTo, next) {
        const currentPage = parseInt(routeTo.query.page) || 1;
        store
            .dispatch("horse/fetchPageHorses", {
                page: currentPage
            })
            .then(() => {
                routeTo.params.page = currentPage;
                next();
            });
    }

    export default {
        components: {
            HorseCard,
            AddHorse,
            SideBar,
            Search
        },
        props: {
            page: {
                type: Number,
                required: true
            }
        },
        data () {
            return {
                add: "add",
                ready: 0,
                showAdd: false,
                horses: [],
                filtered: []
            };
        },
        computed: {
            numberOfHorses () {
                return this.horse.horsesTotal;
            },
            hasNextPage () {
                return this.horse.horsesTotal > this.page * this.horse.perPage;
            },
            currentHorses () {
                return this.horse.pageHorses;
            },
            ...mapState(["horse"])
        },
        created () {
            store.dispatch("horse/fetchHorses")
                .then((horses) => {
                    this.ready += 1;
                    this.horses = horses;
                });
            store.dispatch("classes/fetchClasses")
                .then(() => {
                    this.ready += 1;
                }); ;
        },
        beforeRouteEnter (routeTo, routeFrom, next) {
            getPageHorses(routeTo, next);
        },
        beforeRouteUpdate (routeTo, routeFrom, next) {
            getPageHorses(routeTo, next);
        }
    };
</script>

<style>

</style>
