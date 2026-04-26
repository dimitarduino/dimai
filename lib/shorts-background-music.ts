export interface ShortsBackgroundTrack {
  id: string;
  title: string;
  url: string | null;
  licenseNote: string | null;
}

export const SHORTS_BACKGROUND_TRACKS: readonly ShortsBackgroundTrack[] = [
  {
    id: 'none',
    title: 'No background music',
    url: null,
    licenseNote: null,
  },
  {
    id: 'pixabay-upbeat-electronic',
    title: 'Upbeat electronic',
    url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
    licenseNote: 'Pixabay License — free for commercial use (see pixabay.com/license).',
  },
  {
    id: 'incompetech-funkorama',
    title: 'Funk / groove — Funkorama (Kevin MacLeod)',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Funkorama.mp3',
    licenseNote: 'Kevin MacLeod (incompetech.com) — CC BY 4.0; credit the artist when posting publicly.',
  },
  {
    id: 'incompetech-volatile-reaction',
    title: 'High energy — Volatile Reaction (Kevin MacLeod)',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Volatile%20Reaction.mp3',
    licenseNote: 'Kevin MacLeod (incompetech.com) — CC BY 4.0; credit the artist when posting publicly.',
  },
  {
    id: 'incompetech-gaslamp',
    title: 'Playful — Gaslamp Funworks (Kevin MacLeod)',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Gaslamp%20Funworks.mp3',
    licenseNote: 'Kevin MacLeod (incompetech.com) — CC BY 4.0; credit the artist when posting publicly.',
  },
  {
    id: 'incompetech-local-forecast',
    title: 'Chill — Local Forecast (Kevin MacLeod)',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Local%20Forecast.mp3',
    licenseNote: 'Kevin MacLeod (incompetech.com) — CC BY 4.0; credit the artist when posting publicly.',
  },
  {
    id: 'incompetech-sneaky-snitch',
    title: 'Mischievous — Sneaky Snitch (Kevin MacLeod)',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Sneaky%20Snitch.mp3',
    licenseNote: 'Kevin MacLeod (incompetech.com) — CC BY 4.0; credit the artist when posting publicly.',
  },
  {
    id: 'incompetech-monkeys-spinning',
    title: 'Comedic — Monkeys Spinning Macaques (Kevin MacLeod)',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Monkeys%20Spinning%20Macaques.mp3',
    licenseNote: 'Kevin MacLeod (incompetech.com) — CC BY 4.0; credit the artist when posting publicly.',
  },
  {
    id: 'incompetech-fluffing-a-duck',
    title: 'Funny — Fluffing a Duck (Kevin MacLeod)',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Fluffing%20a%20Duck.mp3',
    licenseNote: 'Kevin MacLeod (incompetech.com) — CC BY 4.0; credit the artist when posting publicly.',
  },
  {
    id: 'incompetech-getting-it-done',
    title: 'Corporate / Hustle — Getting it Done (Kevin MacLeod)',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Getting%20it%20Done.mp3',
    licenseNote: 'Kevin MacLeod (incompetech.com) — CC BY 4.0; credit the artist when posting publicly.',
  },
  {
    id: 'incompetech-carefree',
    title: 'Happy / Upbeat — Carefree (Kevin MacLeod)',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Carefree.mp3',
    licenseNote: 'Kevin MacLeod (incompetech.com) — CC BY 4.0; credit the artist when posting publicly.',
  },
  {
    id: 'incompetech-life-of-riley',
    title: 'Happy / Bouncy — Life of Riley (Kevin MacLeod)',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Life%20of%20Riley.mp3',
    licenseNote: 'Kevin MacLeod (incompetech.com) — CC BY 4.0; credit the artist when posting publicly.',
  },
  {
    id: 'incompetech-sad-trio',
    title: 'Sad / Melancholic — Sad Trio (Kevin MacLeod)',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Sad%20Trio.mp3',
    licenseNote: 'Kevin MacLeod (incompetech.com) — CC BY 4.0; credit the artist when posting publicly.',
  },
  {
    id: 'incompetech-heartbreaking',
    title: 'Sad / Emotional — Heartbreaking (Kevin MacLeod)',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Heartbreaking.mp3',
    licenseNote: 'Kevin MacLeod (incompetech.com) — CC BY 4.0; credit the artist when posting publicly.',
  },
  {
    id: 'incompetech-the-dread',
    title: 'Suspense / Dark — The Dread (Kevin MacLeod)',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/The%20Dread.mp3',
    licenseNote: 'Kevin MacLeod (incompetech.com) — CC BY 4.0; credit the artist when posting publicly.',
  },
  {
    id: 'incompetech-clenched-teeth',
    title: 'Epic / Action — Clenched Teeth (Kevin MacLeod)',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Clenched%20Teeth.mp3',
    licenseNote: 'Kevin MacLeod (incompetech.com) — CC BY 4.0; credit the artist when posting publicly.',
  },
];

export type ResolvedShortsBackgroundMusic = Pick<
  ShortsBackgroundTrack,
  'url' | 'title' | 'licenseNote'
>;

export function resolveShortsBackgroundMusic(id: string): ResolvedShortsBackgroundMusic {
  const track = SHORTS_BACKGROUND_TRACKS.find((t) => t.id === id) || SHORTS_BACKGROUND_TRACKS[0];
  return {
    url: track.url,
    title: track.title,
    licenseNote: track.licenseNote,
  };
}
