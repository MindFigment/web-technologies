<template>
    <div>
        <form @submit.prevent="customSubmit">
            <BaseInput
                label="Numer"
                v-model.number="class_.numer"
                type="number"
                placeholder="Numer"
                class="field"
            />
            <BaseInput
                label="Kategoria"
                v-model="class_.kat"
                type="text"
                placeholder="Kategoria"
                class="field"
            />

            <template v-if="errors.kat.length">
                <p v-for="error in errors.kat" :key="error" class="errorMessage">
                    {{ error }}
                </p>
            </template>

            <div>
                <label> Komisja </label>
                <multiselect v-model="komisja" :options="judge.judges" :multiple="true" :close-on-select="false"
                             :clear-on-select="false" placeholder="Komisja" label="sedzia"
                             track-by="id" :preselect-first="false" :searchable="false">
                </multiselect>
            </div>

            <template v-if="errors.komisja.length">
                <p v-for="error in errors.komisja" :key="error" class="errorMessage">
                    {{ error }}
                </p>
            </template>

            <br>
            <BaseButton type="submit" :disabled="!(errors.kat.length === 0 || errors.komisja.length === 0 || class_.kat === '' && komisja == [])">
                Submit
            </BaseButton>
        </form>
    </div>
</template>

<script>
    import Multiselect from "vue-multiselect";
    import { mapState } from "vuex";
    import { isProperName } from "@/helpers/validators.js";

    export default {
        components: {
            Multiselect
        },
        props: {
            func: {
                type: String,
                required: true
            },
            update_class: {
                type: Object,
                default: function () {
                    return {
                        numer: null,
                        kat: "",
                        komisja: []
                    };
                }
            },
            commision: {
                type: Array,
                default: () => []
            }
        },
        watch: {
            "class_.kat": function (val) {
                this.errors.kat = [];
                if (val === "") {
                    this.errors.kat.push("Kategoria jest wymagana");
                } else {
                    if (!isProperName(val)) {
                        this.errors.kat.push("Niepoprawna nazwa kategorii");
                    }
                }
            },
            "komisja": function (val) {
                this.errors.komisja = [];
                console.log("val", val.length);
                if (val.length === 0) {
                    this.errors.komisja.push("Komisja jest wymagana");
                }
            }
        },
        data () {
            return {
                class_: Object.assign({}, this.update_class),
                komisja: this.commision.slice(),
                errors: {
                    kat: [],
                    komisja: []
                }
            };
        },
        methods: {
            customSubmit () {
                if (this.func === "add") {
                    this.addClass();
                } else {
                    this.updateClass();
                }
            },
            addClass () {
                this.class_.komisja = this.komisja ? this.komisja.map(judge => judge.id) : [];
                this.class_.numer = parseInt(this.class_.numer);
                this.$store.dispatch("classes/createClass", this.class_)
                    .then((response) => {
                        this.class_ = this.createFreshClassObject();
                        this.$router.push({ name: "class-details", params: { id: response.id } });
                    });
            },
            updateClass () {
                this.class_.komisja = this.komisja.map(judge => judge.id);
                this.$store.dispatch("classes/updateClass", this.class_)
                    .then((response) => {
                        this.class_ = response;
                        this.$emit("updatedClass", this.class_, this.komisja);
                    });
            },
            createFreshClassObject () {
                return {
                    numer: null,
                    kat: "",
                    komisja: []
                };
            }
        },
        computed: {
            ...mapState(["judge"])
        },
        created () {
            this.$store.dispatch("judge/fetchJudges");
        }
    };
</script>

<style>

</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
