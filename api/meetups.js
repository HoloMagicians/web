'use strict'

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
    for(let i = 0; i < 3 && i < body.events.length; ++i){
      events.push({
        title: body.events[i].title,
        started_at: body.events[i].started_at,
        event_url: body.events[i].event_url,
        attendees: body.events[i].accepted
      });
    }
    res.send({events: events, more_events: body.events.length > 3});
  });
});

module.exports = router;
