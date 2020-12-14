<template>
    <div>
        <form @submit.prevent="customSubmit">
            <BaseInput
                label="Imię i nazwisko"
                v-model="judge.sedzia"
                type="text"
                placeholder="Imie i nazwisko"
                class="field"
            />
            <template v-if="errors.length">
                <p v-for="(error, i) in errors" :key="i" class="errorMessage">
                    {{ error }}
                </p>
            </template>

            <BaseSelect
                label="Kraj pochodzenia"
                :options="countries"
                v-model="judge.kraj"
            />
            <BaseButton type="submit" :disabled="errors.length !== 0 || judge.sedzia === '' || judge.kraj === ''" > Submit </BaseButton>
        </form>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import { isProperName } from "@/helpers/validators.js";

    export default {
        props: {
            func: {
                type: String,
                required: true
            },
            update_judge: {
                type: Object,
                default: function () {
                    return {
                        id: "",
                        sedzia: "",
                        kraj: ""
                    };
                }
            }
        },
        data () {
            return {
                countries: [],
                judge: Object.assign({}, this.update_judge),
                errors: []
            };
        },
        watch: {
            "judge.sedzia": function (val) {
                this.errors = [];
                if (val === "") {
                    this.errors.push("Imie jest wymagane");
                } else {
                    if (!isProperName(val)) {
                        this.errors.push("Niepoprawne imię");
                    }
                }
            }
        },
        methods: {
            customSubmit () {
                if (this.func === "add") {
                    this.addJudge();
                } else {
                    this.updateJudge();
                }
            },
            addJudge () {
                this.$store.dispatch("judge/createJudge", this.judge)
                    .then((response) => {
                        this.judge = this.createFreshJudgeObject();
                        this.$router.push({ name: "judge-details", params: { id: response.id } });
                    });
            },
            updateJudge () {
                this.$store.dispatch("judge/updateJudge", this.judge)
                    .then((response) => {
                        this.judge = response;
                        this.$emit("updatedJudge", false, this.judge);
                    });
            },
            createFreshJudgeObject () {
                return {
                    id: "",
                    sedzia: "",
                    kraj: ""
                };
            },
            getCountries () {
                this.$store.dispatch("country/fetchCountries")
                    .then(() => {
                        this.countries = this.getCountriesForSelect();
                    });
            }
        },
        computed: {
            ...mapGetters({ getCountriesForSelect: "country/getCountriesForSelect" })
        },
        created () {
            this.getCountries();
        }
    };
</script>

<style>

</style>
