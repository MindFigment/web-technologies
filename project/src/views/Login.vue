<template>
    <div class="login">
        <form @submit.prevent="login">
            <label for="username">
                Nazwa użytkownika:
            </label>
            <BaseInput v-model="username" type="text">
                Username
            </BaseInput>
            <label for="password">
                Hasło:
            </label>
            <BaseInput v-model="password" type="password">
                Hasło
            </BaseInput>
            <p v-if="status === 401">
                Niepoprawne dane
            </p>
            <BaseButton type="submit" name="button">
                Login
            </BaseButton>
        </form>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                username: "",
                password: "",
                status: null
            };
        },
        methods: {
            login () {
                this.$store
                    .dispatch("login/login", {
                        username: this.username,
                        password: this.password
                    })
                    .then(() => { this.$router.push({ name: "leader-panel" }); })
                    .catch(err => { this.status = err.response.status; });
            }
        }
    };
</script>

<style lang="less" scoped>
.login {
    margin-top: 30px;
}
</style>
