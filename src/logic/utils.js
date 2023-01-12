import {uniq} from 'lodash';

export function sumFields(o1, o2) {
  o1 = o1 || {}
  o2 = o2 || {}
  const fields = uniq([...Object.keys(o1), ...Object.keys(o2)])
  const o = {}
  for (const f of fields) {
    o[f] = (o1[f] || 0) + (o2[f] || 0)
  }
  return o
}

function parsePattern(input, pattern, type, parseValue) {
  const matches = [...input.matchAll(pattern)]
  const parts = []
  let i = 0;
  for (let match of matches) {
    const matchVal = match[0];
    const matchStart = match['index'];
    if (i < matchStart) {
      parts.push(...parseUrl(input.substr(i, matchStart - i)))
      i += matchStart - i;
    }
    parts.push({
      type: type,
      value: parseValue(matchVal)
    });
    i += matchVal.length;
  }

  if (i<input.length) {
    parts.push(...parseUrl(input.substr(i, input.length - i)))
  }
  return parts;
}

export function parseUrl(txt) {
  if (/(?<url>https?:\/\/\S+)/g.exec(txt)) {
    return parsePattern(txt, /(?<url>https?:\/\/\S+)/g, 'href', v => ({ href: v, text: v.substr(0, 50) }) )
  } else {
    return [{ type: 'text', value: txt }]
  }
}

export function parseContent(input) {
  try {
    return parsePattern(input, /\[@\S+=.*?\]/g, 'ref', val => /\[@(?<uid>\S+)=(?<fullName>.*?)\]/g.exec(val).groups)
  } catch (e) {
    console.error(e, input)
    return [{type: 'text', value: input}];
  }
}
