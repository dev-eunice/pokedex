export interface TcgTypeTheme {
  border: string
  background: string
  header: string
  frame: string
  text: string
  accent: string
}

export const TCG_TYPE_THEMES: Record<string, TcgTypeTheme> = {
  normal: {
    border: '#c9b26a',
    background: 'linear-gradient(180deg, #f5e6b8 0%, #e8d595 100%)',
    header: '#f0db9a',
    frame: '#d4c48a',
    text: '#1a1a1a',
    accent: '#8b7d4a',
  },
  fire: {
    border: '#e07b4a',
    background: 'linear-gradient(180deg, #ffd4b8 0%, #ffb88a 100%)',
    header: '#ffc9a3',
    frame: '#e89a6a',
    text: '#1a1a1a',
    accent: '#c45c2a',
  },
  water: {
    border: '#4a90d9',
    background: 'linear-gradient(180deg, #b8dcff 0%, #8ec5ff 100%)',
    header: '#a8d4ff',
    frame: '#6aa8e8',
    text: '#1a1a1a',
    accent: '#2a6cb8',
  },
  grass: {
    border: '#6cb84a',
    background: 'linear-gradient(180deg, #c8f0a8 0%, #9de078 100%)',
    header: '#b8e898',
    frame: '#78c858',
    text: '#1a1a1a',
    accent: '#3a8828',
  },
  electric: {
    border: '#d4b020',
    background: 'linear-gradient(180deg, #fff4a8 0%, #ffe566 100%)',
    header: '#ffef88',
    frame: '#e8c830',
    text: '#1a1a1a',
    accent: '#b89000',
  },
  ice: {
    border: '#6ac8d8',
    background: 'linear-gradient(180deg, #c8f4ff 0%, #98e8ff 100%)',
    header: '#b0ecff',
    frame: '#68c0d8',
    text: '#1a1a1a',
    accent: '#2898b0',
  },
  fighting: {
    border: '#c85830',
    background: 'linear-gradient(180deg, #ffc8a8 0%, #f0a078 100%)',
    header: '#ffb898',
    frame: '#d87848',
    text: '#1a1a1a',
    accent: '#983818',
  },
  poison: {
    border: '#9858c8',
    background: 'linear-gradient(180deg, #e8c8ff 0%, #d098ff 100%)',
    header: '#dcb0ff',
    frame: '#a868d8',
    text: '#1a1a1a',
    accent: '#683898',
  },
  ground: {
    border: '#b89050',
    background: 'linear-gradient(180deg, #f0d8a8 0%, #e0c078 100%)',
    header: '#e8cc90',
    frame: '#c8a060',
    text: '#1a1a1a',
    accent: '#886830',
  },
  flying: {
    border: '#8898e8',
    background: 'linear-gradient(180deg, #d8e0ff 0%, #b8c8ff 100%)',
    header: '#c8d4ff',
    frame: '#98a8e0',
    text: '#1a1a1a',
    accent: '#5868b0',
  },
  psychic: {
    border: '#d86898',
    background: 'linear-gradient(180deg, #ffc8e0 0%, #ff98c8 100%)',
    header: '#ffb0d0',
    frame: '#e878a8',
    text: '#1a1a1a',
    accent: '#a83868',
  },
  bug: {
    border: '#98b830',
    background: 'linear-gradient(180deg, #e0f0a0 0%, #c8e070 100%)',
    header: '#d4e890',
    frame: '#a8c848',
    text: '#1a1a1a',
    accent: '#688018',
  },
  rock: {
    border: '#a89058',
    background: 'linear-gradient(180deg, #e8dcc0 0%, #d0c098 100%)',
    header: '#ddd0a8',
    frame: '#b8a070',
    text: '#1a1a1a',
    accent: '#786840',
  },
  ghost: {
    border: '#6858a0',
    background: 'linear-gradient(180deg, #c8b8f0 0%, #a898e0 100%)',
    header: '#b8a8e8',
    frame: '#8878c0',
    text: '#1a1a1a',
    accent: '#483878',
  },
  dragon: {
    border: '#5858c0',
    background: 'linear-gradient(180deg, #b8b8ff 0%, #9090f0 100%)',
    header: '#a8a8ff',
    frame: '#7070d8',
    text: '#1a1a1a',
    accent: '#383898',
  },
  dark: {
    border: '#585858',
    background: 'linear-gradient(180deg, #c8c8c8 0%, #a8a8a8 100%)',
    header: '#b8b8b8',
    frame: '#888888',
    text: '#1a1a1a',
    accent: '#404040',
  },
  steel: {
    border: '#9098a8',
    background: 'linear-gradient(180deg, #e0e4ec 0%, #c0c8d8 100%)',
    header: '#d0d8e4',
    frame: '#a0a8b8',
    text: '#1a1a1a',
    accent: '#606878',
  },
  fairy: {
    border: '#e898c0',
    background: 'linear-gradient(180deg, #ffe0f0 0%, #ffc0e0 100%)',
    header: '#ffd0e8',
    frame: '#f0a0c8',
    text: '#1a1a1a',
    accent: '#c06090',
  },
}

export function getTcgTheme(type: string): TcgTypeTheme {
  return TCG_TYPE_THEMES[type] ?? TCG_TYPE_THEMES.normal
}
