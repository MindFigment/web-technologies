<template>
    <div class="wrapper">
        <div class="direction">
            <HorsesRanking @changeCurrentHorse="setCurrentHorse" :horses="horses" class="blocks"></HorsesRanking>
            <RateHorse :id="currentHorse" :judgesNum="judgesNum" @horseRated="rateNextHorse" class="blocks" :allRated="allHorsesRated"></RateHorse>
            <Arbitrator class="blocks" :canVote="allHorsesRated" :classId="id" @allVoted="allVotedFun"></Arbitrator>
        </div>
        <div>
            <br><br>
            <BaseButton @click="endCompetition" :disabled="!allHorsesRated || !allVoted">
                Zakończ konkurs
            </BaseButton>
            <div v-if="!allHorsesRated"> <h5> Wszyskie konie muszą być ocenione, aby zakończyć pokaz </h5> </div>
            <div v-else-if="!allVoted"> <h5> Arbitrator musi rozstrzygnąć wszystkie spory </h5> </div>
            <div v-else> <h5> Wszyskie konie ocenione, możesz zakończyć pokaz </h5> </div>
        </div>
    </div>
</template>

<script>
    import RateHorse from "@/components/RateHorse.vue";
    import HorsesRanking from "@/components/HorsesRanking.vue";
    import Arbitrator from "@/components/Arbitrator.vue";
    import { mapState } from "vuex";

    export default {
        components: {
            RateHorse,
            HorsesRanking,
            Arbitrator
        },
        props: {
            id: {
                default: 1
            },
            judgesNum: {
                type: [Number, String]
            }
        },
        data () {
            return {
                isConnected: false,
                currentHorse: {},
                currentIndex: 0,
                horsesLength: 0,
                horses: [],
                allVoted: false
            };
        },
        sockets: {
            connect () {
                this.isConnected = true;
            },
            disconnect () {
                this.isConnected = false;
            },
            newFinishedClass (newClass) {
                this.$router.push({ name: "class-details", params: { id: newClass.id } });
            }
        },
        methods: {
            rateNextHorse (ratedHorse) {
                this.$socket.emit("horseRated", { horse: ratedHorse, class: this.id });
                this.$set(this.horses, this.currentIndex, ratedHorse.horse);
                this.currentIndex = this.currentIndex === this.horsesLength - 1 ? 0 : this.currentIndex + 1;
                // this.currentHorse = this.horses[this.currentIndex].id;
                this.currentHorse = this.horses[this.currentIndex];
            },
            setCurrentHorse (horseId) {
                // this.currentHorse = horseId;
                this.currentIndex = this.horses.findIndex((horse) => horse.id === horseId);
                this.currentHorse = this.horses[this.currentIndex];
            },
            endCompetition () {
                let updatedClass = {
                    id: this.id,
                    zakonczona: true
                };
                this.$socket.emit("makeCategoryInactive", updatedClass);
            },
            sortByNumber (horses) {
                horses.sort((h1, h2) => h1.numer < h2.numer ? -1 : 1);
            },
            allVotedFun (is) {
                this.allVoted = is;
            }
        },
        computed: {
            ...mapState(["classes"]),
            allHorsesRated () {
                return this.horses.every((horse) => horse.oceniony === true);
            }
        },
        created () {
            this.$store.dispatch("classes/fetchHorsesInClass", this.id)
                .then(() => {
                    this.horses = this.$store.state.classes.horsesInClass;
                    this.sortByNumber(this.horses);
                    this.horsesLength = this.horses.length;
                    // this.currentHorse = this.horses[0].id;
                    this.currentHorse = this.horses[0];
                });
        }
    };
</script>

<style scoped lang="less">
#table {
    display: flex;
    flex-direction: column;
    align-items: center;
}
#titles {
    display: flex;
    flex-direction: row;
}
.title-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 30px;
    margin: 5px;
    padding: 5px;
}
.score-row {
  display: flex;
  flex-direction: row;
}
.score-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    margin: 5px;
    padding: 5px;
    border-style: solid;
}
.score-cell2 {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    margin: 5px;
    padding: 5px;
    background-color: rgb(30, 144, 185);
}
#overall-score {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    margin: 5px;
    padding: 5px;
    background-color: rgba(185, 30, 30, 0.442);
}
.input {
    position: relative;
    width: 100%;
    height: 100%;
    border-style: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0px;
    margin: 0px;
    text-align: center;
}
// input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0;
}
input[type=number] {
    -moz-appearance:textfield; /* Firefox */
}
.direction {
    justify-content: space-evenly;
}
@media all and (min-width: 901px) {
  .blocks {
    /* On small screens, we are no longer using row direction but column */
   width: 33%;
  }
}
</style>
