// The checklist: one dense row per trophy (official name, description, grade, flags) beside the guide panel.
import { h } from './dom.js';
import { gradeBadge, kindTag, missableFlag, earnedToggle } from './trophy-badges.js';
import { renderGuidePanel } from './guide-panel.js';

export function renderChecklist(container, ctx) {
  const { visible, store, shield } = ctx;
  const selected = visible.find((t) => t.name === store.settings.selected) ?? visible[0];
  const rows = visible.map((t) => checklistRow(t, t === selected, ctx));
  const list = h('section.checklist', { 'aria-label': 'Trophy checklist' },
    h('div.list-head', {}, `${visible.length} trophies shown`),
    rows.length ? h('ol.rows', {}, rows) : h('p.empty', {}, 'No trophy matches these filters.'));
  const guide = h('aside.guide', { 'aria-label': 'Trophy guide' });
  if (selected) renderGuidePanel(guide, selected, ctx);
  container.append(h('div.split', {}, list, guide));
  keepSelectedRowInView(list);
  void shield;
}

function keepSelectedRowInView(list) {
  const scroller = list.querySelector('.rows');
  const row = list.querySelector('.row.selected');
  if (!scroller || !row) return;
  const top = row.offsetTop - scroller.offsetTop;
  if (top > scroller.clientHeight - row.offsetHeight) scroller.scrollTop = top - scroller.clientHeight / 2;
}

function checklistRow(t, isSelected, { store, shield }) {
  const shielded = shield.isShielded(t);
  const classes = ['row', isSelected && 'selected', store.isEarned(t.name) && 'earned', shielded && 'shielded'].filter(Boolean).join('.');
  return h(`li.${classes}`, { onclick: () => store.updateSettings({ selected: t.name }), tabindex: 0 },
    earnedToggle(t, store),
    gradeBadge(t.grade),
    h('div.row-text', {},
      h('span.row-name', {}, shield.title(t)),
      h('span.row-desc', {}, shield.description(t))),
    h('div.row-tags', {},
      missableFlag(t),
      kindTag(t.kind),
      h('span.stage-tag', { title: `Roadmap stage ${t.stage}` }, `Stage ${t.stage}`),
      h('span.src-count', { title: 'Cited sources' }, `${t.sources.length} src`)));
}
