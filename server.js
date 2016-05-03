'use strict';

const express = require('express')
    , jadeStatic = require('jade-static')
    , JsonHelper = require('./lib/json.js')
    , Q = require('q')
    , cluster = require('cluster');

if(cluster.isMaster){
  let numCPUs = require('os').cpus().length;
  for(let i = 0; i < numCPUs; ++i){
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    cluster.fork();
  });
}else{
  const data = ['/data/meetups.json', '/data/members.json'];
  const app = express()

  app.get('/', (req, res) => {
    Q.all(data.map(s => Q.nfcall(JsonHelper, __dirname + s)))
     .then(d => {
       res.render('index.jade', { meetups: d[0].meetups, members: d[1].members });
     });
  });
  
  app.use('/api', require('./api/meetups.js'));
  //app.use(jadeStatic(__dirname + '/views'));
  app.use(express.static(__dirname + '/public'));
  
  app.listen(3001);
}
