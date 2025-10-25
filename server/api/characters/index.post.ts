import { defineEventHandler, readBody } from 'h3';
import fs from 'fs/promises';
import path from 'path';

// Basic character interface, will be moved to a composable
interface Character {
  id: string;
  name: string;
  color: string;
}

const dataPath = path.resolve(process.cwd(), 'server/data/characters.json');

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<Omit<Character, 'id'>>(event);
    const data = await fs.readFile(dataPath, 'utf-8');
    const characters: Character[] = JSON.parse(data);

    // Basic validation
    if (!body.name || !body.color) {
      return { error: 'Missing required fields' };
    }

    const newCharacter: Character = {
      ...body,
      id: String(characters.length + 1), // Simple ID generation
    };

    characters.push(newCharacter);
    await fs.writeFile(dataPath, JSON.stringify(characters, null, 2));
    return newCharacter;
  } catch (error) {
    console.error('Error adding character:', error);
    return { error: 'Failed to add character' };
  }
});
