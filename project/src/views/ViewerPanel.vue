<template>
    <div class="wrapper">
        <h1> Panel kibica </h1>
        <h4> {{ showActive ? "Trwające" : "Zakończone" }} </h4>
        <div class="row">
            <BaseButton @click="showActive = false"> Zakończone </BaseButton>
            <BaseButton @click="showActive = true"> Trwające </BaseButton>
        </div>
        <div class="direction">
            <template v-if="showActive === undefined">
                <p> Tutaj możesz podejrzeć pokazy już zakończone oraz pokazy jeszcze trwające </p>
            </template>
            <template v-else-if="showActive">
                <ActiveClasses></ActiveClasses>
            </template>
            <template v-else-if="!showActive">
                <InactiveClasses></InactiveClasses>
            </template>
        </div>
    </div>
</template>

<script>
    import ActiveClasses from "@/components/ActiveClasses.vue";
    import InactiveClasses from "@/components/InactiveClasses.vue";

    export default {
        components: {
            ActiveClasses,
            InactiveClasses
        },
        data () {
            return {
                showActive: undefined
            };
        }

    };
</script>

<style scoped>

</style>
