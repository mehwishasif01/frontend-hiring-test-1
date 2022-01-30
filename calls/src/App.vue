<template>
  <div id="app">
    <div id="nav">
      <navigation />
    </div>
    <div id="content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    document.title = "Home | Call App";
  },
};
</script>


<style lang="scss">
@import "../node_modules/ag-grid-community/dist/styles/ag-grid.css";
@import "../node_modules/ag-grid-community/dist/styles/ag-theme-alpine.css";
@import url('https://fonts.googleapis.com/css?family=Material+Icons');
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#content {
  background: #f5f5f5;
  padding-top: 31px;
}
</style>
