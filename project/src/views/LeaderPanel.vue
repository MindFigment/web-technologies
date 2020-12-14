<template>
    <div>
        <h2> Panel Prowadzącego </h2>
        <SideBar/>
        <div class="info">
            <p> Za pomocą tego panelu możliwe jest zarządzanie pokazem.</p>
            <p> Dostępne opercje:</p>
            <ul>
                <li> Edycja </li>
                <li> Dodawanie </li>
                <li> Usuwanie </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import SideBar from "@/components/SideBar.vue";

    export default {
        components: {
            SideBar
        }
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
.info {
    text-align: left;
    margin-left: 220px;
}
</style>
