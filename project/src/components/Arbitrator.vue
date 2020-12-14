<template>
    <div>
        <h3>Arbitrator </h3>
        <div class="list-container">
            <div v-for="arbitrator in Object.entries(arbitratorList)" :key="arbitrator[0]" class="box">
                <draggable :list="arbitrator[1]" group="id" @start="drag=true" @end="drag=false">
                    <div v-for="(horse, i) in arbitrator[1]" :key="horse.id" :sortable="false" class="drag"> <b> {{ horse.nazwa }} </b> => Rozjemca {{ i + 1 }}</div>
                </draggable>
                <BaseButton v-on:click="updateHorsePositions(arbitrator[0])" :disabled="!canVote"> Rozstrzygnij </BaseButton>
            </div>
        </div>
    </div>
</template>

<script>
    import draggable from "vuedraggable";

    export default {
        components: {
            draggable
        },
        props: {
            canVote: {
                type: Boolean,
                default: true
            },
            classId: {
                required: true
            }
        },
        data () {
            return {
                arbitratorList: {}
            };
        },
        watch: {
            arbitratorList: function (val) {
                let x = Object.keys(this.arbitratorList).length === 0;
                this.$emit("allVoted", x);
            }
        },
        sockets: {
            connect () {
                console.log("connected from arbitrator component");
            },
            disconnect () {
                console.log("disconnected from abitrator component");
            },
            arbitrator (data) {
                console.log("arbitrator", data);
                let horses = data.horses;
                let id = data.id;
                this.$set(this.arbitratorList, id, horses);
            },
            rozjemcaDodany (index) {
                console.log("dodany", index);
                this.$delete(this.arbitratorList, index);
            }
        },
        methods: {
            updateHorsePositions (index) {
                this.$socket.emit("rozjemca", { horses: this.arbitratorList[index], index: index });
            }
        },
        created () {
            this.$store.dispatch("classes/getArbitrator", this.classId)
                .then(() => {
                    this.arbitratorList = this.$store.state.classes.arbitrator;
                });
        }
    };
</script>

<style lang="less" scoped>
.box {
    border: solid;
    color: black;
    width: 400px;
    margin: 5px;
    padding: 5px;
}
.list-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.drag {
    background-color:antiquewhite;
    margin: 2px;
    text-align: left
}
</style>
