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
    //req.clientIp = ipAddress;

    await Click.create({
        ipAddress
    });

    // next();

    let click = await Click.findOne({ ipAddress });
    // // console.log(click);
    // // console.log(typeof(click));  

    if(!click) {
    // //   //console.log('Creating new document for IP address:', ipAddress);
    click = new Click({ ipAddress: req.clientIp, count: 1 });
    // //   await click.save();
      }

    // // //console.log('Updating document for IP address:', ipAddress);
    else{ 
      click.count++;
    }
    

      await click.save();
    console.log('Count incremented for IP address:', ipAddress);

    //  req.clientIp = ipAddress;
     next();
  }
  catch (error){
    console.error('error incrementing:' , error);
    res.status(500).json({ error: 'internal server error'});
  }
});


app.get('/clicks', async (req, res) => {
  try{
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    //const clientIp = req.clientIp;
    console.log(`Client IP address: ${ipAddress}`);

    const click = await Click.findOne({ ipAddress });
    res.json({ count: click ? click.count : 0 });
  }
  catch (error) {
    console.error(' Error fetching:' , error);
    res.status(500).json({ error: 'internal server error' });
  }
});
app.listen( PORT, ()=> console.log(`server started at: ${PORT}`))




// // Middleware to count visits
// app.use(async (req, res, next) => {
//   const visit = new Visit({ ipAddress: req.ip });
//   await visit.save();
//   next();
// });

// // Route to get total visit count
// app.get('/visits', async (req, res) => {
//   try {
//     const totalCount = await Visit.countDocuments();
//     res.json({ totalVisits: totalCount });
//   } catch (error) {
//     console.error('Error fetching visit count:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });




// //extract IP address
// const getClientIP = (req) => {
// return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
// };




// app.get('/track', async (req, res) => {
//     // Get the client IP address
//     const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
//     try {
//         // Find the visitor record for the given IP address
//         let visitor = await Visitor.findOne({ ip });
  
//         // If the visitor record does not exist, create a new one
//         if (!visitor) {
//             visitor = new Visitor({ ip, count: 1 });
//         } else {
//             // Increment the visit count
//             visitor.count++;
//         }

//         // Save the visitor record
//         await visitor.save();

//         // Send the response
//         res.send(`Visit count for IP address ${ip}: ${visitor.count}`);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });


// // Endpoint to track clicks
// app.post('/track', async (req, res) => {
//     const link = req.body.link;
//     const ipAddress = getClientIP(req);
  
//     try 
//     {
//       if (!link) return res.status(400).json({ error: 'link not found' });

  
//       const newClick = new Click({ link, ipAddress });
//       await newClick.save();
  
//       return res.json({ success: true, message: 'Click tracked' });
//     } 
//     catch (err)
//     {
//       console.error(err);
//       res.status(400).json({ error: 'Error- not tracked' });
//     }
//   });
  


// // Endpoint to get click count for a link
// app.post('/count', async (req, res) => {
//     const link = req.body.link;
  
//     if (!link) {
//       return res.status(400).json({ error: 'Link missing' });
//     }
  
//     try {
//       const count = await Click.countDocuments({ link });
//       res.json({ link, count });
//     } 
//     catch (err) {
//       console.error(err);
//       res.status(400).json({ error: 'Error getting click count' });
//     }
//   });

//     // Endpoint to visit a link
// app.post('/visit', async (req, res) => {
//     const link = req.body.link || req.query.link;

//     try {
//         if (!link) {
//             return res.status(400).json({ error: 'Link missing in request body or query parameters' });
//         }

//         // Update the count for the link in your database
//         await Click.findOneAndUpdate({ link }, { $inc: { count: 1 } });

//         return res.json({ success: true, message: 'Visit tracked' });
//     } catch (err) {
//         console.error(err);
//         return res.status(400).json({ error: 'Error tracking visit' });
//     }
// });


