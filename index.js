
const fs = require('fs'),
      mv = require('mv'),
      path = require('path');

const args = require('minimist')(process.argv.slice(2)),
      log = console.log,
      overwrite = args.clbr,
      sourceDir = args.src,
      targetDir = args.trg;

if(sourceDir && targetDir) {
  parseDirectory(sourceDir);
} else {
  console.error('Missing a required argument.\n\nMake sure to include both --src and --trg');
}

function checkFileExistence(dir, fileName) {
  //assume the file exists until proven wrong
  let result = true;

  try {
    fs.statSync(path.resolve (dir, fileName));
  } catch(err) {
    //if fs.statSync errors, the file doesn't exist
    result = false;
  }

  return result;
}

function parseDirectory(dir) {
  fs.readdir(dir, function(err, list) {
    for(let i = 0; i < list.length; i++) {
      let item = list[i],
          location = path.resolve(dir, item);

      log(item);

      if(fs.lstatSync(location).isDirectory()) {
        parseDirectory(location);
      } else {
        let name = item;

        if(!overwrite) {
          if(checkFileExistence(targetDir, name)) {
            name = renameFile(name);
          }
        }

        mv(location, path.resolve(targetDir, name), { mkdirp: true }, function(err) {
          if(err) {
            console.error(err);
          }
        });
      }
    }
  });
}

function removeExtension(name) {
  let eman = reverse(name),
      ext = eman.substring(0, eman.indexOf('.'));

  return {
    name: reverse(eman.substring(eman.indexOf('.') + 1)),
    extension: reverse(ext)
  };
}

function renameFile(name) {
  let alteredName = removeExtension(name),
      ext = alteredName.extension,
      nameOnly = alteredName.name,
      num = 1,
      numString = '',
      result = '';

  while(checkFileExistence(targetDir, nameOnly.concat(numString, '.', ext))) {
    numString = ' (' + num.toString () + ')';

    num++;
  }

  return nameOnly.concat(numString, '.', ext);
}

function reverse(str) {
  return str.split ('').reverse ().join ('');
}
