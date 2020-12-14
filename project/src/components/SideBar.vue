<template>
    <div>
        <!-- <h2> Panel Prowadzącego </h2> -->
        <div class="sidebar">
            <h4> Menu </h4>
            <router-link class="link" :to="{ name: 'judges' }">Lista sędziów </router-link>
            <router-link class="link" :to="{ name: 'horses', params: { page: 1 } }"> Lista Koni </router-link>
            <router-link class="link" :to="{ name: 'classes' }"> Lista Klas </router-link>
        </div>
        <router-view/>
    </div>
</template>

<script>
    export default {

    };
</script>

<style>
.sidebar {
    display: flex;
    flex-direction: column;
    width: 200px;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: auto;
    margin-top: 80px;
    /* padding: 0 20px 20px 40px; */
    background: rgba(0, 0, 0, 0.081);
}
.link:hover {
    color: #8f6e64;
}

</style>
