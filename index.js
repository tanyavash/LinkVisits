const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 8000;
const {connectToMongoDB} = require("./connection")



const connectdb =  connectToMongoDB("mongodb+srv://tanya:E9KjNT3cHEeYoz2v@cluster0.hgmqhct.mongodb.net/");


// Schema for click data
const clickSchema = new mongoose.Schema({
  link: String,
  ipAddress: String
});
const Click = mongoose.model('Click', clickSchema);

// Middleware to extract IP address
const getClientIP = (req) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};

// Endpoint to track clicks
app.get('/track-click', (req, res) => {
  const link = req.query.link;
  const ipAddress = getClientIP(req);

  if (link) {
    const newClick = new Click({ link, ipAddress });
    newClick.save()
      .then(() => {
        res.json({ success: true, message: 'Click tracked!' });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error tracking click' });
      });
  } else {
    res.status(400).json({ success: false, message: 'Link parameter is missing' });
  }
});

// Endpoint to get click count for a link
app.get('/click-count', (req, res) => {
  const link = req.query.link;
  if (link) {
    Click.countDocuments({ link }, (err, count) => {
      if (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error getting click count' });
      } else {
        res.json({ link, count });
      }
    });
  } else {
    res.status(400).json({ success: false, message: 'Link parameter is missing' });
  }
});


app.listen( PORT, ()=> console.log(`server started at: ${PORT}`))
