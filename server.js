'use strict';

const express = require('express')
    , app = express()
    , jadeStatic = require('jade-static');

app.use(jadeStatic(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

app.listen(3001);
