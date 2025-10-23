import { defineEventHandler, readBody } from 'h3';
import fs from 'fs/promises';
import path from 'path';
import { Song } from '../../../app/composables/useSongs';

const dataPath = path.resolve(process.cwd(), 'server/data/songs.json');

export default defineEventHandler(async (event) => {
  try {
    const songId = event.context.params?.id;
    const body = await readBody<Song>(event);
    const data = await fs.readFile(dataPath, 'utf-8');
    let songs: Song[] = JSON.parse(data);

    const songIndex = songs.findIndex(song => song.id === songId);

    if (songIndex === -1) {
      return { error: 'Song not found' };
    }

    songs[songIndex] = { ...songs[songIndex], ...body };

    await fs.writeFile(dataPath, JSON.stringify(songs, null, 2));
    return songs[songIndex];
  } catch (error) {
    console.error('Error updating song:', error);
    return { error: 'Failed to update song' };
  }
});
