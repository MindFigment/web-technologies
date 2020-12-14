<template>
    <div class="wrapper">
        <div class="direction">
            <div class="column divide">
                <h3> Lista ocenianych klas </h3>
                <div class="window">
                    <div class="list" v-for="category in categories" :key="category.id">
                        <p @click="joinCategory(category.id)" class="link"> Nr.{{ category.numer }} {{category.kat }} </p>
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
                console.log("connected to socket");
            },
            disconnect () {
                console.log("disconnected with socket");
            },
            activeCategories (categories) {
                this.categories = categories;
            },
            horsesInCategory (horses) {
                this.horses = horses;
                this.sortHorses(horses);
            },
            newHorseRated (horse) {
                this.sortNewHorse(horse);
            },
            rozjemcaKonie (horses) {
                this.insertRozjemca(horses);
            }
        },
        methods: {
            joinCategory (categoryId) {
                this.$socket.emit("joinCategory", { categoryId: categoryId });
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
                    this.scoresMap[horse.id] = [0, 0, 0];
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
            sortNewHorse (horse) {
                this.computeScores(horse);
                let index = this.horses.map(horse => horse.id).indexOf(horse.id);
                if (index > -1) {
                    this.horses.splice(index, 1);
                }
                this.horses.push(horse);
                let i = this.horses.length - 1;
                let h = this.horses[i];
                let s = this.scoresMap[h.id];
                let s2 = this.scoresMap[this.horses[i - 1].id];
                let goOn = (s[0] > s2[0]) || (s[0] === s2[0] && s[1] > s2[1]) || (s[0] === s2[0] && s[1] === s2[1] && s[2] > s2[2]);
                while (i > 0 && goOn) {
                    this.$set(this.horses, i, this.horses[i - 1]);
                    i -= 1;
                    if (i > 0) {
                        s2 = this.scoresMap[this.horses[i - 1].id];
                        goOn = (s[0] > s2[0]) || (s[0] === s2[0] && s[1] > s2[1]) || (s[0] === s2[0] && s[1] === s2[1] && s[2] > s2[2]);
                    }
                }
                this.$set(this.horses, i, h);
            },
            insertRozjemca (horses) {
                let len = horses.length;
                let ids = this.horses.map(horse => horse.id);
                let index = this.horses.length;
                let tmp;
                for (let i = 0; i < len; i++) {
                    tmp = ids.indexOf(horses[i].id);
                    if (tmp < index) {
                        index = tmp;
                    }
                }
                for (let i = 0; i < len; i++) {
                    this.$set(this.horses, index + i, horses[i]);
                }
            }
        },
        created () {
            this.$socket.emit("activeCategories");
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
