const express = require('express');
const util = require('util');
const fs = require('fs');
const path = require('path');
const app = express();
const yaml = require('js-yaml');
const readFile = util.promisify(fs.readFile);
const readDir = util.promisify(fs.readdir);

 // hardcoded names because of jsFiddle <== github integration
const files = {
  index: 'demo.html',
  script: 'demo.js',
  config: 'demo.details',
  css: 'demo.css',
};

const filesContent = {
  script: null,
  css: null,
  config: null
};

const template = `
<html>
    <title>{{title}}</title>
    <head>
        {{headScript}}
        <style>
          {{style}}
        </style>
    </head>
    <body>
        {{content}}
        <script src="http://localhost:4000/index.umd.js"></script>
        <script>
            {{script}}
        </script>
    </body>
</html>
`;

const listTemplate = `
<html>
    <body>
        <ul>{{list}}</ul>
    </body>
</html>
`;

let examples;
const getExamples = () => {
  examples = [];
  return readDir(__dirname).then((results) => {
    results.forEach((val) => {
      if (fs.statSync(path.join(__dirname, val)).isDirectory()
      && fs.existsSync(path.join(__dirname, val, files.config))) {
        examples.push(val);
      }
    });
  });
};

// render examples list
app.get('/', (req, res) => {
  getExamples().then(() => {
    const list = examples.map(val => `<li><a href="/${val}" alt="val">${val}</a></li>`);
    res.send(listTemplate.replace('{{list}}', list.join('\r\n')));
  });
});

// render example based on jsFiddle github integration
app.get('/*', (req, res) => {
  const requestedPath = req.path;
  const promises = [];
  if (req.path === '/index.umd.js') {
    return readFile(path.join(__dirname, '../build/browser/index.umd.js'))
      .then((file) => res.send(file.toString()));
  }

  const stripped = req.path.substring(1);
  if (examples.indexOf(stripped) === -1) {
    res.status(404);
    res.end();
    return;
  }

  Object.keys(files).forEach((key) => {
    const promiseFn = readFile(path.join(__dirname, requestedPath, files[key]));
    promiseFn.then((res) => {
      filesContent[key] = res.toString();
    });

    promises.push(promiseFn);
  });

  Promise.all(promises).then(() => {
    if (!filesContent.config) {
      res.status(404);
      res.end();
      return;
    }

    const config = yaml.load(filesContent.config);
    let tpl = template + '';
    tpl = tpl.replace('{{title}}', config.name || '')
      .replace('{{content}}', filesContent.index)
      .replace('{{script}}', filesContent.script)
      .replace('{{style}}', filesContent.css || '');

    if (config.resources) {
      let resources = [];

      config.resources.forEach((val) => {
        resources.push(`<script src="${val}"></script>`)
      });

      tpl = tpl.replace('{{headScript}}', resources.join('\r\n'))
    } else {
      tpl = tpl.replace('{{headScript}}', '')
    }

    res.send(tpl);
  }).catch((err) => {
    console.log(err);
    res.status(404);
    res.end();
  });
});

getExamples().then(() => {
  app.listen(4000, () => console.log('Filestack Examples server is listening on http://localhost:4000'))
});
