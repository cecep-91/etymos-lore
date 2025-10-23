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

      <div class="player-area">
        <button @click="navigateToPrevSong" :disabled="!prevSong" class="nav-btn prev-btn">&lt;&lt;</button>
        <div class="custom-player">
          <!-- Hidden YouTube Player -->
          <div style="position: absolute; top: -9999px; left: -9999px;">
            <YouTube
              :src="`https://www.youtube.com/watch?v=${song.youtubeId}`"
              @ready="onPlayerReady"
              ref="youtube"
              :vars="{ controls: 0 }"
            />
          </div>

          <div class="player-main">
            <!-- Album Art -->
            <img :src="song.albumCoverUrl" alt="Album Cover" class="album-art" @click="togglePlay" />
          </div>

          <!-- Player Controls -->
          <div class="player-controls">
            <!-- Time Slider -->
            <input
              type="range"
              :value="currentTime"
              :max="duration"
              @input="seek"
              class="time-slider"
            />
            <div class="time-display">
              <span>{{ formatTime(currentTime) }}</span> / <span>{{ formatTime(duration) }}</span>
            </div>

            <!-- Control Buttons -->
            <div class="control-buttons">
              <button @click="seekBackward" class="seek-btn">-5s</button>
              <button @click="togglePlay" class="play-pause-btn">{{ isPlaying ? 'Pause' : 'Play' }}</button>
              <button @click="seekForward" class="seek-btn">+5s</button>
            </div>
          </div>

          <div class="volume-container" ref="volumeContainer">
            <button @click="toggleVolumeSlider" class="volume-btn">🔉</button>
            <div v-if="showVolumeSlider" class="volume-slider-wrapper">
              <input
                type="range"
                min="0"
                max="100"
                :value="volume"
                @input="setVolume"
                class="volume-slider"
                orient="vertical"
              />
            </div>
          </div>
        </div>
        <button @click="navigateToNextSong" :disabled="!nextSong" class="nav-btn next-btn">&gt;&gt;</button>
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
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import YouTube from 'vue3-youtube';
import type { Song, ContentLine } from '~/composables/useSongs';

const route = useRoute();
const router = useRouter();
const { songs, getSongBySlug, updateSong } = useSongs();

const song = ref<Song | undefined>();
const editingSong = ref<Song | null>(null);
const isEditMode = ref(false);

// --- Data & Navigation ---
const slug = computed(() => route.params.slug as string);

const loadSongData = () => {
  const currentSong = getSongBySlug(slug.value);
  if (currentSong) {
    song.value = currentSong;
    editingSong.value = JSON.parse(JSON.stringify(currentSong));
  }
  else {
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
    if (editingSong.value) {
      updateSong(editingSong.value);
      song.value = JSON.parse(JSON.stringify(editingSong.value));
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
const isPlaying = ref(false);
const duration = ref(0);
const volume = ref(50);
const showVolumeSlider = ref(false);
const volumeContainer = ref<HTMLElement | null>(null);

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const togglePlay = () => {
  if (youtube.value) {
    const player = youtube.value.player;
    if (isPlaying.value) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
    isPlaying.value = !isPlaying.value;
  }
};

const seek = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const time = Number(target.value);
  if (youtube.value) {
    youtube.value.player.seekTo(time, true);
    currentTime.value = time;
  }
};

const seekForward = () => {
  if (youtube.value) {
    const newTime = Math.min(currentTime.value + 5, duration.value);
    youtube.value.player.seekTo(newTime, true);
    currentTime.value = newTime;
  }
};

const seekBackward = () => {
  if (youtube.value) {
    const newTime = Math.max(currentTime.value - 5, 0);
    youtube.value.player.seekTo(newTime, true);
    currentTime.value = newTime;
  }
};

const setVolume = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const newVolume = Number(target.value);
  if (youtube.value) {
    youtube.value.player.setVolume(newVolume);
    volume.value = newVolume;
  }
};

const toggleVolumeSlider = () => {
  showVolumeSlider.value = !showVolumeSlider.value;
};

const handleClickOutside = (event: MouseEvent) => {
  if (volumeContainer.value && !volumeContainer.value.contains(event.target as Node)) {
    showVolumeSlider.value = false;
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.shiftKey && event.key === 'N') {
    event.preventDefault();
    navigateToNextSong();
  }
  if (event.shiftKey && event.key === 'P') {
    event.preventDefault();
    navigateToPrevSong();
  }
};

const onPlayerReady = async () => {
  if (youtube.value) {
    duration.value = await youtube.value.getDuration();
    youtube.value.player.setVolume(volume.value);
  }
  timeInterval = setInterval(async () => {
    if (youtube.value) {
      currentTime.value = await youtube.value.getCurrentTime();
      const playerState = await youtube.value.getPlayerState();
      isPlaying.value = playerState === 1;
    }
  }, 500);
};

watch(showVolumeSlider, (newValue) => {
  if (newValue) {
    nextTick(() => {
      document.addEventListener('click', handleClickOutside);
    });
  } else {
    document.removeEventListener('click', handleClickOutside);
  }
});

watch([currentTime, duration], () => {
  if (duration.value > 0) {
    const percentage = (currentTime.value / duration.value) * 100;
    const slider = document.querySelector('.time-slider') as HTMLInputElement;
    if (slider) {
      slider.style.background = `linear-gradient(to right, #b38d3e ${percentage}%, #555 ${percentage}%)`;
    }
  }
});

watch(currentTime, (newTime) => {
  if (!song.value) return;
  const activeLine = song.value.content.find(line =>
    line.type === 'lyric' && newTime >= (line.startTime ?? 0) && newTime <= (line.endTime ?? 0)
  );
  activeLyricId.value = activeLine ? activeLine.id : null;
});

// --- Styling & Lifecycle ---
const pageStyle = computed(() => ({ backgroundImage: `url(${song.value?.albumCoverUrl})` }));

onMounted(() => {
  loadSongData();
  document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  clearInterval(timeInterval);
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleKeyDown);
});

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

.player-area {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

/* Custom Player */
.custom-player {
  flex-grow: 1;
  position: sticky;
  top: 2rem;
  z-index: 10;
  border-radius: 12px;
  overflow: visible; /* Allow volume slider to show */
  box-shadow: 0 8px 30px rgba(0,0,0,0.5);
  background-color: rgba(20, 20, 20, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  position: relative;
}

.player-main {
  position: relative;
  width: 100%;
  max-width: 300px;
  margin-bottom: 1.5rem;
}

.album-art {
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  cursor: pointer;
}

.nav-btn {
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-btn:hover:not(:disabled) {
  background: #b38d3e;
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.player-controls {
  width: 100%;
  max-width: 400px;
}

.time-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 5px;
  background: #555;
  outline: none;
  -webkit-transition: .2s;
  transition: opacity .2s;
  cursor: pointer;
}

.time-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  background: #b38d3e;
  cursor: pointer;
  border-radius: 50%;
}

.time-slider::-moz-range-thumb {
  width: 15px;
  height: 15px;
  background: #b38d3e;
  cursor: pointer;
  border-radius: 50%;
}

.time-display {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #ccc;
  margin-top: 0.5rem;
}

.control-buttons {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.control-buttons button {
  background: transparent;
  border: 2px solid #b38d3e;
  color: #b38d3e;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.control-buttons button:hover {
  background: #b38d3e;
  color: white;
}

.play-pause-btn {
  grid-column: 2;
  justify-self: center;
  width: 60px;
  height: 60px;
}

.seek-btn {
  justify-self: center;
}

.seek-btn:first-child {
  justify-self: end;
}

.seek-btn:last-child {
  justify-self: start;
}

.volume-container {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
}

.volume-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

.volume-slider-wrapper {
  position: absolute;
  bottom: calc(100% + 1rem);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem 0.5rem;
  border-radius: 8px;
  display: flex;
  justify-content: center;
}

.volume-slider {
  -webkit-appearance: slider-vertical;
  writing-mode: bt-lr; /* For Firefox */
  width: 8px;
  height: 120px;
  background: #555;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #b38d3e;
  cursor: pointer;
  border-radius: 50%;
}

.volume-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #b38d3e;
  cursor: pointer;
  border-radius: 50%;
}

/* Content Section */
.content-section { background: rgba(0,0,0,0.4); padding: 1rem 2rem; border-radius: 8px; line-height: 1.8; overflow-y: auto; flex-shrink: 1; min-height: 0; }
.content-line { margin: 1rem 0; }
.lyric-line { padding: 0.8rem; border-radius: 5px; transition: background-color 0.3s; position: relative; }
.lyric-line.active { background-color: rgba(255, 255, 0, 0.2); }
.lyric-line.active .lyric-text { font-weight: bold; }
.character-name { position: absolute; top: 50%; right: 1rem; transform: translateY(-50%); background: #b38d3e; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; opacity: 0; transition: opacity 0.3s; pointer-events: none; }
.lyric-line:hover .character-name { opacity: 1; }

/* Edit Mode Styles */
.song-metadata-editor { margin-bottom: 2rem; display: flex; flex-direction: column; gap: 0.75rem; }
.meta-input { width: 100%; padding: 0.75rem; background: #333; color: #e0e0e0; border: 1px solid #555; border-radius: 4px; font-size: 1rem; }
.meta-input.title-input { font-size: 2rem; font-weight: bold; text-align: center; }
.meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

.edit-line-wrapper { display: flex; align-items: center; gap: 10px; }
.edit-line-wrapper > div { flex-grow: 1; }
.edit-lore textarea { width: 100%; background: #333; color: #e0e0e0; border: 1px solid #555; border-radius: 4px; padding: 8px; font-family: inherit; font-size: 1rem; }
.edit-lyric { display: grid; grid-template-columns: 3fr 1fr 1fr 1fr; gap: 10px; }
.edit-lyric input { width: 100%; background: #333; color: #e0e0e0; border: 1px solid #555; border-radius: 4px; padding: 8px; }
.delete-line-btn { background: #c0392b; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; font-weight: bold; }
.add-controls { margin-top: 1.5rem; display: flex; gap: 1rem; justify-content: center; border-top: 1px solid #444; padding-top: 1.5rem; }
.add-controls button { padding: 0.6rem 1.2rem; background-color: #b38d3e; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; }
</style>