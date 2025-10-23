<template>
  <div class="songs-list-container">
    <div class="list-header">
      <h1 class="title">Chronology of Songs</h1>
      <NuxtLink to="/songs/new" class="add-song-button">+ Add New Song</NuxtLink>
    </div>
    <ul class="song-list">
      <li v-for="song in songs" :key="song.id" class="song-item">
        <NuxtLink :to="`/songs/${song.slug}`" class="song-link">
          <img :src="song.albumCoverUrl" alt="Album cover" class="album-cover">
          <div class="song-info">
            <span class="song-title">{{ song.title }}</span>
            <span class="song-artist">{{ song.artist }}</span>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const { songs } = useSongs();
</script>

<style scoped>
.songs-list-container {
  padding: 2rem;
  color: #e0e0e0;
  max-width: 1000px;
  margin: 0 auto;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 2.5rem;
}

.add-song-button {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #b38d3e;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.add-song-button:hover {
  background-color: #9c7b36;
}

.song-list {
  list-style: none;
  padding: 0;
}

.song-item {
  margin-bottom: 1rem;
}

.song-link {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #2a2a2a;
  border-radius: 8px;
  text-decoration: none;
  color: #e0e0e0;
  transition: background-color 0.3s, transform 0.2s;
}

.song-link:hover {
  background-color: #3a3a3a;
  transform: translateY(-3px);
}

.album-cover {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  margin-right: 1.5rem;
  object-fit: cover;
}

.song-info {
  display: flex;
  flex-direction: column;
}

.song-title {
  font-size: 1.2rem;
  font-weight: bold;
}

.song-artist {
  font-size: 0.9rem;
  color: #b0b0b0;
}
</style>