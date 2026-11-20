import {zodiacPaths} from './zodiac-icons.js';

const paths = {
  ...zodiacPaths,
  chevron:'M6 9l6 6 6-6',
  pencil:'M15 5l4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15z',
  camera:'M4 7h4l2-3h4l2 3h4a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1ZM16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  gift: 'M3 8h18v4H3zM5 12v8h14v-8M12 8v12M12 8H8.5a2.5 2.5 0 1 1 2.3-3.5L12 8Zm0 0h3.5a2.5 2.5 0 1 0-2.3-3.5L12 8Z',
  horoscope: 'M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z',
  clock: 'M12 8v4l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  flame: 'M13 3c1 5-4 6-2 10 1-2 3-3 4-5 6 7 3 13-3 13-7 0-9-7-5-12 0 4 2 4 2 4-1-5 2-7 4-10Z',
  market: 'M4 19V5M4 19h17M7 14l4-4 4 2 5-6M16 6h4v4',
  bolt: 'M13 2L5 13h6l-1 9 9-13h-6Z',
  gold: 'M9 4h6l3 7H6l3-7ZM4 14h6l3 6H1l3-6ZM15 14h6l2 6H12l3-6Z',
  tone_serious:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M8 9h.01M16 9h.01M8 15h8',
  tone_humor:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M7 9l2-1 2 1M13 9l2-1 2 1M7 13h10q-1 6-5 6t-5-6Z',
  bitcoin: 'M9 5h6a3.5 3.5 0 0 1 0 7H9h7a3.5 3.5 0 0 1 0 7H9V5M12 2v3M16 2v3M12 19v3M16 19v3M6 5h3M6 19h3',
  left: 'M14 6l-6 6 6 6', right: 'M10 6l6 6-6 6',
};

export function icon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.5');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  for(const d of (Array.isArray(paths[name])?paths[name]:[paths[name]||paths.horoscope])){
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',d);svg.append(path);
  }
  return svg;
}
