<template>
    <div>
        <h3> Kolejność według numeru startowego </h3>
        <p> Ilość koni w klasie {{ horses.length }} </p>
        <ul v-for="horse in horses" :key="horse.id">
            <li class="link" @click="clickHorse(horse.id)"> <b> Nr.{{ horse.numer }} {{horse.nazwa }} </b> | oceniony: {{ horse.oceniony === true ? true : false }} </li>
        </ul>
    </div>
</template>

<script>

    export default {
        props: {
            horses: {
                type: Array,
                required: true
            }
        },
        methods: {
            clickHorse (horseId) {
                this.$emit("changeCurrentHorse", horseId);
            }
        }
    };
</script>

<style lang="less" scoped>
ul {
    list-style: none;
        display: flex;
    flex-direction: column;
    line-height: 1;
    justify-content: flex-start;
    align-content: flex-start;
    align-items: flex-start;
}
</style>
