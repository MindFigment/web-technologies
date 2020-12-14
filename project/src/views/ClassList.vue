<template>
    <div class="wrapper">
        <SideBar/>
        <div class="content">
            <h1> Lista klas
                <span class="badge -fill-gradient">{{ classes.classes.length }}</span>
            </h1>
            <BaseButton @click="showModal = true"> Dodaj </BaseButton>
            <div v-if="showModal">
                <BaseModal @close="showModal = false">
                    <template v-slot:header>
                        <h1> Dodaj nową klasę </h1>
                    </template>
                    <template v-slot:body>
                        <AddClass :func="add"/>
                    </template>
                </BaseModal>
            </div>
            <div v-if="ready">
                <ClassCard class="long-list" v-for="class_ in classes.classes" :key="class_.id" :class_="class_"/>
            </div>
        </div>
    </div>
</template>

<script>
    import ClassCard from "@/components/ClassCard.vue";
    import AddClass from "@/components/AddClass.vue";
    import { mapState } from "vuex";
    import store from "@/store/store";
    import SideBar from "@/components/SideBar.vue";

    export default {
        components: {
            ClassCard,
            AddClass,
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
            ...mapState(["classes"])
        },
        created () {
            store.dispatch("classes/fetchClasses")
                .then(() => {
                    this.ready = true;
                });
        }
    };
</script>

<style>

</style>
