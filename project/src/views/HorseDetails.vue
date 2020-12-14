<template>
    <div class="wrapper">
        <SideBar/>
        <div class="row content">
            <BaseButton buttonClass="button" v-on:click="isUpdate=false"> Details </BaseButton>
            <BaseButton buttonClass="button" v-on:click="isUpdate=true"> Update </BaseButton>
        </div>
        <div class="content direction">
            <div>
                <h1> Koń: {{ kon.nazwa }} </h1>
                <div v-if="!isUpdate">
                    <div class="card-content">
                        <p> <b>Klasa:</b> {{ classLabel }} </p>
                        <p> <b>Numer startowy:</b> {{ kon.numer }}</p>
                        <p> <b>Kraj:</b> {{ kon.kraj }} </p>
                        <p> <b>Rocznik:</b> {{ kon.rocznik }} </p>
                        <p> <b>Płeć:</b> {{ kon.plec }} </p>
                        <p> <b>Hodowca:</b> {{ kon.hodowca.nazwa }} ({{ kon.hodowca.kraj }}) </p>
                        <p> <b>Właściciel:</b> {{ kon.wlasciciel.nazwa }} ({{ kon.wlasciciel.kraj }}) </p>
                        <p> <b>Rodowód ojciec:</b> {{ kon.rodowod.o.nazwa }} ({{ kon.rodowod.o.kraj }}) </p>
                        <p> <b>Rodowód matka:</b> {{ kon.rodowod.m.nazwa }} ({{ kon.rodowod.m.kraj }}) </p>
                        <p> <b>Rodowód ojciec matki:</b> {{ kon.rodowod.om.nazwa }} ({{ kon.rodowod.om.kraj }}) </p>
                    </div>
                </div>
                <div v-if="isUpdate">
                    <AddHorse :func="update" :horseToUpdate="kon" @updatedHorse="setIsUpdate"/>
                </div>
            </div>
            <div v-if="!isUpdate" class="center">
                <HorseTable :horse="kon">
                    <h2>
                        Noty
                        <span class="badge -fill-gradient">{{ kon.wynik.noty.length }}</span>
                    </h2>
                </HorseTable>
            </div>
        </div>
        <div v-if="!isUpdate" class="column hm content">
            <BaseButton  :disabled="!canDelete" buttonClass="-fill-gradient-red" v-on:click="deleteHorse(kon.id)"> Delete </BaseButton>
            <div v-if="!canDelete">
                <h5> Nie można usunąć sędziego dopóki sędziuje choćby jedną klasę </h5>
            </div>
            <div v-else>
                <h5> Usuń sędziego bezpowrotnie </h5>
            </div>
        </div>
    </div>
</template>
<script>
    import AddHorse from "@/components/AddHorse.vue";
    import { mapGetters } from "vuex";
    import SideBar from "@/components/SideBar.vue";
    import HorseTable from "@/components/HorseTable.vue";

    export default {
        components: {
            AddHorse,
            SideBar,
            HorseTable
        },
        props: {
            horse: {
                type: Object,
                required: true
            }
        },
        data () {
            return {
                update: "update",
                isUpdate: false,
                class_: undefined,
                kon: this.horse
            };
        },
        methods: {
            deleteHorse (id) {
                this.$store.dispatch("horse/deleteHorse", id)
                    .then(() => {
                        this.$router.push({
                            name: "horses"
                        });
                    });
            },
            setIsUpdate (is, horse) {
                this.isUpdate = is;
                this.kon = horse;
                this.getHorseClass();
            },
            getHorseClass () {
                this.$store.dispatch("classes/fetchClasses")
                    .then(() => {
                        this.class_ = this.getClassById(this.kon.klasa);
                    });
            }
        },
        computed: {
            ...mapGetters({ getClassById: "classes/getClassById" }),
            classLabel () {
                return this.class_ ? this.class_.numer + ". " + this.class_.kat + (this.class_.hasOwnProperty("czempionat") ? "- czempionat nr." + this.class_.czempionat : "") : "a";
            },
            canDelete: function () {
                return this.kon.wynik.noty.length === 0;
            }
        },
        created () {
            this.getHorseClass();
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
  .center {
    margin: auto;
  }
}
.card-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
.hm {
    align-items: center;
    justify-content: flex-start;
}
.center {
    display: flex;
    justify-content: center;
}
</style>
