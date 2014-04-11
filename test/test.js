var http = require('http')
var test = require('tape')
var path = require('path')
var rimraf = require('rimraf')
var fs = require('fs')
var fbackup = require('../')

test('basic', function(t) {
  var target = path.join(__dirname, 'target')
  rimraf(target, function(err) {
    var server = serve()
    server.listen(8080, function(err) {
      if (err) throw err
      fbackup.clone('http://localhost:8080', { path: target }, function(err) {
        t.notOk(err, 'no clone err')
        t.ok(fs.existsSync(path.join(target, 'test.js')), 'test.js exists after clone')
        rimraf(target, function(err) {
          if (err) throw(err)
          t.end()
          server.close()
        })
      })
    })
  })
})

function serve() {
  return http.createServer(function(req, res) {
    fbackup.serve(__dirname, res, function(err) {})
  })
}