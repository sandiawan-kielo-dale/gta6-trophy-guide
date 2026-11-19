// The guide panel: official text, when it unlocks, missable window, our guide, steps and the cited sources.
import { h, clear } from './dom.js';
import { CONFIDENCE_LABELS, KIND_LABELS, sourceHost } from './trophy-data.js';
import { gradeBadge, earnedToggle } from './trophy-badges.js';

export function renderGuidePanel(panel, t, { store, shield, rerender }) {
  clear(panel);
  if (shield.isShielded(t)) {
    panel.append(
      h('div.guide-head', {}, gradeBadge(t.grade), h('h2.masked', {}, shield.title(t)), earnedToggle(t, store)),
      h('div.shield-card', {},
        h('strong', {}, 'Spoiler shield is on'),
        h('p', {}, 'This story trophy names a mission or chapter. Its name, description and guide stay hidden until you tick it as earned, switch the shield off, or reveal just this one.'),
        h('button.btn', { type: 'button', onclick: () => { shield.reveal(t.name); rerender(); } }, 'Reveal this one')),
      factsLine({ ...t, unlock: `Chapter ${t.chapter}` }),
      h('p.safe-box', {}, 'Not missable: story trophies unlock automatically.'),
      sourceList(t.sources));
    return;
  }
  panel.append(
    h('div.guide-head', {}, gradeBadge(t.grade), h('h2', {}, t.name), earnedToggle(t, store)),
    h('p.official', {}, h('span.label', {}, 'Official PS5 description'), t.description),
    factsLine(t),
    t.missable !== 'no' ? h('p.miss-box', {}, h('strong', {}, 'Missable window: '), t.window) : h('p.safe-box', {}, 'Not missable: still available after the story.'),
    h('div.guide-body', {},
      h('span.label', {}, 'Guide', h(`span.conf.c-${t.confidence}`, {}, CONFIDENCE_LABELS[t.confidence] ?? t.confidence)),
      h('p', {}, t.guide),
      t.steps.length ? h('ol.steps', {}, t.steps.map((s) => h('li', {}, s))) : null),
    sourceList(t.sources));
}

function factsLine(t) {
  const facts = [
    ['Grade', t.grade],
    ['Kind', KIND_LABELS[t.kind]],
    ['Unlocks', t.unlock],
    ['Stage', `${t.stage} of 5`],
    t.character ? ['Who', t.character] : null,
    t.count ? ['Count', t.count.toLocaleString('en-US')] : null,
    ['PSN list', t.hidden ? 'hidden' : 'visible'],
  ].filter(Boolean);
  return h('dl.facts', {}, facts.map(([k, v]) => h('div', {}, h('dt', {}, k), h('dd', {}, v))));
}

export function sourceList(sources) {
  return h('div.sources', {},
    h('span.label', {}, `Sources (${sources.length})`),
    h('ul', {}, sources.map((s) => h('li', {},
      h('a', { href: s.url, target: '_blank', rel: 'noopener noreferrer' }, s.title),
      h('span.host', {}, sourceHost(s.url))))));
}
