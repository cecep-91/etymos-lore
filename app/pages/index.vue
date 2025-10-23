<template>
  <div class="home-container">
    <h1 class="title">The Saga of Etymos</h1>
    <div class="synopsis" v-html="loreSynopsis"></div>
    <NuxtLink to="/songs" class="songs-link">Explore the Songs</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const { loreSynopsis } = useSongs();
</script>

<style scoped>
.home-container {
  padding: 2rem;
  text-align: center;
  color: #e0e0e0;
}

.title {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

.synopsis {
  max-width: 800px;
  margin: 0 auto 2rem;
  line-height: 1.8;
  font-size: 1.1rem;
}

.songs-link {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #b38d3e;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.songs-link:hover {
  background-color: #9c7b36;
}
</style>
