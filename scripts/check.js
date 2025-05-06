const { runOnEachFile, browserBuildDir } = require('./utils');
const Path = require('path');

const requiredFiles = ['filestack.esm.js', 'filestack.esm.js.map', 'filestack.min.js', 'filestack.min.js.map', 'filestack.umd.js', 'filestack.umd.js.map', 'manifest.json'];


const compare = (first, second) => second.every((e)=> first.includes(e));

(async () => {
  const files = await runOnEachFile(browserBuildDir, {}, (f) => Path.basename(f));
  requiredFiles.sort();
  files.sort();

  console.log('Required files: ', requiredFiles.join(', '));
  console.log('Builded files: ', files.join(', '));

  if (compare(files, requiredFiles)) {
    return console.log('All needed files are included into build!!!');
  }

  throw new Error('Missing build files:')
})()

