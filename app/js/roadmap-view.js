// The roadmap: five ordered stages to the platinum, each with its trophies in chapter order.
import { h } from './dom.js';
import { gradeBadge, earnedToggle } from './trophy-badges.js';
import { sourceHost } from './trophy-data.js';

export function renderRoadmap(container, { data, store, shield }) {
  const columns = data.stages.map((stage) => {
    const members = data.trophies
      .filter((t) => t.stage === stage.id)
      .sort((a, b) => a.chapter - b.chapter || a.id - b.id);
    const done = members.filter((t) => store.isEarned(t.name)).length;
    return h('section.stage', {},
      h('header.stage-head', {},
        h('span.stage-num', {}, stage.id),
        h('div', {}, h('h3', {}, stage.title), h('span.stage-meta', {}, `${stage.hours} · ${done}/${members.length} earned`))),
      h('p.stage-summary', {}, stage.summary),
      stage.musts.length ? h('ul.musts', {}, stage.musts.map((m) => h('li', {}, m))) : null,
      h('ol.stage-trophies', {}, members.map((t) => stageItem(t, store, shield))),
      h('p.stage-src', {}, 'Sources: ', stage.sources.map((s, i) => [i ? ' · ' : '', h('a', { href: s.url, target: '_blank', rel: 'noopener noreferrer' }, sourceHost(s.url))])));
  });
  container.append(h('div.roadmap', {}, columns));
}

function stageItem(t, store, shield) {
  const shielded = shield.isShielded(t);
  return h(`li.stage-item${store.isEarned(t.name) ? '.earned' : ''}${shielded ? '.shielded' : ''}`, { onclick: () => store.updateSettings({ selected: t.name, view: 'checklist' }) },
    earnedToggle(t, store),
    gradeBadge(t.grade),
    h('span.stage-name', { title: shield.title(t) }, shield.shortTitle(t)),
    t.missable !== 'no' ? h('span.miss-dot', { title: t.window }, '!') : h('span'),
    h('span.chapter', {}, `Ch${t.chapter}`));
}
