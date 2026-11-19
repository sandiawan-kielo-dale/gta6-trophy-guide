// Export the checklist to a .json file and read one back (also accepts a bare array of names).
const FORMAT = 'leonida-ledger-progress';

export function exportProgress(earnedNames, trophyCount) {
  const payload = {
    format: FORMAT,
    version: 1,
    exportedAt: new Date().toISOString(),
    earnedCount: earnedNames.length,
    trophyCount,
    earned: earnedNames,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `gta6-trophies-${payload.exportedAt.slice(0, 10)}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

export async function readProgressFile(file, knownNames) {
  const parsed = JSON.parse(await file.text());
  const names = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(names)) throw new Error('No "earned" list in this file');
  const known = new Set(knownNames);
  const accepted = names.filter((name) => typeof name === 'string' && known.has(name));
  return { accepted, ignored: names.length - accepted.length };
}
