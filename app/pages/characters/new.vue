<template>
  <div class="new-character-container">
    <div class="form-wrapper">
      <h1 class="title">Add a New Character</h1>
      <form @submit.prevent="createNewCharacter" class="new-character-form">
        <label>Character Name</label>
        <input v-model="newCharacter.name" placeholder="The character's name" required />

        <label>Highlight Color</label>
        <input v-model="newCharacter.color" type="color" required />

        <div class="form-actions">
          <NuxtLink to="/characters" class="cancel-btn">Cancel</NuxtLink>
          <button type="submit" class="submit-btn">
            <span>Create Character</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCharacters } from '~/composables/useCharacters';

const router = useRouter();
const { addCharacter } = useCharacters();

const newCharacter = ref({
  name: '',
  color: '#ff0000',
});

const createNewCharacter = () => {
  if (!newCharacter.value.name) {
    alert('Name is required.');
    return;
  }

  addCharacter(newCharacter.value);

  router.push('/characters');
};
</script>

<style scoped>
.new-character-container {
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

.new-character-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.new-character-form label {
  font-weight: bold;
  font-size: 0.9rem;
  color: #aaa;
  margin-bottom: -0.5rem;
}

.new-character-form input {
  padding: 0.8rem;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 5px;
  color: #e0e0e0;
  font-size: 1rem;
}

.new-character-form input[type="color"] {
  padding: 0.2rem;
  height: 50px;
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
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
