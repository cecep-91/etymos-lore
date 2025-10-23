<template>
  <div v-if="song" class="song-page-container" :style="pageStyle">
    <div class="content-wrapper">
      <div class="header-controls">
        <NuxtLink to="/songs" class="back-link">Back to List</NuxtLink>
        <button @click="toggleEditMode" class="edit-button">{{ isEditMode ? 'Save Changes' : 'Edit Song' }}</button>
      </div>

      <!-- EDIT MODE: Song Metadata -->
      <div v-if="isEditMode && editingSong" class="song-metadata-editor">
        <input v-model="editingSong.title" placeholder="Song Title" class="meta-input title-input" />
        <div class="meta-grid">
          <input v-model="editingSong.artist" placeholder="Artist" class="meta-input" />
          <input v-model="editingSong.youtubeId" placeholder="YouTube ID" class="meta-input" />
        </div>
        <input v-model="editingSong.albumCoverUrl" placeholder="Album Cover URL" class="meta-input" />
      </div>
      <!-- VIEW MODE: Song Title -->
      <h1 v-else class="song-title">{{ song.title }}</h1>


      <div class="player-container">
        <YouTube
          :src="`https://www.youtube.com/watch?v=${song.youtubeId}`"
          @ready="onPlayerReady"
          ref="youtube"
          width="100%"
        />
      </div>

      <div class="navigation-controls">
        <button @click="navigateToPrevSong" :disabled="!prevSong">Previous</button>
        <button @click="navigateToNextSong" :disabled="!nextSong">Next</button>
      </div>

      <div class="content-section">
        <div v-if="editingSong" v-for="(line, index) in editingSong.content" :key="line.id" class="content-line">
          <!-- VIEW MODE -->
          <template v-if="!isEditMode">
            <p v-if="line.type === 'lore'" v-html="line.text"></p>
            <div v-if="line.type === 'lyric'" class="lyric-line" :class="{ active: activeLyricId === line.id }">
              <span class="lyric-text">{{ line.text }}</span>
              <span v-if="line.character" class="character-name">{{ line.character }}</span>
            </div>
          </template>

          <!-- EDIT MODE -->
          <template v-else>
            <div class="edit-line-wrapper">
              <div v-if="line.type === 'lore'" class="edit-lore">
                <textarea v-model="line.text" rows="3"></textarea>
              </div>
              <div v-if="line.type === 'lyric'" class="edit-lyric">
                <input v-model="line.text" placeholder="Lyric Text" class="lyric-text-input"/>
                <input v-model="line.character" placeholder="Character" />
                <input v-model.number="line.startTime" type="number" placeholder="Start" />
                <input v-model.number="line.endTime" type="number" placeholder="End" />
              </div>
              <button @click="deleteLine(index)" class="delete-line-btn">X</button>
            </div>
          </template>
        </div>

        <div v-if="isEditMode" class="add-controls">
          <button @click="addLoreLine">+ Add Lore</button>
          <button @click="addLyricLine">+ Add Lyric</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import YouTube from 'vue3-youtube';
import type { Song, ContentLine } from '~/composables/useSongs';

const route = useRoute();
const router = useRouter();
const { songs, getSongBySlug, updateSong } = useSongs();

const song = ref<Song | undefined>();
const editingSong = ref<Song | null>(null); // Will hold the deep copy for editing
const isEditMode = ref(false);

// --- Data & Navigation ---
const slug = computed(() => route.params.slug as string);

const loadSongData = () => {
  const currentSong = getSongBySlug(slug.value);
  if (currentSong) {
    song.value = currentSong;
    // Create a deep copy for editing to avoid reactivity issues and saving on every keystroke
    editingSong.value = JSON.parse(JSON.stringify(currentSong));
  } else {
    router.push('/404');
  }
};

const currentIndex = computed(() => songs.value.findIndex(s => s.slug === slug.value));
const prevSong = computed(() => currentIndex.value > 0 ? songs.value[currentIndex.value - 1] : null);
const nextSong = computed(() => currentIndex.value < songs.value.length - 1 ? songs.value[currentIndex.value + 1] : null);

const navigateToPrevSong = () => prevSong.value && router.push(`/songs/${prevSong.value.slug}`);
const navigateToNextSong = () => nextSong.value && router.push(`/songs/${nextSong.value.slug}`);

// --- Edit Mode Logic ---
const toggleEditMode = () => {
  if (isEditMode.value) {
    // Save changes
    if (editingSong.value) {
      updateSong(editingSong.value);
      song.value = JSON.parse(JSON.stringify(editingSong.value)); // Update the local view with the saved data
    }
  }
  isEditMode.value = !isEditMode.value;
};

const addLoreLine = () => {
  editingSong.value?.content.push({ id: Date.now(), type: 'lore', text: 'New lore text.' });
};

const addLyricLine = () => {
  editingSong.value?.content.push({ id: Date.now(), type: 'lyric', text: 'New lyric line.', character: '', startTime: 0, endTime: 0 });
};

const deleteLine = (index: number) => {
  editingSong.value?.content.splice(index, 1);
};

// --- Player & Lyric Sync ---
const youtube = ref<any>(null);
const currentTime = ref(0);
const activeLyricId = ref<number | null>(null);
let timeInterval: any = null;

const onPlayerReady = () => {
  timeInterval = setInterval(async () => {
    if (youtube.value) {
      currentTime.value = await youtube.value.getCurrentTime();
    }
  }, 500);
};

watch(currentTime, (newTime) => {
  if (!song.value) return;
  const activeLine = song.value.content.find(line =>
    line.type === 'lyric' && newTime >= (line.startTime ?? 0) && newTime <= (line.endTime ?? 0)
  );
  activeLyricId.value = activeLine ? activeLine.id : null;
});

// --- Styling & Lifecycle ---
const pageStyle = computed(() => ({ backgroundImage: `url(${song.value?.albumCoverUrl})` }));

onMounted(loadSongData);
onUnmounted(() => clearInterval(timeInterval));

// When the route changes (e.g., next/prev song), reload the data
watch(slug, loadSongData);

</script>

<style scoped>
/* General Styles */
.song-page-container { min-height: 100vh; background-size: cover; background-position: center; background-attachment: fixed; position: relative; }
.song-page-container::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.6); backdrop-filter: blur(8px); }
.content-wrapper { position: relative; z-index: 1; max-width: 900px; margin: 0 auto; padding: 2rem; color: #e0e0e0; display: flex; flex-direction: column; height: calc(100vh - 4rem); }
.song-title { text-align: center; font-size: 2.8rem; margin-bottom: 1.5rem; font-weight: bold; }

/* Header Controls */
.header-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.back-link, .edit-button { padding: 0.6rem 1.2rem; background-color: #b38d3e; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; transition: background-color 0.3s; border: none; cursor: pointer; }
.back-link:hover, .edit-button:hover { background-color: #9c7b36; }

/* Player & Navigation */
.player-container {
  position: sticky;
  top: 2rem;
  z-index: 10;
  margin-bottom: 1.5rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0,0,0,0.5);
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.navigation-controls { display: flex; justify-content: space-around; align-items: center; margin-bottom: 2rem; }
.navigation-controls button { width: 120px; padding: 0.6rem; background-color: rgba(179, 141, 62, 0.6); color: white; border: 1px solid #b38d3e; border-radius: 5px; font-weight: bold; cursor: pointer; transition: background-color 0.3s; }
.navigation-controls button:hover:not(:disabled) { background-color: #9c7b36; }
.navigation-controls button:disabled { background-color: #555; cursor: not-allowed; opacity: 0.5; }

/* Content Section */
.content-section { background: rgba(0,0,0,0.4); padding: 1rem 2rem; border-radius: 8px; line-height: 1.8; overflow-y: auto; flex-shrink: 1; min-height: 0; }
.content-line { margin: 1rem 0; }
.lyric-line { padding: 0.8rem; border-radius: 5px; transition: background-color 0.3s; position: relative; }
.lyric-line.active { background-color: rgba(255, 255, 0, 0.2); }
.lyric-line.active .lyric-text { font-weight: bold; }
.character-name { position: absolute; top: 50%; right: 1rem; transform: translateY(-50%); background: #b38d3e; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; opacity: 0; transition: opacity 0.3s; pointer-events: none; }
.lyric-line:hover .character-name { opacity: 1; }

/* Edit Mode Styles */
.song-metadata-editor {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.meta-input {
  width: 100%;
  padding: 0.75rem;
  background: #333;
  color: #e0e0e0;
  border: 1px solid #555;
  border-radius: 4px;
  font-size: 1rem;
}
.meta-input.title-input {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
}
.meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.edit-line-wrapper { display: flex; align-items: center; gap: 10px; }
.edit-line-wrapper > div { flex-grow: 1; }
.edit-lore textarea { width: 100%; background: #333; color: #e0e0e0; border: 1px solid #555; border-radius: 4px; padding: 8px; font-family: inherit; font-size: 1rem; }
.edit-lyric { display: grid; grid-template-columns: 3fr 1fr 1fr 1fr; gap: 10px; }
.edit-lyric input { width: 100%; background: #333; color: #e0e0e0; border: 1px solid #555; border-radius: 4px; padding: 8px; }
.delete-line-btn { background: #c0392b; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; font-weight: bold; }
.add-controls { margin-top: 1.5rem; display: flex; gap: 1rem; justify-content: center; border-top: 1px solid #444; padding-top: 1.5rem; }
.add-controls button { padding: 0.6rem 1.2rem; background-color: #b38d3e; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; }
</style>