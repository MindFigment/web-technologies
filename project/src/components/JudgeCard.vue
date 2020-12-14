<template>
    <router-link :to="{ name: 'judge-details', params: { id: judge.id } }">
        <div class="judge-card">
            <h3> {{ judge.sedzia }}  </h3>
            <div class="row">
                <p> <b>Kraj pochodzenia:</b> {{ judge.kraj }} </p>
            </div>
        </div>
    </router-link>
</template>

<script>
    export default {
        props: {
            judge: {
                type: Object,
                required: true
            }
        }
    };
</script>

<style scoped>
  .judge-card {
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
  .judge-card:hover {
    transform: scale(1.01);
    box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.19);
  }
  .judge-card > .title {
    margin: 0;
  }
  .judge-link {
    color: black;
    text-decoration: none;
    font-weight: 100;
  }
</style>
