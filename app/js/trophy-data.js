// Loads app/data/trophies.json and turns it into the lookups the views share.
export const GRADE_ORDER = ['platinum', 'gold', 'silver', 'bronze'];
export const GRADE_POINTS = { platinum: 300, gold: 90, silver: 30, bronze: 15 };

export const KIND_LABELS = {
  story: 'Story',
  side: 'Side quest',
  collectible: 'Collectibles',
  activity: 'Activities',
  crime: 'Robbery & crime',
  feat: 'Feat',
};

export const CONFIDENCE_LABELS = {
  sourced: 'Cited guide',
  partial: 'Partly confirmed',
  official: 'Unsolved · description-based',
};

export async function loadTrophyData(url = 'data/trophies.json') {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load ${url} (${response.status})`);
  return normalizeTrophyData(await response.json());
}

export function normalizeTrophyData(raw) {
  const list = Array.isArray(raw) ? raw : raw.trophies;
  const sources = raw.sources ?? {};
  const trophies = list.map((t, index) => ({
    ...t,
    id: t.id ?? index + 1,
    kind: t.kind ?? 'feat',
    stage: t.stage ?? 3,
    chapter: t.chapter ?? 1,
    steps: t.steps ?? [],
    sources: (t.sources ?? []).map((ref) => resolveSource(ref, sources)).filter(Boolean),
    missable: t.missable ?? 'no',
  }));
  const stages = (raw.stages ?? []).map((s) => ({ ...s, sources: (s.sources ?? []).map((ref) => resolveSource(ref, sources)).filter(Boolean) }));
  return { trophies, stages, sources, meta: { game: raw.game, researched: raw.researched } };
}

function resolveSource(ref, registry) {
  if (typeof ref === 'object' && ref) return ref;
  const entry = registry[ref];
  return entry ? { id: ref, ...entry } : null;
}

export function sourceHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
