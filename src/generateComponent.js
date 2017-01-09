'use strict'

/**
 * Creates a full component string based upon provided svg data and a component name
 * @param  string svgOutput     The svg data, preformatted
 * @param  string componentName The name of the component without extension
 * @return string               The parsed component string
 */
module.exports = (svgOutput, componentName) =>
`import React from 'react';

export default function ${componentName}(props) {
  return (
${svgOutput.split('\n').map(line => `    ${line}`).join('\n')}
  );
}
`;