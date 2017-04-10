# Flatten Directory structure

This script allows you to move all files in a directory structure into a single target directory.

```node index.js --src=<source_directory> --trg=<target_directory> --clbr```

* Clobbering: if the `clbr` is present, the script will automatically overwrite any existing files in the target directory with the same name as a file being moved from the source directory
