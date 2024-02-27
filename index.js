const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 8000;
const {connectToMongoDB} = require("./connection")
const Click = require('./model');

const connectdb =  connectToMongoDB("mongodb+srv://tanyavashistha11:CEcwznFF0xF3cPTb@cluster0.efboo5h.mongodb.net/")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  try{
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('incoming request', ipAddress);

    //check if document is present with given IP address
    let click = await Click.findOne({ ipAddress });

    //otherwise initialize to 1
    if(!click) {
    click = new Click({ ipAddress, count: 1 });
    console.log(click);
       await click.save();
      }
    
    //if document is present , increment the count 
    else{ 
      click.count++;
    }
    
    //save the updated document
      await click.save();
    console.log('Count incremented for IP address:', ipAddress);

     next();
  }
  catch (error){
    console.error('error incrementing:' , error);
    res.status(500).json({ error: 'internal server error'});
  }
});

app.get('/clicks', async (req, res) => {
  try{
    //retreiving the IP address
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    console.log(`Client IP address: ${ipAddress}`);
    //finds document in database with given IP address
    const click = await Click.findOne({ ipAddress });
    //count as same in document or otherwise 0 
    res.json({ count: click ? click.count : 0 });
  }
  catch (error) {
    console.error(' Error fetching:' , error);
    res.status(500).json({ error: 'internal server error' });
  }
});
app.listen( PORT, ()=> console.log(`server started at: ${PORT}`))
