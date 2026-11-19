// Kind chips, grade/earned selects and the search box decide which trophies are listed.
export const KIND_FILTERS = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'story', label: 'Story', test: (t) => t.kind === 'story' },
  { id: 'missable', label: 'Missable', test: (t) => t.missable !== 'no' },
  { id: 'collectible', label: 'Collectibles', test: (t) => t.kind === 'collectible' },
  { id: 'activity', label: 'Activities', test: (t) => t.kind === 'activity' },
  { id: 'side', label: 'Side quests', test: (t) => t.kind === 'side' },
  { id: 'crime', label: 'Robbery & crime', test: (t) => t.kind === 'crime' },
  { id: 'feat', label: 'Feats', test: (t) => t.kind === 'feat' },
  { id: 'online', label: 'Online', test: (t) => t.kind === 'online' },
];

export function kindFilter(id) {
  return KIND_FILTERS.find((f) => f.id === id) ?? KIND_FILTERS[0];
}

export function countByKind(trophies) {
  return Object.fromEntries(KIND_FILTERS.map((f) => [f.id, trophies.filter(f.test).length]));
}

export function filterTrophies(trophies, { kind, grade, earned, query }, isEarned, isShielded) {
  const needle = (query ?? '').trim().toLowerCase();
  const test = kindFilter(kind).test;
  return trophies.filter((t) => {
    if (!test(t)) return false;
    if (grade !== 'all' && t.grade !== grade) return false;
    if (earned === 'todo' && isEarned(t.name)) return false;
    if (earned === 'done' && !isEarned(t.name)) return false;
    if (!needle) return true;
    return searchableText(t, isShielded(t)).includes(needle);
  });
}

function searchableText(t, shielded) {
  const visible = shielded ? [t.kind, t.grade] : [t.name, t.description, t.guide, t.unlock, ...t.steps];
  return visible.join(' ').toLowerCase();
}
