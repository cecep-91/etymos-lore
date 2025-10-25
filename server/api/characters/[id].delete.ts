import { defineEventHandler } from 'h3';
import fs from 'fs/promises';
import path from 'path';
import { Character } from '../../../app/composables/useCharacters';

const dataPath = path.resolve(process.cwd(), 'server/data/characters.json');

export default defineEventHandler(async (event) => {
  try {
    const characterId = event.context.params?.id;
    const data = await fs.readFile(dataPath, 'utf-8');
    let characters: Character[] = JSON.parse(data);

    const characterIndex = characters.findIndex(c => c.id === characterId);

    if (characterIndex === -1) {
      return { error: 'Character not found' };
    }

    characters.splice(characterIndex, 1);

    await fs.writeFile(dataPath, JSON.stringify(characters, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error deleting character:', error);
    return { error: 'Failed to delete character' };
  }
});
