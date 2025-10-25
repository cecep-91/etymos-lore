import { defineEventHandler, readBody } from 'h3';
import fs from 'fs/promises';
import path from 'path';
import { Character } from '../../../app/composables/useCharacters';

const dataPath = path.resolve(process.cwd(), 'server/data/characters.json');

export default defineEventHandler(async (event) => {
  try {
    const characterId = event.context.params?.id;
    const body = await readBody<Character>(event);
    const data = await fs.readFile(dataPath, 'utf-8');
    let characters: Character[] = JSON.parse(data);

    const characterIndex = characters.findIndex(c => c.id === characterId);

    if (characterIndex === -1) {
      return { error: 'Character not found' };
    }

    characters[characterIndex] = { ...characters[characterIndex], ...body };

    await fs.writeFile(dataPath, JSON.stringify(characters, null, 2));
    return characters[characterIndex];
  } catch (error) {
    console.error('Error updating character:', error);
    return { error: 'Failed to update character' };
  }
});
