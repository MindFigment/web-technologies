<template>
    <div class="wrapper">
        <SideBar/>
        <div class="content direction" v-show="ready == 2">
            <div>
                <h1> {{ sedzia.sedzia }} </h1>
                <div v-if="!isUpdate">
                    <div class="card-content">
                        <p> <b>Kraj pochodzenia:</b> {{ country }} </p>
                        <br>
                    </div>

                    <div class="actions">
                        <div class="row hm">
                            <BaseButton @click="showModal=true"> Zaktualizuj </BaseButton>
                        </div>
                        <div class="row hm">
                            <BaseButton :disabled="!canDelete" v-on:click="deleteJudge(sedzia.id)"> Delete </BaseButton>
                            <div v-if="!canDelete">
                                <h5> Nie można usunąć sędziego dopóki sędziuje choćby jedną klasę </h5>
                            </div>
                            <div v-else>
                                <h5> Usuń sędziego bezpowrotnie </h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="isUpdate">
                    <AddJudge :func="update" :update_judge="sedzia" @updatedJudge="setIsUpdate"/>
                </div>
                <div v-if="showModal">
                    <BaseModal @close="showModal = false">
                        <template v-slot:header>
                            <h1> Zaktualizuj klasę </h1>
                        </template>
                        <template v-slot:body>
                            <AddJudge :func="update" :update_judge="sedzia" @updatedJudge="setIsUpdate"/>
                        </template>
                    </BaseModal>
                    {{ this.$store.state.classes.class }}
                </div>
            </div>
            <div v-if="!isUpdate">
                <h2>
                    Oceniane klasy
                    <span class="badge -fill-gradient">{{ judgedClasses ? judgedClasses.length : 0 }}</span>
                </h2>
                <ul class="list-group">
                    <li v-for="class_ in judgedClasses" :key="class_.id" class="list-item">
                        <router-link :to="{ name: 'class-details', params: { id: class_.id } }">
                            <p class="hover"> <b>Nazwa kategorii:</b> nr.{{ class_.numer }} {{ class_.kat }} </p>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import AddJudge from "@/components/AddJudge.vue";
    import { mapGetters } from "vuex";
    import SideBar from "@/components/SideBar.vue";

    export default {
        components: {
            AddJudge,
            SideBar
        },
        props: {
            judge: {
                type: Object,
                required: true
            }
        },
        data () {
            return {
                update: "update",
                isUpdate: false,
                judgedClasses: [],
                country: "",
                showModal: false,
                sedzia: this.judge,
                ready: 0
            };
        },
        methods: {
            deleteJudge (id) {
                this.$store.dispatch("judge/deleteJudge", id)
                    .then(() => {
                        this.$router.push({
                            name: "judges"
                        });
                    });
            },
            setIsUpdate (is, judge) {
                this.showModal = is;
                console.log("judge", judge);
                this.sedzia = judge;
                this.country = this.getCountryByCode(judge.kraj);
            }
        },
        computed: {
            ...mapGetters({ getCountryByCode: "country/getCountryByCode" }),
            canDelete: function () {
                return this.judgedClasses.length === 0;
            }
        },
        created () {
            this.$store.dispatch("classes/fetchJudgeClasses", this.sedzia.id)
                .then(() => {
                    this.judgedClasses = this.$store.state.classes.judgedClasses;
                    this.ready += 1;
                });
            this.$store.dispatch("country/fetchCountries")
                .then(() => {
                    this.country = this.getCountryByCode(this.sedzia.kraj);
                    this.ready += 1;
                });
        }
    };
</script>
<style lang="less" scoped>
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
.hover {
    &:hover {
        color: #8f6e64;
    }
}
.card-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
.actions {
    border: solid;
    border-color: #8f6e64;
    padding: 10px;
}
.hm {
    align-items: center;
    justify-content: flex-start;
}
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
</style>
