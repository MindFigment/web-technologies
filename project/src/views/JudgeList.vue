<template>
    <div class="wrapper">
        <SideBar/>
        <div class="content">
            <h1> Lista sędziów
                <span class="badge -fill-gradient">{{ judge.judges.length }}</span>
            </h1>
            <div class="row">
                <BaseButton @click="showModal = true"> Dodaj </BaseButton>
            </div>
            <div v-if="showModal">
                <BaseModal @close="showModal = false">
                    <template v-slot:header>
                        <h1> Dodaj nowego sędziego </h1>
                    </template>
                    <template v-slot:body>
                        <AddJudge :func="add"/>
                    </template>
                </BaseModal>
            </div>
            <div v-if="ready">
                <JudgeCard v-for="judge in judge.judges" :key="judge.id" :judge="judge"/>
            </div>
        </div>
    </div>
</template>

<script>
    import JudgeCard from "@/components/JudgeCard.vue";
    import AddJudge from "@/components/AddJudge.vue";
    import { mapState } from "vuex";
    import store from "@/store/store";
    import SideBar from "@/components/SideBar.vue";

    export default {
        components: {
            JudgeCard,
            AddJudge,
            SideBar
        },
        data () {
            return {
                add: "add",
                ready: false,
                showModal: false
            };
        },
        computed: {
            ...mapState(["judge"])
        },
        created () {
            store.dispatch("judge/fetchJudges")
                .then(() => {
                    this.ready = true;
                });
        }
    };
</script>

<style>

</style>
