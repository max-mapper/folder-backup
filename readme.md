# folder-backup

[![NPM](https://nodei.co/npm/folder-backup.png)](https://nodei.co/npm/folder-backup/)

Easily pack and extract folders as tarballs, for web servers or local filesystem usage.

```
var fbackup = require('folder-backup')
```

##API

### `fbackup.clone(remoteURL, options, cb)`

makes HTTP request to `remoteURL` (which should be `fbackup.serve` and/or the .tar.gz of a `fbackup.pack`) and unpacks into `options.path`. default path is `process.cwd()`

you can also specify `options.showProgress` as either `true` or `false` (default is `false`) if you want to print progress messages to stdout

### `fbackup.unpack(target, cb)`

returns a writable stream that ungzips and unpacks data into `target`. calls optional `cb` when done with `(err)`

### `fbackup.serve(dir, httpResponse, [cb])`

function for mounting this module in an http API. streams `fbackup.pack` of `dir` to the `httpResponse`, calls optional `cb` when done

### `fbackup.pack`

an instance of the `dir-tar-stream` module

## license

BSD
