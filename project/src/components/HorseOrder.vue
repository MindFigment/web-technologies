<template>
    <div>
        <draggable class="draggable" filter=".filtered" v-model="horseOrder" group="numer" :move="handleMove" @start="drag=true" @end="drag=false">
            <div class="cell" :class="{ 'changable': (horse.id === newHorse.id), 'filtered': (horse.id !== newHorse.id) }" v-for="(horse, index) in horseOrder" :key="horse.id"> {{ index + 1 }} </div>
        </draggable>
        <BaseButton buttonClass="-fill-gradient-blue" @click="updateHorsePositions"> Zaktualizuj </BaseButton>
    </div>
</template>

<script>
    import draggable from "vuedraggable";
    export default {
        components: {
            draggable
        },
        props: {
            horses: {
                type: Array,
                required: true
            },
            currentHorseNumber: {
                type: Number,
                required: true
            },
            func: {
                type: String,
                required: true
            },
            horseId: {
                type: [Number, String]
            }
        },
        data () {
            return {
                horseOrder: this.horses.slice(),
                newHorse: {}
            };
        },
        methods: {
            updateHorsePositions () {
                let from, to, len, start;
                if (this.newHorse.numer < this.currentHorseNumber) {
                    from = this.newHorse.numer;
                    to = this.currentHorseNumber;
                } else if (this.newHorse.numer > this.currentHorseNumber) {
                    from = this.currentHorseNumber - 1;
                    to = this.newHorse.numer - 1;
                } else {
                    from = 0;
                    to = 0;
                }
                len = to - from;
                start = from + 1;
                this.horseOrder = this.horseOrder.splice(from, len);
                this.horseOrder.forEach((h, i) => {
                    h.numer = start + i;
                });
                this.$emit("horsesToUpdate", { numer: this.newHorse.numer, horsesToUpdate: this.horseOrder });
            },
            handleMove ({ relatedContext, draggedContext }) {
                this.newHorse.numer = draggedContext.futureIndex + 1;
            },
            close () {
                this.$emit("close");
            }
        },
        created () {
            if (this.func === "add") {
                this.newHorse = {
                    id: -1,
                    numer: this.currentHorseNumber
                };
                this.horseOrder.push(this.newHorse);
            } else if (this.func === "update") {
                this.newHorse = {
                    id: this.horseId,
                    numer: this.currentHorseNumber
                };
                let index = this.horseOrder.map((h) => h.id).indexOf(this.newHorse.id);
                this.horseOrder[index] = this.newHorse;
            }
            this.horseOrder.sort((h1, h2) => (h1.numer <= h2.numer) ? -1 : 1);
        }
    };
</script>

<style lang="less" scoped>
    .cell {
        width: 30px;
        height: 30px;
        background-color: aliceblue;
        border: solid;
        border-width: 1px;
        display: flex;
        text-align: center;
        justify-content: center;
    }
    .changable {
        background-color: rgb(248, 195, 48);
    }
    .filtered {
        background-color: rgb(149, 140, 113);
    }
    .draggable {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
</style>
