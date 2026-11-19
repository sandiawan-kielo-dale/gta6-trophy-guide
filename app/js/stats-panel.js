// Header progress: earned count, PSN points and a bar per grade.
import { h, clear } from './dom.js';
import { GRADE_ORDER, GRADE_POINTS } from './trophy-data.js';

export function renderStats(container, trophies, isEarned) {
  const earned = trophies.filter((t) => isEarned(t.name));
  const points = (list) => list.reduce((sum, t) => sum + GRADE_POINTS[t.grade], 0);
  const percent = Math.round((earned.length / trophies.length) * 100);
  clear(container).append(
    h('div.stat-main', {},
      h('div.ring', { style: `--p:${percent}` }, h('span', {}, `${percent}%`)),
      h('div', {},
        h('strong.stat-count', {}, `${earned.length} / ${trophies.length}`),
        h('span.stat-sub', {}, `${points(earned)} / ${points(trophies)} pts`))),
    h('div.grade-bars', {}, GRADE_ORDER.map((grade) => gradeBar(grade, trophies, earned))),
  );
}

function gradeBar(grade, trophies, earned) {
  const total = trophies.filter((t) => t.grade === grade).length;
  const got = earned.filter((t) => t.grade === grade).length;
  return h(`div.grade-bar.g-${grade}`, { title: `${grade}: ${got} of ${total}` },
    h('span.grade-name', {}, grade),
    h('span.bar', {}, h('i', { style: `width:${total ? (got / total) * 100 : 0}%` })),
    h('span.grade-num', {}, `${got}/${total}`));
}
