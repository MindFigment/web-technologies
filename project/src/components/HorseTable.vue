<template>
    <div id="table">
        <slot/>
        <div id="titles">
            <div class="title-cell"> Typ </div>
            <div class="title-cell"> Głowa </div>
            <div class="title-cell"> Kłoda </div>
            <div class="title-cell"> Nogi </div>
            <div class="title-cell"> Ruch </div>
        </div>
        <div v-for="(score, index) in horse.wynik.noty" :key="index" class="score-row">
            <div class="score-cell">
                <p> {{ score.typ }} <p/>
            </div>
            <div class="score-cell">
                <p> {{ score.glowa }} <p/>
            </div>
            <div class="score-cell">
                <p> {{ score.kloda }} <p/>
            </div>
            <div class="score-cell">
                <p> {{ score.nogi }} <p/>
            </div>
            <div class="score-cell">
                <p> {{ score.ruch }} <p/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            horse: {
                type: Object,
                required: true
            }
        }
    };
</script>

<style lang="less" scoped>
@size: 45px;
#table {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-content: center;
}
#titles {
    display: flex;
    flex-direction: row;
    width: 100%;
}
.title-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    width: @size + 5.46px;
    height: @size + 5.46px;
    margin: 5px;
    padding: 5px;
}
.score-row {
  display: flex;
  flex-direction: row;
  width: 100%;
}
.score-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    width: @size;
    height: @size;
    margin: 5px;
    padding: 5px;
    border-style: solid;
}
.score-cell2 {
    display: flex;
    align-items: center;
    justify-content: center;
    width: @size;
    height: @size;
    margin: 5px;
    padding: 5px;
    background-color: rgb(30, 144, 185);
}
#overall-score {
    display: flex;
    align-items: center;
    justify-content: center;
    width: @size;
    height: @size;
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
</style>
