// node_module requires
const colors = require('colors'),
      fs = require('fs'),
      mv = require('mv'),
      path = require('path'),
      args = require('minimist')(process.argv.slice(2)),
      // local constants
      log_error = require('console').error,
      overwrite = args.clbr,
      sourceDir = args.src,
      targetDir = args.trg;

switch(true) {
  case sourceDir && targetDir:
    parseDirectory(sourceDir);
    break;
  default:
    error(new Error('Missing a required argument. Make sure to include both --src and --trg'));
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

function error(...err) {
  if(err) {
    log_error(colors.red(`\n${err.toString()}\n`));
  }
}

function parseDirectory(dir) {
  fs.readdir(dir, function(err, list) {
    for(let i = 0; i < list.length; i++) {
      const item = list[i],
            location = path.resolve(dir, item);

      if(fs.lstatSync(location).isDirectory()) {
        parseDirectory(location);
      } else {
        let name = item;

        name = !overwrite ? renameFile(name) : name;

        mv(location, path.resolve(targetDir, name), {
          mkdirp: true
        }, error(err));
      }
    }
  });
}

function removeExtension(name) {
  const eman = reverse(name);

  return {
    name: reverse(eman.substring(eman.indexOf('.') + 1)),
    extension: reverse(eman.substring(0, eman.indexOf('.') + 1))
  };
}

function renameFile(name) {
  const alteredName = removeExtension(name);
  let newName = name,
      num = 1;

  while(checkFileExistence(targetDir, newName)) {
    newName = `${alteredName.name} (${num.toString()})${alteredName.extension}`;

    num++;
  }

  return newName;
}

function reverse(str) {
  return str.split('').reverse().join('');
}
