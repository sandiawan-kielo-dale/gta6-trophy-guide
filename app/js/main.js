// Boot: load the trophy data, wire the toolbar to the store, and re-render the active view on every change.
import { h, clear } from './dom.js';
import { loadTrophyData } from './trophy-data.js';
import { createProgressStore } from './progress-store.js';
import { exportProgress, readProgressFile } from './progress-transfer.js';
import { KIND_FILTERS, countByKind, filterTrophies } from './trophy-filters.js';
import { createSpoilerShield } from './spoiler-shield.js';
import { renderStats } from './stats-panel.js';
import { renderChecklist } from './checklist-view.js';
import { renderRoadmap } from './roadmap-view.js';
import { renderMissables } from './missables-view.js';

const VIEWS = { checklist: renderChecklist, roadmap: renderRoadmap, missables: renderMissables };
const $ = (id) => document.getElementById(id);

const data = await loadTrophyData();
const store = createProgressStore();
const shield = createSpoilerShield(() => store.settings.spoiler, store.isEarned);
let query = '';

function rerender() {
  const { settings } = store;
  renderStats($('stats'), data.trophies, store.isEarned);
  renderKindChips(settings.kind);
  for (const tab of document.querySelectorAll('.tab')) tab.classList.toggle('active', tab.dataset.view === settings.view);
  syncSelect('grade-filter', settings.grade);
  syncSelect('earned-filter', settings.earned);
  syncSelect('spoiler-mode', settings.spoiler);
  document.body.dataset.view = settings.view;
  const visible = filterTrophies(data.trophies, { ...settings, query }, store.isEarned, shield.isShielded);
  const view = clear($('view'));
  (VIEWS[settings.view] ?? renderChecklist)(view, { data, visible, store, shield, rerender });
}

function renderKindChips(active) {
  const counts = countByKind(data.trophies);
  const chips = KIND_FILTERS.map((f) => h(`button.chip.c-${f.id}${f.id === active ? '.active' : ''}${counts[f.id] ? '' : '.none'}`, {
    type: 'button',
    title: counts[f.id] ? `Show ${f.label.toLowerCase()} trophies` : 'GTA VI lists no online trophies',
    onclick: () => store.updateSettings({ kind: f.id, view: 'checklist' }),
  }, f.label, h('b', {}, counts[f.id])));
  clear($('kind-chips')).append(h('span.chips-label', {}, 'Filter by kind'), ...chips, shieldStatus());
}

function shieldStatus() {
  const masked = data.trophies.filter(shield.isShielded).length;
  const mode = store.settings.spoiler;
  return h(`span.shield-status${mode === 'off' ? '.off' : ''}`, {},
    mode === 'off' ? 'Spoiler shield off · all story names visible' : `Spoiler shield on · ${masked} unearned ${mode === 'story' ? 'story' : 'hidden'} trophies masked`);
}

function syncSelect(id, value) {
  if ($(id).value !== value) $(id).value = value;
}

function toast(message) {
  const node = $('toast');
  node.textContent = message;
  node.classList.add('show');
  setTimeout(() => node.classList.remove('show'), 2600);
}

for (const tab of document.querySelectorAll('.tab')) tab.addEventListener('click', () => store.updateSettings({ view: tab.dataset.view }));
$('grade-filter').addEventListener('change', (e) => store.updateSettings({ grade: e.target.value }));
$('earned-filter').addEventListener('change', (e) => store.updateSettings({ earned: e.target.value }));
$('spoiler-mode').addEventListener('change', (e) => store.updateSettings({ spoiler: e.target.value }));
$('search').addEventListener('input', (e) => { query = e.target.value; rerender(); });
$('export-progress').addEventListener('click', () => {
  exportProgress([...store.earned], data.trophies.length);
  toast(`Exported ${store.earned.size} earned trophies`);
});
$('import-progress').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const { accepted, ignored } = await readProgressFile(file, data.trophies.map((t) => t.name));
    store.replaceEarned(accepted);
    toast(`Imported ${accepted.length} trophies${ignored ? `, ignored ${ignored} unknown` : ''}`);
  } catch (error) {
    toast(`Import failed: ${error.message}`);
  }
  e.target.value = '';
});

store.subscribe(rerender);
rerender();
