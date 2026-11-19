// The spoiler shield: masks story (or all hidden) trophies until they are earned or revealed once.
const revealedThisSession = new Set();

export const SPOILER_MODES = {
  off: 'Off',
  story: 'Hide story trophies',
  hidden: 'Hide all 28 hidden',
};

export function createSpoilerShield(getMode, isEarned) {
  function isShielded(t) {
    if (isEarned(t.name) || revealedThisSession.has(t.name)) return false;
    const mode = getMode();
    if (mode === 'story') return t.kind === 'story' && t.hidden;
    if (mode === 'hidden') return Boolean(t.hidden);
    return false;
  }
  return {
    isShielded,
    reveal(name) { revealedThisSession.add(name); },
    title: (t) => (isShielded(t) ? `${t.kind === 'story' ? 'Chapter ' + t.chapter + ' story' : 'Hidden'} trophy · ${t.grade}` : t.name),
    shortTitle: (t) => (isShielded(t) ? `Hidden story trophy` : t.name),
    description: (t) => (isShielded(t) ? 'Spoiler shield on: name and description stay hidden until you earn it (or reveal it).' : t.description),
  };
}
