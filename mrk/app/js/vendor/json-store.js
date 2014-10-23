/*
*  var store = require('json-store');
*  var root = process.cwd();
*  var db = store(root+'index.json');
*  // post & put
*  db.set('foo', 'bar');
*  db.set('obj', {foo: 'bar'});
*  
*  // get
*  db.get('foo');   
*  db.get('obj').foo*
*
*  // delete
*  db.del('foo');   
*  db.del('obj').foo             
*/

var fs = require('fs');

function Store(path) {
  this.path = path;
  if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
  this.Store = require(path);
}

Store.prototype.get = function(key) {
  if (!key) return clone(this.Store);
  if (!this.Store[key]) return;
  return clone(this.Store[key]);
}

Store.prototype.set = function(key, value) {
  this.Store[key] = clone(value);
  this.save();
}

Store.prototype.del = function(key) {
  delete this.Store[key];
  this.save();
}

Store.prototype.save = function() {
  fs.writeFileSync(this.path, JSON.stringify(this.Store,null,4));
}

function clone(data) {
  return JSON.parse(JSON.stringify(data,null,4));
}

module.exports = function(path) {
  return new Store(path);
}