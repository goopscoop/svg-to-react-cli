#!/usr/bin/env node

'use strict'

// Vendor includes
const chalk = require('chalk');
const fs = require('fs');
const yargs = require('yargs');
const path = require('path');
const HTMLtoJSX = require('htmltojsx');
const jsdom = require('jsdom-no-contextify');

// Language files
const content = require('./lang/en');

// Local includes
const createComponentName = require('./src/createComponentName');
const formatSVG = require('./src/formatSVG');
const generateComponent = require('./src/generateComponent');
const printErrors = require('./src/output').printErrors;
const removeStyle = require('./src/removeStyle');

// Argument setup
const args = yargs
  .option('format', { default: true })
  .option('output', { alias: 'o' })
  .option('rm-style', { default: false })
  .option('force', { alias: 'f', default: false })
  .argv;

// Resolve arguments
const firstArg = args._[0];
const newFileName = args._[1] || 'MyComponent';
const outputPath = args.output;
const rmStyle = args.rmStyle;
const format = args.format;


// Bootstrap base variables
const converter = new HTMLtoJSX({ createClass: false });
const svg = `./${firstArg}.svg`;
let fileCount = 0;

const writeFile = (processedSVG, fileName) => {
  let file;
  let filesWritten = 0;

  if (outputPath){
    file = path.resolve(process.cwd(), outputPath, `${fileName}.js`);
  } else {
    file = path.resolve(process.cwd(), `${fileName}.js`);
  }

  fs.writeFile(file, processedSVG, { flag: args.force ? 'w' : 'wx' }, function (err) {
    if (err) {
      if(err.code === 'EEXIST') {
        printErrors(`Output file ${file} already exists. Use the force (--force) flag to overwrite the existing files`);
      } else {
        printErrors(`Output file ${file} not writable`);
      }
      return;
    }
    filesWritten++;

    console.log('File written to -> ' + file);

    if (filesWritten === fileCount) {
      console.log(`${filesWritten} components created. That must be some kind of record`);
      console.log();
      console.log(content.processCompleteText);
      console.log();
    }
  });
};

const runUtil = (fileToRead, fileToWrite) => {
  fs.readFile(fileToRead, 'utf8', function (err, file) {
    if (err) {
      printErrors(err);
      return;
    }

    let output = file;

    jsdom.env(output, (err, window) => {

      const body = window.document.getElementsByTagName('body')[0];

      if(rmStyle) {
        removeStyle(body);
      }

      // Add width and height
      // The order of precedence of how width/height is set on to an element is as follows:
      // 1st - passed in props are always priority one. This gives run time control to the container
      // 2nd - svg set width/height is second priority
      // 3rd - if no props, and no svg width/height, use the viewbox width/height as the width/height
      // 4th - if no props, svg width/height or viewbox, simlpy set it to 50px/50px
      let defaultWidth = '50px';
      let defaultHeight = '50px';
      if(body.firstChild.hasAttribute('viewBox')) {
        const [minX, minY, width, height] = body.firstChild.getAttribute('viewBox').split(/[,\s]+/);
        defaultWidth = width;
        defaultHeight = height;
      }

      if(! body.firstChild.hasAttribute('width')) {
        body.firstChild.setAttribute('width', defaultWidth);
      }
      if(! body.firstChild.hasAttribute('height')) {
        body.firstChild.setAttribute('height', defaultHeight);
      }

      // Add generic props attribute to parent element, allowing props to be passed to the svg
      // such as className
      body.firstChild.setAttribute(':props:', '');

      // Now that we are done with manipulating the node/s we can return it back as a string
      output = body.innerHTML;

      // Convert from HTML to JSX
      output = converter.convert(output);

      // jsdom and htmltojsx will automatically (and correctly) wrap attributes in double quotes,
      // and generally just dislikes all the little markers used by react, such as the spread
      // operator. We will sub those back in manually now
      output = output.replace(/:props:/g, '{...props}');

      // Format / Prettify JSX
      if(format) {
        output = formatSVG(output);
      }

      // Wrap it up in a React component
      output = generateComponent(output, fileToWrite);

      writeFile(output, fileToWrite);
    });

  });
};

const runUtilForAllInDir = () => {
  fs.readdir(process.cwd(), (err, files) => {
    if (err) {
      return console.log(err);
    }

    files.forEach((file, i) => {
      const extention = path.extname(file);
      const fileName = path.basename(file);

      if (extention === '.svg') {
        // variable instantiated up top
        const componentName = createComponentName(file, fileName);
        runUtil(fileName, componentName);
        fileCount++;
      }
    });
  });
};

// Exit out early arguments
if (args.help) {
  console.log(content.helptext);
  process.exit(1);
}

if (args.example) {
  console.log(content.exampleText);
  process.exit(1);
}

// Main entry point
if (firstArg === 'dir') {
  runUtilForAllInDir();
} else {
  fileCount++;
  runUtil(svg, newFileName);
}

