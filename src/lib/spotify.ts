import { desc, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { spotify } from "@/lib/db/schema";
import { getEnv } from "@/lib/env";

const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

export interface SongData {
  album: string;
  artist: string;
  isPlaying: boolean;
  songUrl: string;
  title: string;
}

interface SpotifyTokenResponse {
  access_token: string;
}

interface SpotifyArtist {
  name: string;
}

interface SpotifyAlbum {
  artists: SpotifyArtist[];
  name: string;
}

interface SpotifyTrack {
  album: SpotifyAlbum;
  external_urls: { spotify: string };
  name: string;
}

interface SpotifyCurrentlyPlayingResponse {
  currently_playing_type?: string;
  is_playing?: boolean;
  item?: SpotifyTrack;
}

function formEncode(params: Record<string, string>) {
  return Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
}

async function getAccessToken(): Promise<SpotifyTokenResponse> {
  const env = getEnv();
  const basic = btoa(
    `${env.SPOTIFY_API_CLIENT_ID}:${env.SPOTIFY_API_CLIENT_SECRET}`
  );

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formEncode({
      grant_type: "refresh_token",
      refresh_token: env.SPOTIFY_API_REFRESH_TOKEN,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh Spotify access token");
  }

  return response.json();
}

async function getNowPlaying(): Promise<SpotifyCurrentlyPlayingResponse | null> {
  const { access_token } = await getAccessToken();

  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (response.status === 204 || response.status > 400) {
    return null;
  }

  return response.json();
}

async function getLatestSongFromDb() {
  const [latestSong] = await getDb()
    .select()
    .from(spotify)
    .orderBy(desc(spotify.lastPlayedAt))
    .limit(1);

  return latestSong;
}

function toFallback(
  latest: Awaited<ReturnType<typeof getLatestSongFromDb>>
): SongData | null {
  if (!latest) {
    return null;
  }

  return {
    title: latest.title,
    artist: latest.artist,
    album: latest.album,
    songUrl: latest.songUrl,
    isPlaying: false,
  };
}

export async function getCurrentOrLastSong(): Promise<SongData | null> {
  try {
    const nowPlaying = await getNowPlaying();

    if (
      nowPlaying &&
      nowPlaying.currently_playing_type === "track" &&
      nowPlaying.item &&
      nowPlaying.is_playing
    ) {
      const { item } = nowPlaying;
      const artist = item.album.artists
        .map((albumArtist) => albumArtist.name)
        .join(", ");

      const songData = {
        title: item.name,
        album: item.album.name,
        artist,
        songUrl: item.external_urls.spotify,
      };

      await getDb()
        .insert(spotify)
        .values(songData)
        .onConflictDoUpdate({
          target: spotify.songUrl,
          set: {
            playCount: sql`${spotify.playCount} + 1`,
            lastPlayedAt: sql`(CURRENT_TIMESTAMP)`,
          },
        });

      return { ...songData, isPlaying: true };
    }

    return toFallback(await getLatestSongFromDb());
  } catch {
    return toFallback(await getLatestSongFromDb());
  }
}
