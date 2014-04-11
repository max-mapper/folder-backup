var fs = require('fs')
var path = require('path')
var tar = require('tar-fs')
var ProgressBar = require('progress')
var extend = require('extend')
var request = require('request')
var zlib = require('zlib')

function noop(){}

module.exports.pack = tar.pack
module.exports.unpack = tar.extract
module.exports.serve = serve
module.exports.clone = clone

function clone(remote, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = undefined
  }
  
  if (!cb) cb = noop
  if (!options) options = {}
  
  var defaults = {
    path: process.cwd(),
    showProgress: false
  }
  
  options = extend({}, defaults, options)
  
  var targz = request(remote)
  var gunzip = zlib.createGunzip()
    
  var unpackStream = tar.extract(options.path)
  
  unpackStream.on('finish', cb)
  
  targz.pipe(gunzip).pipe(unpackStream)
  
  if (options.showProgress) {
    var bar
    
    targz.on('response', function(r) {
      var pending = +r.headers['x-file-count']
      bar = new ProgressBar('  [:bar] :elapseds elapsed, eta :etas', {
        width: 20,
        total: pending
      })
    })
    
    unpackStream.on('entry', function(entry) {
      if (entry.type === 'file') bar.tick()
    })
  }
  
  return unpackStream
}

function serve(dir, httpResponse, cb) {
  fs.readdir(dir, function(err, files) {
    if (err) return cb(err)
    var packStream = tar.pack(dir)
    packStream.on('error', function() {
      if (err) {
        httpResponse.statusCode = 500
        httpResponse.end(err.toString())
      }      
    })
    httpResponse.setHeader('x-file-count', files.length)
    var gzip = zlib.createGzip()
    packStream.pipe(gzip).pipe(httpResponse)
    if (cb) httpResponse.on('end', cb)
  })
}