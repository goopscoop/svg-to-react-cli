# svg-to-react-cli
A command line utility that takes a svg image file and outputs a fully formatted stateless functional React component with `hieght` and `width` for props. With flags to toggle formatting and remove style attributes.

## To Use
`npm install -g react-to-svg-cli`

### One File

`svgtoreact <svgImage> <ComponentName>`

**NOTE**: image file must be in current working directory. Do not add the extention. If file is `image.svg`, then just enter `image` as the first argument. ComponentName will be the name of the sfc and filename with `.js` appended.

### Multi File

`svgtoreact dir`

or for all files in directory (will name all components in CamelCase based on image name. If image is `image.svg` then new component will be `Image` and file will be `Image.js`):


## Flags

Or use flags: `svgtoreact <svgImage> <ComponentName> output ./components/svgComponents/ no-indentation`
  
**Optional Flags:**

`output <path>` - the output path. Do not include the filename.

`no-format` - will skip line breaks and indentation to svg. If your svg is already formatted, use this flag.

`rm-style` - removes all style attributes from svg tags.

`help` - Prints out this readme.

`example` - Prints an example of the i/o of this util.

## Example

Takes this:
```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="height: 512px; width: 512px;"><defs><filter id="glow"><feGaussianBlur stdDeviation="7" result="coloredBlur"></feGaussianBlur><feMerge><feMergeNode in="coloredBlur"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs><circle cx="256" cy="256" r="256" fill="#f5a623" opacity="1" stroke="#fff" stroke-width="0"></circle><path fill="#000000" opacity="1" d="M363.783 ..." transform="translate(25.6, 25.6) scale(0.9, 0.9) rotate(0, 256, 256)" clip-path="false" filter="url(#glow)"></path><g font-family="Arial, Helvetica, sans-serif" font-size="120" font-style="normal" font-weight="bold" text-anchor="middle" class="" transform="translate(256,300)" style="touch-action: none;"><text stroke="#000" stroke-width="30" opacity="1"></text><text fill="#fff" opacity="1"></text></g></svg>
```
And creates a new file with this:

```javascript
import React from 'react';

export default function NewThing({width = '50px', height = '50px'}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height={height} width={width}>
  <defs>
    <filter id="glow">
      <feGaussianBlur stdDeviation="7" result="coloredBlur"></feGaussianBlur>
      <feMerge>
        <feMergeNode in="coloredBlur"></feMergeNode>
        <feMergeNode in="SourceGraphic"></feMergeNode>
      </feMerge>
    </filter>
  </defs>
  <circle cx="256" cy="256" r="256" fill="#f8e71c" opacity="1" stroke="#fff" strokeWidth="0"></circle>
  <path fill="#50e3c2" opacity="1" d="M149.25 18.313L168.156 ..." clipPath="false" filter="url(#glow)"></path>
  <g fontFamily="Arial, Helvetica, sans-serif" fontSize="120" fontStyle="normal" fontWeight="bold" textAnchor="middle" class="" transform="translate(256,300)" style={touchAction: "none"}>
    <text stroke="#000" strokeWidth="30" opacity="1"></text>
    <text fill="#fff" opacity="1"></text>
  </g>
</svg>

  );
}

NewThing.propTypes = {
  width: React.PropTypes.string,
  height: React.PropTypes.string
}
```
