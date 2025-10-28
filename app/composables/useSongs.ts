
// app/composables/useSongs.ts
import { ref, watch } from 'vue';
import { useFetch } from '#app';

export interface ContentLine {
  id: string;
  type: 'lore' | 'lyric' | 'break';
  text?: string;
  character?: string;
  startTime?: number;
  endTime?: number;
  size?: number;
}

export interface Song {
  id: string;
  slug: string;
  title: string;
  artist: string;
  youtubeId: string;
  albumCoverUrl: string;
  content: ContentLine[];
}

export const loreSynopsis = `
  <p>The world of Etymos is a realm of magic, conflict, and ancient secrets. The story follows the intertwined destinies of kings, queens, and mystical beings through a saga of power, betrayal, and sacrifice.</p>
  <p>This website chronicles the epic tale of Xanthochroid, presented through their music. Each song is a chapter, weaving together lyrics and lore to immerse you in the narrative. Begin with the first song or explore the chronology as you wish.</p>
`;

export function useSongs() {
  const { data: songs, pending, error, refresh } = useFetch<Song[]>('/api/songs', {
    default: () => [],
  });

  const getSongBySlug = (slug: string) => {
    return songs.value?.find(song => song.slug === slug);
  };

  const addSong = async (song: Omit<Song, 'id' | 'slug'>) => {
    const { data: newSong } = await useFetch<Song>('/api/songs', {
      method: 'POST',
      body: song,
    });
    if (newSong.value) {
      await refresh();
    }
  };

  const updateSong = async (updatedSong: Song) => {
    const { data: newSong } = await useFetch<Song>(`/api/songs/${updatedSong.id}`, {
      method: 'PUT',
      body: updatedSong,
    });
    if (newSong.value) {
      await refresh();
    }
  };

  return {
    songs,
    loreSynopsis,
    getSongBySlug,
    addSong,
    updateSong,
    pending,
    error,
    refresh,
  };
}
