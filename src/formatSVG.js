'use strict'

// Thanks http://stackoverflow.com/questions/376373/pretty-printing-xml-with-javascript

/**
 * This pretty prints the provided svg.
 * @param  string  svg The svg data to format
 * @return string The formatted svg data
 */
module.exports = function formatSVG(svg) {
  const reg = /(>)\s*(<)(\/*)/g;
  const wsexp = / *(.*) +\n/g;
  const contexp = /(<.+>)(.+\n)/g;
  svg = svg.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
  const pad = 0;
  let formatted = '';
  const lines = svg.split('\n');
  let indent = 0;
  let lastType = 'other';
  // 4 types of tags - single, closing, opening, other (text, doctype, comment) - 4*4 = 16 transitions
  const transitions = {
      'single->single': 0,
      'single->closing': -1,
      'single->opening': 0,
      'single->other': 0,
      'closing->single': 0,
      'closing->closing': -1,
      'closing->opening': 0,
      'closing->other': 0,
      'opening->single': 1,
      'opening->closing': 0,
      'opening->opening': 1,
      'opening->other': 1,
      'other->single': 0,
      'other->closing': -1,
      'other->opening': 0,
      'other->other': 0
  };

  for (let i = 0; i < lines.length; i++) {
      const ln = lines[i];
      const single = Boolean(ln.match(/<.+\/>/)); // is this line a single tag? ex. <br />
      const closing = Boolean(ln.match(/<\/.+>/)); // is this a closing tag? ex. </a>
      const opening = Boolean(ln.match(/<[^!].*>/)); // is this even a tag (that's not <!something>)
      const type = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other';
      let fromTo = lastType + '->' + type;
      lastType = type;
      let padding = '';

      indent += transitions[fromTo];
      for (let j = 0; j < indent; j++) {
          padding += '  ';
      }
      if (fromTo == 'opening->closing')
          formatted = formatted.substr(0, formatted.length - 1) + ln + '\n'; // substr removes line break (\n) from prev loop
      else
          formatted += padding + ln + '\n';
  }

  return formatted.trim();
};