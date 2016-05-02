'use strict';

const fs = require('fs');

module.exports = function read(path, cb){
  fs.readFile(path, {encoding: 'utf-8'}, (err, data)=>{
    cb(JSON.parse(data));
  });
};
