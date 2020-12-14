<template>
    <div class="wrapper">
        <SideBar/>
        <div class="content direction" v-show="ready == 2">
            <div>
                <h1> Klasa:  nr.{{ klasa.numer }} {{ klasa.kat }} </h1>
                <div v-if="!isUpdate">
                    <h2>Sędziowie
                        <span class="badge -fill-gradient">{{ komisja ? komisja.length : 0 }}</span>
                    </h2>
                    <ul class="list-group">
                        <li v-for="judge in komisja" :key="judge.id" class="list-item">
                            <router-link :to="{ name: 'judge-details', params: { id: judge.id } }">
                                <p> <b>Sędzia:</b> {{ judge.sedzia }}, kraj pochodzenia: {{ judge.kraj }} </p>
                            </router-link>
                        </li>
                    </ul>
                    <div class="actions">
                        <div class="row hm">
                            <BaseButton @click="showModal=true" :disabled="!canUpdate"> Zaktualizuj </BaseButton>
                            <div v-if="!canUpdate">
                                <h5> Nie można akutalizować zakończonych klas </h5>
                            </div>
                            <div v-else>
                                <h5> Zaktualizuj klasę </h5>
                            </div>
                        </div>
                        <div class="row hm">
                            <BaseButton buttonClass="-fill-gradient-red" :disabled="!canDelete" @click="deleteClass(klasa.id)"> Usuń </BaseButton>
                            <div v-if="!canDelete">
                                <h5> Aby usunąć klasę nie może ona mieć sędziów ani koni </h5>
                            </div>
                            <div v-else>
                                <h5> Usuń konia bezpowrotnie </h5>
                            </div>
                        </div>
                        <div class="row hm">
                            <BaseButton :disabled="!canRate" @click="rateHorses"> Oceń </BaseButton>
                            <div v-if="!canRate">
                                <h5> Klasa została już oceniona </h5>
                            </div>
                            <div v-else>
                                <h5> Oceń konie znajdujące się w tej klasie </h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="isUpdate">
                    <AddClass :func="update" :update_class="klasa" @updatedClass="isUpdate = false" :commision="komisja"/>
                </div>
                <div v-if="showModal">
                    <BaseModal @close="showModal = false">
                        <template v-slot:header>
                            <h1> Zaktualizuj klasę </h1>
                        </template>
                        <template v-slot:body>
                            <AddClass :func="update" :update_class="klasa" @updatedClass="updateClass" :commision="komisja"/>
                        </template>
                    </BaseModal>
                    {{ this.$store.state.classes.class }}
                </div>
            </div>
            <div v-if="!isUpdate">
                <h2>
                    Konie
                    <span class="badge -fill-gradient">{{ horses ? horses.length : 0 }}</span>
                </h2>
                <ul class="list-group">
                    <li v-for="(horse, index) in horses" :key="index" class="list-item">
                        <router-link :to="{ name: 'horse-details', params: { id: horse.id } }">
                            <p class="link"> <b>Koń:</b> {{ horse.nazwa }}, numer startowy: {{ horse.numer }} </p>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import AddClass from "@/components/AddClass.vue";
    import { mapState, mapGetters } from "vuex";
    import SideBar from "@/components/SideBar.vue";

    export default {
        components: {
            AddClass,
            SideBar
        },
        props: {
            class_: {
                type: Object,
                required: true
            }
        },
        data () {
            return {
                update: "update",
                isUpdate: false,
                horses: [],
                komisja: [],
                showModal: false,
                klasa: this.class_,
                ready: 0
            };
        },
        methods: {
            deleteClass (id) {
                this.$store.dispatch("classes/deleteClass", id)
                    .then(() => {
                        this.$router.push({
                            name: "classes"
                        });
                    });
            },
            rateHorses () {
                this.$router.push({ name: "rate-horses", params: { id: this.klasa.id, judgesNum: this.klasa.komisja.length } });
            },
            handleMove (elem) {
            },
            updateHorsePositions () {
                this.horses.forEach((horse, index) => {
                    horse.numer = index + 1;
                    this.$store.dispatch("horse/updateHorse", horse);
                });
                this.active = 1;
            },
            updateClass (klasa, komisja) {
                this.showModal = false;
                this.klasa = klasa;
                this.komisja = komisja;
            }
        },
        computed: {
            ...mapState(["classes", "judge"]),
            ...mapGetters({
                getJudgesFromIds: "judge/getJudgesFromIds"
            }),
            canDelete: function () {
                return this.horses.length === 0;
            },
            canRate: function () {
                return !(this.klasa.zakonczona === true);
            },
            canUpdate: function () {
                return !(this.klasa.zakonczona === true);
            }
        },
        created () {
            this.$store.dispatch("classes/fetchHorsesInClass", this.klasa.id)
                .then(() => {
                    this.horses = this.$store.state.classes.horsesInClass;
                    this.horses.sort((h1, h2) => {
                        return (h1.numer <= h2.numer) ? -1 : 1;
                    });
                    this.ready += 1;
                });
            this.$store.dispatch("judge/fetchJudges")
                .then(() => {
                    this.komisja = this.getJudgesFromIds(this.klasa.komisja);
                    this.ready += 1;
                });
        }
    };
</script>
<style lang="less" scoped>
.direction {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}
/* Small screens */
@media all and (max-width: 900px) {
  .direction {
    /* On small screens, we are no longer using row direction but column */
    flex-direction: column;
  }
}
.hm {
    align-items: center;
    justify-content: flex-start;
}
.card-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
.list-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 0;
    padding: 0;
    list-style: none;
}
.list-group > .list-item {
  padding: 1em 0;
  border-bottom: solid 1px #e5e5e5;
}
</style>
