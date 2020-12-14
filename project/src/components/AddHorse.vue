<template>
    <div>
        {{ horse.id }}
        {{ currentPosition }}
        <form @submit.prevent="customSubmit">
            <BaseInput
                label="Numer"
                v-model="horse.numer"
                type="number"
                placeholder="Numer"
                class="field"
                @click="openModal"
                readonly
            />
            <div v-if="showModal">
                <BaseModal @close="showModal = false">
                    <template v-slot:header>
                        <h1> Ustal numer startowy </h1>
                    </template>
                    <template v-slot:body>
                        <HorseOrder :func="func" :currentHorseNumber="currentPosition" :horseId="horse.id" :horses="horsePositions" @horsesToUpdate="horsesToUpdateFun"/>
                    </template>
                </BaseModal>
            </div>
            <BaseInput
                label="Nazwa"
                v-model="horse.nazwa"
                type="text"
                placeholder="Nazwa"
                class="field"
            />

            <template v-if="errors.nazwa.length">
                <p v-for="error in errors.nazwa" :key="error" class="errorMessage">
                    {{ error }}
                </p>
            </template>

            <BaseSelect
                label="Kraj"
                v-model="horse.kraj"
                :options="countries"
                class="field"
            />

            <BaseInput
                label="Rocznik"
                v-model.number="horse.rocznik"
                type="number"
                placeholder="Rocznik"
                class="field"
            />

            <template v-if="errors.rocznik.length">
                <p v-for="error in errors.rocznik" :key="error" class="errorMessage">
                    {{ error }}
                </p>
            </template>

            <BaseInput
                label="Maść"
                v-model="horse.masc"
                type="text"
                placeholder="Maść"
                class="field"
            />

            <BaseSelect
                label="Wybierz płeć konia"
                :options="plec"
                v-model="horse.plec"
                class="field"
            />

            <BaseSelect
                label="Wybierz klasę konia"
                :options="classes"
                v-model.number="horse.klasa"
                class="field"
            />

            <label><b> HODOWCA </b></label><br><br>

            <BaseInput
                label="Hodowca"
                v-model="horse.hodowca.nazwa"
                type="text"
                placeholder="nazwa"
                class="field"
            />

            <template v-if="errors.hodowca.length">
                <p v-for="error in errors.hodowca" :key="error" class="errorMessage">
                    {{ error }}
                </p>
            </template>

            <BaseSelect
                label="Hodowca"
                v-model="horse.hodowca.kraj"
                :options="countries"
                class="field"
            />

            <label><b> WŁAŚCICIEL </b></label><br><br>

            <BaseInput
                label="Właściciel"
                v-model="horse.wlasciciel.nazwa"
                type="text"
                placeholder="nazwa"
                class="field"
            />

            <template v-if="errors.wlasciciel.length">
                <p v-for="error in errors.wlasciciel" :key="error" class="errorMessage">
                    {{ error }}
                </p>
            </template>

            <BaseSelect
                label="Właściciel"
                v-model="horse.wlasciciel.kraj"
                :options="countries"
                class="field"
            />

            <label><b> RODOWÓD </b></label><br><br>

            <template v-if="errors.rodowod.length">
                <p v-for="error in errors.rodowod" :key="error" class="errorMessage">
                    {{ error }}
                </p>
            </template>

            <BaseInput
                label="Nazwa Ojca"
                v-model="horse.rodowod.o.nazwa"
                type="text"
                placeholder="nazwa ojca"
                class="field"
            />

            <BaseSelect
                label="Kraj pochodzenia ojca"
                v-model="horse.rodowod.o.kraj"
                :options="countries"
                placeholder="kraj matki"
                class="field"
            />

            <BaseInput
                label="Nazwa Matki"
                v-model="horse.rodowod.m.nazwa"
                type="text"
                placeholder="nazwa matki"
                class="field"
            />

            <BaseSelect
                label="Kraj pochodzenia matki"
                v-model="horse.rodowod.m.kraj"
                :options="countries"
                placeholder="kraj matki"
                class="field"
            />

            <BaseInput
                label="Ojciec Matki nazwa"
                v-model="horse.rodowod.om.nazwa"
                type="text"
                placeholder="Ojciec Matki nazwa"
                class="field"
            />

            <BaseSelect
                label="Ojciec Matki kraj pochodzenia"
                v-model="horse.rodowod.om.kraj"
                :options="countries"
                class="field"
            />

            <BaseButton type="submit"
                        :disabled="errors.nazwa.length !== 0 || errors.rocznik.length !== 0 || errors.hodowca.length !== 0 || errors.wlasciciel.length !== 0 ||
                            horse.nazwa === '' || horse.rocznik === ''">
                Submit</BaseButton>
        </form>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import HorseOrder from "@/components/HorseOrder.vue";
    import { isProperName } from "@/helpers/validators.js";
    import HorseService from "@/services/HorseService.js";
    export default {
        components: {
            HorseOrder
        },
        props: {
            horseToUpdate: {
                type: Object,
                default: () => {
                    return horseObject;
                }
            },
            func: {
                type: String,
                required: true
            }
        },
        data () {
            return {
                countries: [],
                plec: ["kl.", "og."],
                horse: Object.assign({}, this.horseToUpdate),
                classes: [],
                showModal: false,
                horses: this.$store.state.horse.horses.slice(),
                horsesToUpdate: [],
                errors: {
                    nazwa: [],
                    rocznik: [],
                    hodowca: [],
                    wlasciciel: [],
                    rodowod: []
                }
            };
        },
        watch: {
            "horse.klasa": function (val) {
                this.errors.klasa = [];
                if (val === "") {
                    this.errors.klasa.push("Klasa jest wymagana");
                }
            },
            "horse.rocznik": function (val) {
                this.errors.rocznik = [];
                if (val === "") {
                    this.errors.rocznik.push("Rocznik jest wymagany");
                }
            },
            "horse.nazwa": function (val) {
                this.errors.nazwa = [];
                if (val === "") {
                    this.errors.nazwa.push("Nazwa jest wymagana");
                } else {
                    if (!isProperName(val)) {
                        this.errors.nazwa.push("Niepoprawna nazwa konia");
                    }
                }
            },
            "horse.hodowca.nazwa": function (val) {
                this.errors.hodowca = [];
                if (val === "") {
                    this.errors.nazwa.push("Nazwa jest wymagana");
                } else {
                    if (!isProperName(val)) {
                        this.errors.nazwa.push("Niepoprawna nazwa konia");
                    }
                }
            }
        },
        methods: {
            customSubmit () {
                this.horse.numer = parseInt(this.horse.numer);
                if (this.func === "add") {
                    this.addHorse();
                } else {
                    this.updateHorse();
                }
                this.updateHorsePositions();
            },
            addHorse () {
                this.$store.dispatch("horse/createHorse", this.horse)
                    .then((response) => {
                        this.horse = this.createFreshHorseObject();
                        this.$router.push({ name: "horse-details", params: { id: response.id } });
                    });
            },
            updateHorse () {
                this.$store.dispatch("horse/updateHorse", this.horse)
                    .then((response) => {
                        this.horse = response;
                        this.$emit("updatedHorse", false, this.horse);
                    });
            },
            createFreshHorseObject () {
                return horseObject;
            },
            getCountries () {
                this.$store.dispatch("country/fetchCountries")
                    .then(() => {
                        this.countries = this.getCountriesForSelect();
                    });
            },
            getClasses () {
                this.$store.dispatch("classes/fetchClasses")
                    .then(() => {
                        this.classes = this.getClassesForSelect();
                    });
            },
            getHorses () {
                this.$store.dispatch("horse/fetchHorses")
                    .then((horses) => {
                        this.horses = horses;
                        this.horse.numer = this.currentPosition;
                    });
            },
            horsesToUpdateFun (data) {
                this.showModal = false;
                this.horse.numer = data.numer;
                this.horsesToUpdate = data.horsesToUpdate;
            },
            updateHorsePositions () {
                HorseService.updateHorses(this.horsesToUpdate)
                    .then((response) => {
                        console.log("Horses updated", response);
                    });
            },
            closeModal () {
                this.showModal = false;
            },
            openModal () {
                this.showModal = true;
            }
        },
        computed: {
            ...mapGetters({ getClassesForSelect: "classes/getClassesForSelect",
                            getCountriesForSelect: "country/getCountriesForSelect" }),
            classId () {
                return this.classes.map(class_ => class_.id);
            },
            classKat () {
                return this.classes.map(class_ => class_.kat + " " + class_.numer);
            },
            countryName () {
                return this.countries.map(country => country.name + " - " + country.code);
            },
            countryId () {
                return this.countries.map(country => country.code);
            },
            currentPosition () {
                return isNaN(this.horse.numer) || this.horse.numer === null ? this.horses.length + 1 : this.horse.numer;
            },
            horsePositions () {
                console.log("computed");
                let horseMapped = this.horses.map((h) => {
                    return {
                        id: h.id,
                        numer: h.numer
                    };
                });
                horseMapped.sort((h1, h2) => (h1.numer <= h2.numer) ? -1 : 1);
                return horseMapped;
            }
        },
        created () {
            this.getClasses();
            this.getCountries();
            this.getHorses();
            // this.horse.numer = this.currentPosition;
        }
    };
    const horseObject =
        {
            "numer": null,
            "klasa": "",
            "nazwa": "",
            "kraj": "",
            "rocznik": null,
            "masc": "",
            "plec": "",
            "hodowca": {
                "nazwa": "",
                "kraj": ""
            },
            "wlasciciel": {
                "nazwa": "",
                "kraj": ""
            },
            "rodowod": {
                "o": {
                    "nazwa": "",
                    "kraj": ""
                },
                "m": {
                    "nazwa": "",
                    "kraj": ""
                },
                "om": {
                    "nazwa": "",
                    "kraj": ""
                }
            },
            "wynik": {
                "noty": []
            }
        };
</script>

<style>
</style>
