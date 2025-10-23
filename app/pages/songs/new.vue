<template>
  <div class="new-song-container">
    <div class="form-wrapper">
      <h1 class="title">Add a New Song</h1>
      <form @submit.prevent="createNewSong" class="new-song-form">
        <label>Title</label>
        <input v-model="newSong.title" placeholder="The title of the song" required />

        <label>Artist</label>
        <input v-model="newSong.artist" placeholder="The artist's name" required />

        <label>Song Slug</label>
        <input v-model="newSong.slug" placeholder="a-url-friendly-slug" @input="sanitizeSlug" required />
        <p class="slug-preview">Page will be at: /songs/{{ newSong.slug }}</p>

        <label>YouTube ID</label>
        <input v-model="newSong.youtubeId" placeholder="The 11-character ID from the YouTube URL" required />

        <label>Album Cover URL</label>
        <input v-model="newSong.albumCoverUrl" placeholder="https://..." type="url" required />

        <div class="form-actions">
          <NuxtLink to="/songs" class="cancel-btn">Cancel</NuxtLink>
          <button type="submit" class="submit-btn">Create Song & Edit Content</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Song } from '~/composables/useSongs';

const router = useRouter();
const { addSong } = useSongs();

const newSong = ref({
  id: '',
  title: '',
  artist: 'Xanthochroid', // Default artist
  slug: '',
  youtubeId: '',
  albumCoverUrl: '',
  content: [],
});

const sanitizeSlug = () => {
  newSong.value.slug = newSong.value.slug
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^a-z0-9-]/g, ''); // Remove invalid chars
};

const createNewSong = () => {
  // Basic validation
  if (!newSong.value.title || !newSong.value.slug) {
    alert('Title and slug are required.');
    return;
  }

  const songToAdd: Song = {
    ...newSong.value,
    id: Date.now().toString(), // Simple unique ID
    content: [], // Start with empty content
  };

  addSong(songToAdd);

  // Redirect to the new song's page to add content
  router.push(`/songs/${songToAdd.slug}`);
};
</script>

<style scoped>
.new-song-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #121212;
}

.form-wrapper {
  width: 100%;
  max-width: 700px;
  padding: 2.5rem;
  background: #1e1e1e;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.5);
  color: #e0e0e0;
}

.title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-weight: bold;
}

.new-song-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.new-song-form label {
  font-weight: bold;
  font-size: 0.9rem;
  color: #aaa;
  margin-bottom: -0.5rem;
}

.new-song-form input {
  padding: 0.8rem;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 5px;
  color: #e0e0e0;
  font-size: 1rem;
}

.slug-preview {
  font-size: 0.8rem;
  color: #888;
  margin-top: -0.5rem;
  text-align: center;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  border-top: 1px solid #333;
  padding-top: 1.5rem;
}

.cancel-btn, .submit-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.cancel-btn {
  background-color: transparent;
  color: #aaa;
  border: 1px solid #555;
}

.submit-btn {
  background-color: #b38d3e;
  color: white;
}
</style>
