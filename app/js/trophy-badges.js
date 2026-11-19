// Shared bits of trophy markup: grade badge, kind tag, missable flag and the earned checkbox.
import { h } from './dom.js';
import { KIND_LABELS } from './trophy-data.js';

const GRADE_LETTER = { platinum: 'P', gold: 'G', silver: 'S', bronze: 'B' };

export function gradeBadge(grade) {
  return h(`span.badge.g-${grade}`, { title: grade }, GRADE_LETTER[grade]);
}

export function kindTag(kind) {
  return h(`span.tag.k-${kind}`, {}, KIND_LABELS[kind] ?? kind);
}

export function missableFlag(t) {
  if (t.missable === 'no') return null;
  return h('span.flag.flag-miss', { title: t.window ?? '' }, t.missable === 'potential' ? 'Missable?' : 'Missable');
}

export function earnedToggle(t, store) {
  return h('input.earned-box', {
    type: 'checkbox',
    checked: store.isEarned(t.name),
    'aria-label': `Earned: ${t.name}`,
    onclick: (event) => event.stopPropagation(),
    onchange: () => store.toggle(t.name),
  });
}
