const mongoose = require("mongoose");


const clickSchema = new mongoose.Schema({
    enterlink:{
        link: String,
        //ipAddress: String,
        count: Number
    }
    
  });
  const Click = mongoose.model('Click', clickSchema);
  module.exports = Click;