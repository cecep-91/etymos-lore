# Gemini Project Context: Xanthochroid Song Player

This document provides an overview of the Xanthochroid song player project, "Etymos", to give context for future development sessions.

## Project Overview

This is a Nuxt.js v4 application designed to be a comprehensive resource for the music and lore of the band Xanthochroid. It allows users to explore songs, read accompanying lore and lyrics, and provides functionality for adding and editing song information.

## Tech Stack

*   **Framework:** Nuxt.js 4
*   **UI Library:** Vue.js 3
*   **Language:** TypeScript
*   **Package Manager:** bun
*   **Styling:** Plain CSS with some scoped styles in Vue components.

## Project Structure

```
/
├── app/
│   ├── assets/
│   │   └── css/
│   │       └── main.css      # Global styles
│   ├── components/
│   │   └── common/
│   │       └── Header.vue    # Site-wide header
│   ├── composables/
│   │   └── useSongs.ts       # Core logic for song data management
│   ├── layouts/
│   │   └── default.vue       # Default layout for pages
│   └── pages/
│       ├── index.vue         # Landing page with lore synopsis
│       └── songs/
│           ├── [slug].vue    # Dynamic page for a single song's details
│           ├── index.vue     # Lists all songs
│           └── new.vue       # Form to add a new song
├── server/
│   ├── api/
│   │   └── songs/
│   │       ├── [id].put.ts   # API endpoint to update a song
│   │       ├── index.get.ts  # API endpoint to get all songs
│   │       └── index.post.ts # API endpoint to create a new song
│   └── data/
│       └── songs.json        # The "database" for songs
├── nuxt.config.ts            # Nuxt.js configuration
└── package.json              # Project dependencies and scripts
```

## Core Functionality

### Data Management (`app/composables/useSongs.ts`)

The `useSongs.ts` composable is central to the application.

*   **Interfaces:**
    *   `Song`: Defines the structure for a song object, including `id`, `slug`, `title`, `artist`, `youtubeId`, `albumCoverUrl`, and an array of `content`.
    *   `ContentLine`: Defines the structure for a line of lore or lyric, including `id`, `type` (`lore` or `lyric`), and `text`.
*   **Functions:**
    *   `useSongs()`: The main composable function that provides reactive access to the song data.
    *   `getSongBySlug(slug)`: Finds and returns a song by its slug.
    *   `addSong(song)`: Sends a POST request to `/api/songs` to create a new song.
    *   `updateSong(song)`: Sends a PUT request to `/api/songs/:id` to update an existing song.

### Pages

*   **`/` (`app/pages/index.vue`):** The main landing page that displays a synopsis of the Etymos lore.
*   **`/songs` (`app/pages/songs/index.vue`):** A page that lists all the songs in the chronology, each with a link to its detail page. It also includes a link to add a new song.
*   **`/songs/new` (`app/pages/songs/new.vue`):** A form for adding a new song to the collection. It captures metadata like title, artist, YouTube ID, and album art URL.
*   **`/songs/[slug]` (`app/pages/songs/[slug].vue`):** A dynamic page that will display the detailed content (lore and lyrics) for a specific song.

### API Endpoints

The server-side API is built using Nitro, Nuxt's server engine.

*   **`GET /api/songs`:** Fetches the entire list of songs from `server/data/songs.json`.
*   **`POST /api/songs`:** Adds a new song to the `songs.json` file.
*   **`PUT /api/songs/[id]`:** (File exists, implementation not shown) Updates an existing song in the `songs.json` file.

### Data Storage

*   **`server/data/songs.json`:** A simple JSON file is used as the database to store the array of song objects. This makes it easy to view and edit data directly during development.
