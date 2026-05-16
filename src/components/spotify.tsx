import { MusicNote01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { SongData } from "@/lib/spotify";
import { cn } from "@/lib/utils";

interface SpotifyProps {
  song: SongData | null;
}

export function Spotify({ song }: SpotifyProps) {
  if (!song) {
    return null;
  }

  return (
    <a
      className="group mb-2 flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
      href={song.songUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      <HugeiconsIcon
        className={cn(
          song.isPlaying ? "text-emerald-500" : "text-muted-foreground"
        )}
        icon={MusicNote01Icon}
        size={16}
      />
      <div className="flex items-center gap-1">
        <span className="font-medium text-foreground/90 group-hover:text-foreground">
          {song.title}
        </span>
        <span className="text-muted-foreground">by</span>
        <span className="group-hover:text-foreground">{song.artist}</span>
      </div>
    </a>
  );
}
