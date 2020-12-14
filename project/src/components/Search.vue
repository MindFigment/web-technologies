<template>
    <div class="autocomplete">
        <BaseInput type="text" v-model="searchString" @input="onChange">
        </BaseInput>
        <ul v-show="isOpen" class="autocomplete-results">
            <li class="autocomplete-result"
                v-for="result in results"
                :key="result.id"
                @click="routeTo(result.id)"
            >
                {{ display(result) }}
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            data: {
                type: Array,
                required: false,
                default: () => []
            },
            searchFields: {
                type: Array,
                required: true
            }
        },
        data () {
            return {
                searchString: "",
                results: [],
                isOpen: false
            };
        },
        methods: {
            filterResults () {
                this.results = this.data.filter(item => {
                    let field;
                    for (let i = 0; i < this.searchFields.length; i++) {
                        field = this.searchFields[i];
                        if (item[field].toLowerCase().includes(this.searchString.toLowerCase().trim())) {
                            return true;
                        }
                    }
                    return false;
                });
            },
            onChange () {
                this.isOpen = !((this.results === [] || this.searchString === ""));
                this.filterResults();
            },
            display (item) {
                let description = "";
                this.searchFields.forEach((field) => {
                    description += item[field] + " ";
                });
                return description;
            },
            routeTo (horseId) {
                this.$router.push({ name: "horse-details", params: { id: horseId } });
            }
        }
    };
</script>

<style>
.autocomplete {
    margin: auto;
    max-width: 400px;
  }

  .autocomplete-results {
    padding: 0;
    margin: 0;
    border: 1px solid #eeeeee;
    max-height: 120px;
    overflow: auto;
  }

  .autocomplete-result {
    list-style: none;
    text-align: left;
    padding: 4px 2px;
    cursor: pointer;
  }

  .autocomplete-result:hover {
    background-color: rgb(212, 177, 60);
    color: white;
  }
</style>
