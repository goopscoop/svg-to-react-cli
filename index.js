#!/usr/bin/env node

'use strict'

const fs = require('fs');
var path = require('path');

const newFileName = process.argv[3] || 'MyComponent';
const outputIndex = process.argv.indexOf('output');
const outputPath = outputIndex !== -1 ? process.argv[outputIndex + 1] : false;
const isFormatting = process.argv.indexOf('no-format') === -1;

// sample command
// svgtoreact MyImage MyComponent /foo/bar/

const helptext = `
Welcome to SVG to React. This tool takes a svg file and outputs
a full formated stateless functional React component. The
component has two props, height and width.

Sample command: svgtoreact svgImage ComponentName
Advanced sample command: svgtoreact svgImage ComponentName output ./components/svgComponents/ no-indentation

Required Arguments:
  For Single File -
  first ............ the name of the svg file. If in working
                     directory, the path and extention are not
                     required.
  second ........... the name of the component. This will be the
                     function name as well as the file name (with
                     .js prepended)
  For Multi File -
    svgtoreact dir - run util off all .svg's in curent working directory

Optional Flags:
  output <path> .... the output path. Do not include the filename.
  no-format ........ will skip line breaks and indentation to svg.
                     If your svg is already formatted, use this flag.
  help ............. you got here on your own, didn't you?
  example .......... output an example of the i/o of this util.

  **Created by Cody Barrus gitHub: goopscoop**
  repo: https://github.com/goopscoop/svg-to-react
`;

const exampleText = `
>>>>>>>>>>  INPUT:
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="height: 512px; width: 512px;"><defs><filter id="glow"><feGaussianBlur stdDeviation="7" result="coloredBlur"></feGaussianBlur><feMerge><feMergeNode in="coloredBlur"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs><circle cx="256" cy="256" r="256" fill="#f5a623" opacity="1" stroke="#fff" stroke-width="0"></circle><path fill="#000000" opacity="1" d="M363.783 23.545c-9.782.057-16.583 3.047-20.744 10.22-17.51 30.18-38.432 61.645-48.552 97.245 2.836.83 5.635 1.787 8.373 2.853 7.353 2.863 14.38 6.482 20.542 10.858 27.534-25.542 58.165-45.21 87.45-65.462 11.356-7.854 12.273-13.584 10.183-20.83-2.09-7.246-9.868-16.365-20.525-23.176-10.658-6.81-23.87-11.33-34.73-11.68-.68-.022-1.345-.03-1.997-.027zm-68.998.746c-10.02-.182-17.792 6.393-23.924 20.24-8.94 20.194-10.212 53.436-1.446 83.185.156-.008.31-.023.467-.03 1.99-.087 3.99-.072 6 .03 9.436-34.822 27.966-64.72 44.013-91.528-10.31-8.496-18.874-11.782-25.108-11.896zM197.5 82.5L187 97.97c14.82 10.04 29.056 19.725 39.813 31.374 3.916 4.24 7.37 8.722 10.31 13.607 3.77-4.73 8.51-8.378 13.69-10.792.407-.188.82-.355 1.228-.53-3.423-5.44-7.304-10.418-11.51-14.972C227.765 102.83 212.29 92.52 197.5 82.5zm223.77 12.27c-29.255 20.228-58.575 39.152-84.348 62.78.438.576.848 1.168 1.258 1.76 20.68-6.75 49.486-15.333 73.916-19.41 11.484-1.916 15.66-6.552 17.574-13.228 1.914-6.676.447-16.71-5.316-26.983-.924-1.647-1.96-3.29-3.083-4.92zm-223.938 47.87c-14.95.2-29.732 4.3-43.957 12.766l9.563 16.03c21.657-12.89 42.626-14.133 65.232-4.563.52-5.592 1.765-10.66 3.728-15.21.35-.806.73-1.586 1.123-2.354-11.87-4.52-23.83-6.827-35.688-6.67zm75.8 3.934c-5.578-.083-10.597.742-14.427 2.526-4.377 2.038-7.466 4.914-9.648 9.97-.884 2.047-1.572 4.54-1.985 7.494.456-.007.91-.03 1.365-.033 16.053-.084 32.587 2.77 49.313 9.19 7.714 2.96 15.062 7.453 22.047 13.184 3.217-2.445 4.99-4.72 5.773-6.535 1.21-2.798 1.095-5.184-.634-8.82-3.46-7.275-15.207-16.955-28.856-22.27-6.824-2.658-13.98-4.224-20.523-4.614-.818-.05-1.627-.08-2.424-.092zm-24.757 38.457c-22.982.075-44.722 7.386-65 19.782-32.445 19.835-60.565 53.124-80.344 90.032-19.777 36.908-31.133 77.41-31.186 110.53-.053 33.06 10.26 57.27 32.812 67.782.043.02.082.043.125.063h.032c24.872 11.51 65.616 19.337 108.407 20.092 42.79.756 87.79-5.457 121.874-20.187 21.96-9.49 34.545-28.452 40.5-54.156 5.954-25.705 4.518-57.657-2.375-89.314-6.894-31.657-19.2-63.06-34.095-87.875-14.894-24.814-32.614-42.664-48.063-48.593-14.664-5.627-28.898-8.2-42.687-8.156z" transform="translate(25.6, 25.6) scale(0.9, 0.9) rotate(0, 256, 256)" clip-path="false" filter="url(#glow)"></path><g font-family="Arial, Helvetica, sans-serif" font-size="120" font-style="normal" font-weight="bold" text-anchor="middle" class="" transform="translate(256,300)" style="touch-action: none;"><text stroke="#000" stroke-width="30" opacity="1"></text><text fill="#fff" opacity="1"></text></g></svg>

>>>>>>>>>>  OUTPUT:
    import React from 'react';

    export default function NewThing({width, height}) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={height: "512px", width: "512px" height={height} width={width}}>
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
      <path fill="#50e3c2" opacity="1" d="M149.25 18.313L168.156 115c-.274.174-.54.356-.812.53L94 97.876l17.47 74.22c-.655 1.046-1.306 2.093-1.94 3.155l-91.28-8.875 73 51.156c-.808 2.82-1.546 5.658-2.22 8.532l-64.53 40 63.906 39.22c.28 1.282.57 2.57.875 3.843l-46.468 36.563 55.97-7.907c3.506 8.184 7.588 16.056 12.218 23.564l-17 72.344 64.344-15.47-9.094 75.563 52.188-58.06c7.553 2.82 15.352 5.14 23.343 6.936l37.407 61.094L299 443.656c5.876-1.156 11.655-2.6 17.313-4.312l29.406 31.03-5.47-40.187c7.902-3.694 15.49-7.96 22.72-12.718l67.405 16.217-15.906-67.656c5.62-8.506 10.555-17.504 14.686-26.936l47.563 6.594-39.095-30.438c1.175-4.23 2.192-8.526 3.063-12.875l59.187-36.313-59.75-37.03c-1.686-7.793-3.87-15.397-6.53-22.782l59.5-47.656-73.94 17.03c-1.645-2.777-3.367-5.507-5.155-8.186l16.375-69.563-70.344 16.938c-5.638-3.56-11.49-6.824-17.53-9.75l3.22-63.376-37.22 51c-2.527-.64-5.088-1.215-7.656-1.75l-38.656-63.156-39.282 64.19c-4.772 1.127-9.475 2.438-14.094 3.936L149.25 18.312zm115 88.874c88.423 0 159.875 71.484 159.875 159.907 0 88.423-71.452 159.875-159.875 159.875s-159.906-71.453-159.906-159.876 71.483-159.906 159.906-159.906zm49.03 44.157c-5.278.115-10.207 2.383-16.936 9.562l-6.563 7-6.81-6.72c-7.39-7.28-13.218-9.29-19.126-9.03-5.91.26-12.856 3.336-20.625 9.625l-6.22 5.032-5.906-5.343c-8.9-8.053-16.485-10.44-23.75-10.064-5.288.273-10.775 2.265-16.25 5.75l40.97 73.688c15.445 9.445 47.003 13.015 68.717 2.094l39.626-73.375c-7.51-3.063-14.258-6.202-20.094-7.407-2.112-.436-4.07-.755-5.968-.812-.356-.01-.71-.008-1.063 0zm-90 96.187c-18.017 12.748-32.488 34.71-38.093 66.876-5.436 31.197 3.127 52.266 18.282 66.625 15.154 14.36 37.9 21.77 61 21.47 23.098-.3 46.134-8.31 61.624-22.938 15.49-14.626 24.25-35.456 19.28-65.218-5.132-30.736-18.383-52.115-35.155-65.063-28.498 15.077-64.154 11.872-86.94-1.75z" transform="translate(25.6, 25.6) scale(0.9, 0.9) rotate(0, 256, 256)" clipPath="false" filter="url(#glow)"></path>
      <g fontFamily="Arial, Helvetica, sans-serif" fontSize="120" fontStyle="normal" fontWeight="bold" textAnchor="middle" class="" transform="translate(256,300)" style={touchAction: "none"}>
        <text stroke="#000" strokeWidth="30" opacity="1"></text>
        <text fill="#fff" opacity="1"></text>
      </g>
    </svg>

      );
    }
`;

const processCompleteText = `
Process complete! Thanks for using SVG to React. If your 
mind was blown by how much time you just saved, then be
sure to tell a friend about this util!
`;

const firstArg = process.argv[2];
if (firstArg === 'help') {
  console.log(helptext);
  return;
}

if (firstArg === 'example') {
  console.log(exampleText);
  return;
}

const svg = `./${firstArg}.svg`;

const generateComponent = svgOutput => `
import React from 'react';

export default function ${newFileName}({width = '50px', height = '50px'}) {
  return (
    ${svgOutput}
  );
}

${newFileName}.propTypes = {
  width: React.PropTypes.string,
  height: React.PropTypes.string
}
`;

// Thanks http://stackoverflow.com/questions/376373/pretty-printing-xml-with-javascript
const formatSVG = function (svg) {
  if (!isFormatting) {
    return svg;
  }

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

  return formatted; 
};

const processSVGTags = data => {
  let inQuotes = false;
  let isFirstTag = true;
  const dataArr = data.split('');

  const areWeInQuotes = (inQuotes, value) => {
    if ( value === `"`) {
      return !inQuotes;
    }
    return inQuotes;
  };

  const changeCamelCaseToSnakeCase = (i) => {
    if ( dataArr[i] === '-' && !inQuotes) {
      dataArr.splice(i, 2, dataArr[i+1].toUpperCase())
    }
  };

  const isStyleAttribute = (i) => {
    return dataArr[i] === 's' && dataArr[i + 1] === 't' &&
      dataArr[i + 2] === 'y' && dataArr[i + 3] === 'l' &&
      dataArr[i + 4] === 'e' && dataArr[i + 5] === '=' 
  }

  const changeStyleToObj = (i) => {
    let isComplete = false;
    let quotes = 0;

    const turnQuoteToCurly = (y) => {
      if (dataArr[y] === `"`) {
        quotes++;
        dataArr[y] = quotes === 1 ? `{` : `}`;
        if (quotes === 2) {
          dataArr.splice(y - 1, 1);
        }
      }
    };

    const wrapValuesInQuotes = (y, cb) => {

      if ( dataArr[y] === ':') {
        dataArr.splice(y + 2, 0, '"');
        cb();
      }

      if ( dataArr[y] === ';') {
        dataArr[y] = '"';
        dataArr.splice(y + 1, 0, ',');
      }
    }

    for (let y = JSON.parse(JSON.stringify(i)); !isComplete; y++){
      turnQuoteToCurly(y);
      wrapValuesInQuotes(y, () => {
        y+=2;
      });

      if ( quotes === 2 ) {
        isComplete = true;
      }
    }
  }

  const addHeightAndWidth = (i) => {
    if (isFirstTag && dataArr[i] === '>') {
      isFirstTag = !isFirstTag;
      dataArr.splice(i, 0, ' height={height} width={width}');
    }
  }

  for (let i = 0; i < dataArr.length; i++ ) {
    if ( !inQuotes && isStyleAttribute(i)) {
      changeStyleToObj(i);
    }

    addHeightAndWidth(i)
    changeCamelCaseToSnakeCase(i);
    inQuotes = areWeInQuotes(inQuotes, dataArr[i]);
  }

  return dataArr.join('');
};

const writeFile = (processedSVG, fileName) => {
  let file;

  if (outputPath){
    file = path.resolve(process.cwd(), outputPath, `${fileName}.js`);
  } else {
    file = path.resolve(process.cwd(), `${fileName}.js`);
  }
  fs.writeFile(file, processedSVG, function (err) {
      if (err) {    
          return console.log(err);
      }
      console.log('File written to -> ' + file);
  });
};

const runUtil = (fileToRead, fileToWrite) => {
  fs.readFile(fileToRead, 'utf8', function (err, file) {
    if (err) {
      return console.log(err);
    }

    const processedSVG = generateComponent(formatSVG(processSVGTags(file)));
    writeFile(processedSVG, fileToWrite);
  });
};

const createComponentName = (fileName, file) => {
  let componentNamePrep;

  if (fileName.indexOf('-') !== - 1) {
    componentNamePrep = snakeToCamel(path.basename(file, '.svg'));
  } else {
    componentNamePrep = path.basename(file, '.svg');
  }
  const componentNameArr = componentNamePrep.split('');
  componentNameArr[0] = componentNameArr[0].toUpperCase();
  return componentNameArr.join('');
};

const addFlavor = (i) => {
  const rand = Math.random() * (100 - 1) + 1;

  if (rand < 10) {
    console.log('Whew, I might break a sweat.');
  }

  if (rand < 20) {
    console.log(`You're not kidding around here!`);
  }

  if (rand < 30) {
    console.log(`If you tell your boss you processed all these files this quickly, you might get a raise. Won't hurt anyway.`)
  }

  if (rand < 40) {
    console.log(`Processing this many files makes me horny--er, tired. I meant tired.`);
  }

  if (rand < 50) {
    console.log(`Read "The Name of the Wind" by Patrick Rothfuss.`);
  }

  if (rand < 60) {
    console.log(`If you haven't watched Ip Man, you owe it to yourself to. Great movie.`);
  }

  if (rand < 70) {
    console.log(`Another suprisingly good movie... Dredd starring Karl Urban. So good!`);
  }

  if (rand < 80) {
    console.log(`Tonights date movie... The Raid.`)
  }

  console.log(`If you like metal, listen to the Fear Before the March of Flames album "The Always Open Mouth". Best album ever, but no one listens to it.`)
}

const runUtilForAllInDir = () => {
  fs.readdir(process.cwd(), (err, files) => {
    if (err) {
      return console.log(err);
    }
    let fileCount = 0;

    files.forEach((file, i) => {
      if (path.extname(file) === '.svg') {
        const fileName = path.basename(file);
        const componentName = createComponentName(fileName, file);

        runUtil(fileName, componentName);
        fileCount++;
      }
    });
    console.log(`${fileCount} files created. Dude, that must be some kind of record.`);
    addFlavor(i);
  });
};

function snakeToCamel(s){
    return s.replace(/(\-\w)/g, function(m){return m[1].toUpperCase();});
}

if (firstArg === 'dir') {
  runUtilForAllInDir();
} else {
  runUtil(svg);
  addFlavor(i);
}

