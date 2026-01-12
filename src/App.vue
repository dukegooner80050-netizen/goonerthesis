<script setup>
import HelloWorld from './components/HelloWorld.vue'
import Nav from './components/Nav.vue'
</script>

<template>
  
  <div class="container-fluid p-4" bg-light>
    <Nav/>
    <main class="container mt-4">
      <HelloWorld/>
    </main>
  </div>
  
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
