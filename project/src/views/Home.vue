<template>
    <article>
        <h1> Pokazy Koni </h1>
        <div class="info">
            <h2> Opis </h2>
            <p> Aplikacja służy do obsługi pokazów koni arabskich.</p>
            <h2> Ładowanie danych </h2>
            <p> Naciśnij przycisk "Załaduj", aby probrać przykładowe dane z jsonowego serwera.</p>
            <b class="-text-error"> UWAGA !!! </b>
            <p> Spowoduje to usunięcie wszystkich obecnych danych. </p>
            <template v-if="status === 200">
                <h5> Dane zostały poprawnie pobrane </h5>
            </template>
            <template v-else-if="status !== - 1 && status !== 200">
                <h5 class="errorMessage"> Wystąpił błąd, dane nie zostały pobrane </h5>
            </template>
            <BaseButton v-on:click="loadData()"> Załaduj </BaseButton>
        </div>
    </article>
</template>

<script>
    export default {
        data () {
            return {
                status: -1,
                url: this.$store.state.url
            };
        },
        methods: {
            loadData () {
                fetch(this.url + "/fetch").then((data) => {
                    console.log("succesfully fetched data", data);
                    this.status = parseInt(data.status);
                })
                    .catch((err) => {
                        console.log(err);
                        this.status = 1;
                    });
            }
        }
    };
</script>

<style>
article {
    display: flex;
    flex-direction: column;
    /* align-items: center; */
}
.info {
    text-align: left;
}
p {
    line-height: 1.5;
}
</style>
