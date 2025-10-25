<template>
  <div class="characters-list-container">
    <div class="list-header">
      <h1 class="title">Characters</h1>
      <NuxtLink to="/characters/new" class="add-character-button">+ Add New Character</NuxtLink>
    </div>
    <ul class="character-list">
      <li v-for="character in characters" :key="character.id" class="character-item">
        <div class="character-info">
          <span class="character-name">{{ character.name }}</span>
          <div class="character-actions">
            <div class="character-color" :style="{ backgroundColor: character.color }"></div>
            <NuxtLink :to="`/characters/${character.id}/edit`" class="edit-btn">Edit</NuxtLink>
            <button @click="confirmDelete(character.id)" class="delete-btn">Delete</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useCharacters } from '~/composables/useCharacters';

const { characters, deleteCharacter } = useCharacters();

const confirmDelete = (id: string) => {
  if (window.confirm('Are you sure you want to delete this character?')) {
    deleteCharacter(id);
  }
};
</script>

<style scoped>
.characters-list-container {
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

.add-character-button {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #b38d3e;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.add-character-button:hover {
  background-color: #9c7b36;
}

.character-list {
  list-style: none;
  padding: 0;
}

.character-item {
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #2a2a2a;
  border-radius: 8px;
}

.character-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.character-name {
  font-size: 1.2rem;
  font-weight: bold;
}

.character-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.character-color {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.delete-btn {
  background-color: #c93c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.delete-btn:hover {
  background-color: #a52e2e;
}

.edit-btn {
  background-color: #3c8ac9;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  text-decoration: none;
}

.edit-btn:hover {
  background-color: #2e6aa5;
}
</style>
