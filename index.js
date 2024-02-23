const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 8000;
const {connectToMongoDB} = require("./connection")
const Click = require('./model');

const connectdb =  connectToMongoDB("mongodb+srv://tanyavashistha11:CEcwznFF0xF3cPTb@cluster0.efboo5h.mongodb.net/");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//extract IP address
const getClientIP = (req) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};

// Endpoint to track clicks
app.post('/track', async (req, res) => {
    const link = req.body.link;
    const ipAddress = getClientIP(req);
  
    try 
    {
      if (!link) return res.status(400).json({ error: 'link not found' });

  
      const newClick = new Click({ link, ipAddress });
      await newClick.save();
  
      return res.json({ success: true, message: 'Click tracked' });
    } 
    catch (err)
    {
      console.error(err);
      res.status(400).json({ error: 'Error- not tracked' });
    }
  });
  


// Endpoint to get click count for a link
app.post('/count', async (req, res) => {
    const link = req.body.link;
  
    if (!link) {
      return res.status(400).json({ error: 'Link missing' });
    }
  
    try {
      const count = await Click.countDocuments({ link });
      res.json({ link, count });
    } 
    catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Error getting click count' });
    }
  });

    // Endpoint to visit a link
app.post('/visit', async (req, res) => {
    const link = req.body.link || req.query.link;

    try {
        if (!link) {
            return res.status(400).json({ error: 'Link missing in request body or query parameters' });
        }

        // Update the count for the link in your database
        await Click.findOneAndUpdate({ link }, { $inc: { count: 1 } });

        return res.json({ success: true, message: 'Visit tracked' });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: 'Error tracking visit' });
    }
});


app.listen( PORT, ()=> console.log(`server started at: ${PORT}`))
