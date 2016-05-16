'use strict'

const viewItems = 5;
const fs = require('fs')
    , path = require('path')
    , cheerio = require('cheerio');

const express = require('express')
    , router = express.Router()
    , request = require('request');

const SeriesId = 2053; // hololens.connpass.com

router.get('/meetups', (req, res) => {
  let options = {
    url: `http://connpass.com/api/v1/event/?order=2&series_id=${SeriesId}`,
    json: true,
    headers: {
      'User-Agent': 'holomagicians'
    }
  }
  request(options, (err, resp, body) => {
    let events = [];
    for(let i = 0; i < viewItems && i < body.events.length; ++i){
      events.push({
        id: body.events[i].event_id,
        title: body.events[i].title,
        started_at: body.events[i].started_at,
        event_url: body.events[i].event_url,
        attendees: body.events[i].accepted
      });
    }
    res.send({events: events, more_events: body.events.length > viewItems});
  });
});

router.get('/meetups/thumbnail/:id', (req, res) => {
  // lookup cache
  res.set('Content-Type', 'image/png');
  let cache = `${__dirname}/../cache/${req.params.id}.png`;
  if(fs.existsSync(cache)){
    let file = fs.createReadStream(cache);
    return file.on('open', () => file.pipe(res));
  }
  // cache not hit
  fs.closeSync(fs.openSync(cache, 'w'));
  let stream = fs.createWriteStream(cache);
  let options = {
    uri: `http://connpass.com/event/${req.params.id}`,
    headers: {
      'User-Agent': 'holomagicians'
    }
  }
  request(options, (err, resp, body) => {
    let $ = cheerio.load(body);
    let thumbnail = $('.thumbnail').parent().eq(0).attr('href');
    options.uri = thumbnail;
    stream
      .on('finish', () => {
        let file = fs.createReadStream(cache);
        return file.on('open', () => file.pipe(res));
      })
    request(options)
      .on('error', (err) => res.sendStatus(503))
      .pipe(stream);
  });
});

module.exports = router;
