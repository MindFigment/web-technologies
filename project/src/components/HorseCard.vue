<template>
    <router-link :to="{ name: 'horse-details', params: { id: horse.id } }">
        <div class="horse-card">
            <h3> {{ horse.nazwa }}  </h3>
            <div class="row">
                <p> <b>Numer startowy:</b> {{ horse.numer }}</p> &nbsp;&nbsp;&nbsp;&nbsp;
                <p> <b>Klasa:</b> {{ kat }} </p>
            </div>
        </div>
    </router-link>
</template>

<script>
    import { mapGetters } from "vuex";

    export default {
        props: {
            horse: Object
        },
        computed: {
            ...mapGetters({ getClassById: "classes/getClassById" }),
            kat () {
                return this.getClassById(this.horse.klasa) ? this.getClassById(this.horse.klasa).kat : "";
            }
        }
    };
</script>

<style scoped>
.horse-card {
    padding: 20px;
    margin-top: 24px;
    margin-bottom: 24px;
    transition: all 0.2s linear;
    cursor: pointer;
    border: solid;
    border-color: antiquewhite;
    background-color: antiquewhite;
}
h3 {
    margin-top: auto;
}
.horse-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.19);
}
</style>
