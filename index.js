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

      // // Add width and height
      if(! body.firstChild.hasAttribute('width')) {
        body.firstChild.setAttribute('width', '{width}');
      }
      if(! body.firstChild.hasAttribute('height')) {
        body.firstChild.setAttribute('height', '{height}');
      }

      // Now that we are done with manipulating the node/s we can return it back as a string
      output = body.innerHTML;

      // Convert from HTML to JSX
      output = converter.convert(output);

      // Post toText parse for invalid html.
      // jsdom and htmltojsx will automatically (and correctly) wrap attributes in double quotes.
      // Just need to pull them back out when they are wrapping our jsx quotes
      output = output.replace(/"\{width\}"/g, '{width}');
      output = output.replace(/"\{height\}"/g, '{height}');

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

