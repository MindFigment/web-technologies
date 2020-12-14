<template>
    <div class="wrapper">
        <div class="column">
            <h3> Oceniany koń: {{ horse.nazwa }} </h3>
        </div>
        <div class="direction">
            <div id="table">
                <div id="titles">
                    <div class="title-cell"> Typ </div>
                    <div class="title-cell"> Głowa </div>
                    <div class="title-cell"> Kłoda </div>
                    <div class="title-cell"> Nogi </div>
                    <div class="title-cell"> Ruch </div>
                    <div class="title-cell"> Suma </div>
                </div>
                <div @keydown="keyPressed" v-for="(score, index) in scores" :key="index" class="score-row">
                    <div class="score-cell">
                        <input :tabindex="1" class="input" v-model.number="score.typ"/>
                    </div>
                    <div class="score-cell">
                        <input :tabindex="2" class="input" v-model.number="score.glowa"/>
                    </div>
                    <div class="score-cell">
                        <input :tabindex="3" class="input" v-model.number="score.kloda"/>
                    </div>
                    <div class="score-cell">
                        <input :tabindex="4" class="input" v-model.number="score.nogi"/>
                    </div>
                    <div class="score-cell">
                        <input :tabindex="5" class="input" v-model.number="score.ruch"/>
                    </div>
                    <div class="score-cell2"> {{ judgeScore(index) }} </div>
                </div>
                <div class="row">
                    <div id="overall-score"> {{ typeSum }} </div>
                    <div id="overall-score"> {{ scoresSum() }} </div>
                    <div id="overall-score"> {{ moveSum }} </div>
                </div>
            </div>
        </div>
        <BaseButton v-on:click="sendScore" :disabled="allRated || !ready"> Oceń </BaseButton>
    </div>
</template>

<script>
    // import HorseService from "@/services/HorseService.js";

    export default {
        props: {
            id: {
                default: 1
            },
            judgesNum: {
                type: [Number, String]
            },
            allRated: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                horse: this.id,
                scoresByJudge: [],
                ready: true
            };
        },
        watch: {
            id: function (newId, oldId) {
                // HorseService.getHorseById(newId)
                //     .then(response => {
                //         this.horse = response.data;
                //         this.ready = true;
                //     })
                //     .catch(error => {
                //         console.log("There was an error:", error.response);
                //     });
                this.ready = true;
                this.horse = this.id;
            }
        },
        methods: {
            judgeScore: function (i) {
                let score;
                if (this.horse.wynik !== undefined && this.horse.wynik.noty[i]) {
                    score = Object.values(this.horse.wynik.noty[i]).reduce((a, b) => {
                        a = a === "" ? 0 : parseFloat(a);
                        b = b === "" ? 0 : parseFloat(b);
                        return a + b;
                    }, 0);
                } else {
                    score = 0;
                }
                this.scoresByJudge[i] = score;
                return score;
            },
            scoresSum () {
                return this.scoresByJudge.reduce((a, b) => a + b, 0);
            },
            sendScore () {
                this.horse.oceniony = true;
                let data = {
                    horse: this.horse,
                    scoreSum: this.scoresSum(),
                    typeSum: this.typeSum,
                    moveSum: this.moveSum
                };
                this.ready = false;
                this.$emit("horseRated", data);
            },
            createFreshScoreRow () {
                return {
                    typ: "",
                    glowa: "",
                    kloda: "",
                    nogi: "",
                    ruch: ""
                };
            },
            reducer (a, b) {
                if (isNaN(parseFloat(a))) {
                    a = 0;
                }
                if (isNaN(parseFloat(b))) {
                    b = 0;
                }
                return a + b;
            },
            keyPressed (e) {
                if (e.key !== "Backspace" && e.key !== "Tab") {
                    let number;
                    if (e.target.selectionStart < e.target.selectionEnd) {
                        number = Number(e.key);
                    } else {
                        number = Number(e.target.value + e.key);
                    }
                    if (isNaN(number) || number < 0 || number > 20 || !Number.isInteger(2 * number)) {
                        e.preventDefault();
                    }
                }
                return true;
            }
        },
        computed: {
            judgeNum: function () {
                return this.horse.wynik === undefined ? 0 : this.horse.wynik.noty.length;
            },
            scores: function () {
                let num = parseInt(this.judgesNum);
                let noty = this.horse.wynik === undefined ? [] : this.horse.wynik.noty;
                if (noty === undefined) {
                    for (let i = 0; i < num; i++) {
                        noty.push(this.createFreshScoreRow());
                    }
                } else {
                    if (noty.length < num) {
                        for (let i = noty.length; i < num; i++) {
                            noty.push(this.createFreshScoreRow());
                        }
                    } else if (noty.length > num) {
                        noty.splice(num, noty.length - num);
                    }
                }
                return noty;
            },
            typeSum: function () {
                return this.horse.wynik && this.horse.wynik.noty ? this.horse.wynik.noty.map(noty => noty["typ"]).reduce(this.reducer, 0) : 0;
            },
            moveSum: function () {
                return this.horse.wynik && this.horse.wynik.noty ? this.horse.wynik.noty.map(noty => noty["ruch"]).reduce(this.reducer, 0) : 0;
            }
        }
        // created () {
        //     HorseService.getHorseById(this.id)
        //         .then(response => {
        //             this.horse = response.data;
        //         })
        //         .catch(error => {
        //             console.log("There was an error:", error.response);
        //         });
        // }
    };

</script>

<style lang="less" scoped>
#table {
    display: flex;
    flex-direction: column;
    align-self: center;
}
#titles {
    display: flex;
    flex-direction: row;
}
.title-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
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
/* input::-webkit-outer-spin-button */
input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0;
}
input[type=number] {
    -moz-appearance:textfield; /* Firefox */
}
.content, .direction {
    justify-content: center;
    margin: 0;
}
</style>
