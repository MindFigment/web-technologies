
<template>
    <div>
        <label v-if="label">{{ label }}</label>
        <select :value="value" @change="updateValue" v-bind="$attrs" v-on="$listeners">
            <option value="" disabled selected> <label> Wybierz opcję  </label> </option>
            <option
                v-for="option in options"
                :value="normalizeKey(option)"
                :key="normalizeKey(option)"
                :selected="normalizeKey(option) === value"
            >{{ normalizeOption(option) }}</option>
        </select>
    </div>
</template>
<script>
    export default {
        inheritAttrs: false,
        props: {
            label: {
                type: String,
                default: ""
            },
            value: [String, Number],
            options: {
                type: Array,
                required: true
            }
        },
        methods: {
            updateValue (event) {
                console.log(event.target.value);
                this.$emit("input", event.target.value);
            },
            normalizeOption (option) {
                if (typeof option === "object") {
                    if (option.hasOwnProperty("label")) {
                        return option["label"];
                    }
                } else {
                    return option;
                }
            },
            normalizeKey (option) {
                if (typeof option === "object") {
                    if (option.hasOwnProperty("id")) {
                        return option["id"];
                    }
                    if (option.hasOwnProperty("code")) {
                        return option["code"];
                    }
                } else {
                    return option;
                }
            }
        }
    };
</script>
