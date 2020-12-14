<template>
    <router-link :to="{ name: 'class-details', params: { id: class_.id } }">
        <div class="class-card">
            <h3> {{ class_.kat }} </h3>
            <div class="row">
                <p> <b>Numer:</b> {{ class_.numer }} </p> &nbsp;&nbsp;&nbsp;&nbsp;
                <p> <b>Rozmiar komisji:</b> {{ class_.komisja.length }} </p>
            </div>
        </div>
    </router-link>
</template>

<script>
    export default {
        props: {
            class_: {
                type: Object,
                required: true
            }
        }
    };
</script>

<style lang="less" scoped>
.class-card {
    padding: 20px;
    margin-top: 24px;
    margin-bottom: 24px;
    transition: all 0.2s linear;
    cursor: pointer;
    border: solid;
    border-color: antiquewhite;
    background-color: antiquewhite;
}
h3 {
    margin-top: auto;
}
.class-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.19);
}
// .class-card > .title {
//   margin: 0;
// }
// .class-link {
//   color: black;
//   text-decoration: none;
//   font-weight: 100;
// }
</style>
