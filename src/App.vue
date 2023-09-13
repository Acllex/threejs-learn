<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/learn1">Demo1</RouterLink>
        <RouterLink to="/learn2">Demo2</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header{
  padding: 1rem;
}
.wrapper>nav{
  display: flex;
}
@media screen and (min-width: 768px) {
  header{
    padding: 2rem;
  }
  .wrapper>nav{
    display: flex;
    flex-direction: column;
  }
}
</style>