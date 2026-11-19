// Missables & windows: the missable trophy plus a chapter timeline of when each trophy first becomes possible.
import { h } from './dom.js';
import { gradeBadge, kindTag, missableFlag } from './trophy-badges.js';
import { sourceList } from './guide-panel.js';

const CHAPTER_NOTES = {
  1: 'Gone Fishing → Down to Earth → Feng Shui → Island Dreams. Do the balcony meditation here.',
  2: 'Breakfast Run, Coffee Break (partner free-roam), Daily Driver (garages), Moses (Scooter Bros).',
  3: 'Cartel Heist, Yasmani\'s Jewelry Jobs, Credit Check, Clonin\' Keys, Here Kitty Kitty.',
  4: 'Ocean Beach, Child\'s Play, Headliners, VCIA Takedown, optional That\'s Where The Money Is…',
  5: 'Operation Savage Glory and the final mission; 100% checklist opens after the credits.',
};

export function renderMissables(container, { data, store, shield }) {
  const missables = data.trophies.filter((t) => t.missable !== 'no');
  const alert = h('section.miss-alert', {},
    h('h2', {}, `${missables.length} possibly missable · 0 online · 0 glitched`),
    missables.map((t) => h('div.miss-card', {},
      h('div.miss-title', {}, gradeBadge(t.grade), h('strong', {}, shield.title(t)), missableFlag(t)),
      h('p', {}, h('b', {}, 'Window: '), t.window),
      h('p', {}, t.guide),
      sourceList(t.sources))),
    h('p.miss-foot', {}, 'Everything else stays available after the story. There is no mission replay, so keep one manual save per chapter start and end.'),
    gatesPanel(data.trophies, shield));

  const timeline = h('section.timeline', {},
    h('h2', {}, 'When each trophy becomes possible'),
    [1, 2, 3, 4, 5].map((chapter) => chapterBlock(chapter, data.trophies.filter((t) => t.chapter === chapter), store, shield)),
    h('p.miss-foot', {}, 'Chapter = the earliest point the sources say a trophy can be worked on (PowerPyx roadmap).'));
  container.append(h('div.missables', {}, alert, timeline));
}

function gatesPanel(trophies, shield) {
  const gated = trophies.filter((t) => t.character);
  return h('div.gates', {},
    h('h3', {}, 'Character & partner gates (not missable, but plan for them)'),
    h('ul.gate-list', {}, gated.map((t) => h('li', {},
      gradeBadge(t.grade),
      h('span.ct-name', {}, shield.title(t)),
      h(`span.gate.${t.character.startsWith('Lucia') ? 'lucia' : t.character.startsWith('Jason') ? 'jason' : 'pair'}`, {}, t.character)))));
}

function chapterBlock(chapter, trophies, store, shield) {
  const spoilersAllowed = store.settings.spoiler === 'off';
  const note = spoilersAllowed ? CHAPTER_NOTES[chapter] : `${trophies.length} trophies open here · mission names hidden by the spoiler shield`;
  return h('div.chapter-block', {},
    h('div.chapter-label', {}, h('strong', {}, `Chapter ${chapter}`), h('span', {}, note)),
    h('ul.chapter-trophies', {}, trophies.map((t) => h(`li${store.isEarned(t.name) ? '.earned' : ''}`, {},
      gradeBadge(t.grade),
      h('span.ct-name', {}, shield.title(t)),
      h('span.ct-unlock', {}, shield.isShielded(t) ? 'story' : t.unlock),
      kindTag(t.kind)))));
}
