
// app/composables/useCharacters.ts
import { ref } from 'vue';
import { useFetch } from '#app';

export interface Character {
  id: string;
  name: string;
  color: string;
}

export function useCharacters() {
  const { data: characters, pending, error, refresh } = useFetch<Character[]>('/api/characters', {
    default: () => [],
  });

  const addCharacter = async (character: Omit<Character, 'id'>) => {
    const { data: newCharacter } = await useFetch<Character>('/api/characters', {
      method: 'POST',
      body: character,
    });
    if (newCharacter.value) {
      await refresh();
    }
  };

  const deleteCharacter = async (id: string) => {
    const { error } = await useFetch(`/api/characters/${id}`, {
      method: 'DELETE',
    });
    if (error.value) {
      console.error('Error deleting character:', error.value);
    } else {
      await refresh();
    }
  };

  const updateCharacter = async (character: Character) => {
    const { error } = await useFetch(`/api/characters/${character.id}`, {
      method: 'PUT',
      body: character,
    });
    if (error.value) {
      console.error('Error updating character:', error.value);
    } else {
      await refresh();
    }
  };

  const getCharacter = (id: string) => {
    return characters.value?.find(c => c.id === id);
  };

  return {
    characters,
    addCharacter,
    deleteCharacter,
    updateCharacter,
    getCharacter,
    pending,
    error,
    refresh,
  };
}
