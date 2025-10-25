import { defineEventHandler } from 'h3';
import fs from 'fs/promises';
import path from 'path';

const dataPath = path.resolve(process.cwd(), 'server/data/characters.json');

export default defineEventHandler(async (event) => {
  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    const characters = JSON.parse(data);
    return characters;
  } catch (error) {
    console.error('Error reading characters data:', error);
    return { error: 'Failed to load characters' };
  }
});
