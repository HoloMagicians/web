'use strict';

const express = require('express')
    , app = express()
    , jadeStatic = require('jade-static')
    , JsonHelper = require('./lib/json.js');

app.get('/', (req, res) => {
  JsonHelper(__dirname + '/data/meetups.json', meetups => {
    JsonHelper(__dirname + '/data/members.json', members => {
      res.render('index.jade', { meetups: meetups.meetups, members: members.members });
    });
  });
});

app.use(jadeStatic(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

app.listen(3001);
