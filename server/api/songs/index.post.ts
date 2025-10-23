import { defineEventHandler, readBody } from 'h3';
import fs from 'fs/promises';
import path from 'path';
import { Song } from '../../../app/composables/useSongs';

const dataPath = path.resolve(process.cwd(), 'server/data/songs.json');

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<Song>(event);
    const data = await fs.readFile(dataPath, 'utf-8');
    const songs: Song[] = JSON.parse(data);

    // Basic validation
    if (!body.title || !body.artist) {
      return { error: 'Missing required fields' };
    }

    const newSong: Song = {
      ...body,
      id: String(songs.length + 1), // Simple ID generation
      slug: body.title.toLowerCase().replace(/\s+/g, '-'), // Simple slug generation
    };

    songs.push(newSong);
    await fs.writeFile(dataPath, JSON.stringify(songs, null, 2));
    return newSong;
  } catch (error) {
    console.error('Error adding song:', error);
    return { error: 'Failed to add song' };
  }
});
