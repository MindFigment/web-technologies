<template>
    <div class="wrapper">
        <div class="direction">
            <div class="column divide">
                <h3> Lista ocenionych klas </h3>
                <div class="window">
                    <div class="list" v-for="category in categories" :key="category.id">
                        <p @click="showCategory(category.id)" class="link"> Nr.{{ category.numer }} {{category.kat }} </p>
                    </div>
                </div>
            </div>
            <div class="column divide">
                <h3> Ranking koni </h3>
                <div class="window">
                    <div class="list" v-for="horse in horses" :key="horse.id">
                        <p @click="showHorseDetails(horse)" class="link"> Nr.{{ horse.numer }} {{ horse.nazwa }} {{ scoresMap[horse.id] }} {{ horse.wynik.rozjemca ? "Rozjemca: " + horse.wynik.rozjemca : "" }} </p>
                    </div>
                </div>
            </div>
            <div class="column divide">
                <div class="window">
                    <HorseTable v-if="displayHorseDetails.show" :horse="horse">
                        <h3> Noty konia {{ horse.nazwa }} </h3>
                    </HorseTable>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import HorseTable from "@/components/HorseTable.vue";

    export default {
        components: {
            HorseTable
        },
        data () {
            return {
                categories: [],
                horses: [],
                horse: undefined,
                displayCategory: false,
                displayHorseDetails: {
                    lastHorse: null,
                    show: false
                },
                scoresMap: {},
                horseRated: undefined
            };
        },
        sockets: {
            connect () {
                console.log("connected from inactive classes component");
            },
            disconnect () {
                console.log("disconnected from inactive classes component");
            },
            newFinishedClass (newClass) {
                this.categories.push(newClass);
            }
        },
        methods: {
            showCategory (classId) {
                this.horsesInCategory(classId);
            },
            showHorseDetails (horse) {
                if (!this.displayHorseDetails.show) {
                    this.horse = horse;
                    this.displayHorseDetails.show = true;
                    this.displayHorseDetails.lastHorse = horse.id;
                } else if (this.displayHorseDetails.show && this.displayHorseDetails.lastHorse !== horse.id) {
                    this.horse = horse;
                    this.displayHorseDetails.lastHorse = horse.id;
                } else {
                    this.displayHorseDetails.show = false;
                }
            },
            sortHorses (horses) {
                horses.forEach(horse => {
                    this.computeScores(horse);
                });
                horses.sort((h1, h2) => {
                    let scoresH1 = this.scoresMap[h1.id];
                    let scoresH2 = this.scoresMap[h2.id];
                    if (scoresH1[0] > scoresH2[0]) {
                        return -1;
                    } else if (scoresH1[0] === scoresH2[0]) {
                        if (scoresH1[1] > scoresH2[1]) {
                            return -1;
                        } else if (scoresH1[1] === scoresH2[1]) {
                            if (scoresH1[2] > scoresH2[2]) {
                                return -1;
                            } else if (scoresH1[2] === scoresH2[2]) {
                                if (h1.wynik.hasOwnProperty("rozjemca") && h2.wynik.hasOwnProperty("rozjemca")) {
                                    if (h1.wynik.rozjemca < h2.wynik.rozjemca) {
                                        return -1;
                                    }
                                }
                            }
                        }
                    }
                    return 1;
                });
            },
            computeScores (horse) {
                if (horse.wynik.noty.length === 0) {
                    return [0, 0, 0];
                } else {
                    let scoreSum = 0;
                    let typeScore = 0;
                    let moveScore = 0;
                    horse.wynik.noty.forEach(score => {
                        scoreSum += Object.values(score).reduce((a, b) => a + b);
                        typeScore += score.typ;
                        moveScore += score.ruch;
                    });
                    this.scoresMap[horse.id] = [scoreSum, typeScore, moveScore];
                }
            },
            horsesInCategory (classId) {
                this.$store.dispatch("classes/fetchHorsesInClass", classId)
                    .then(() => {
                        this.horses = this.$store.state.classes.horsesInClass;
                        this.sortHorses(this.horses);
                    });
            }
        },
        created () {
            this.$store.dispatch("classes/getInactiveCategories")
                .then(() => {
                    this.categories = this.$store.state.classes.inactiveCategories;
                    console.log("categories", this.categories);
                });
        }
    };
</script>

<style lang="less" scoped>
.divide {
    justify-content: space-evenly;
}
.column {
    width: 33%;
    align-self: flex-start
}
.window {
    align-self: center;
    /* align-self: flex-start */
}
.list {
    display: flex;
    align-content: flex-start;
}
p {
    line-height: 0.5;
}
@media all and (max-width: 900px) {
  .column {
    /* On small screens, we are no longer using row direction but column */
   align-self: center;
  }
}
</style>
