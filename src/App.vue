<template>
  <div id="app">
    <!--<img alt="Vue logo" src="./assets/logo.png">-->
    <Desktop />
  </div>
</template>

<script>
import Desktop from './components/Desktop.vue'

export default {
  name: 'app',
  components: {
      Desktop
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}

  body {
    margin: 0px;
  }

</style>
