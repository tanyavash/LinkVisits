const mongoose = require("mongoose");

// const Visit = mongoose.model('Visit', {
//     ipAddress: String,
//     timestamp: { type: Date, default: Date.now }
//   });
// module.exports = Visit;
const clickSchema = new mongoose.Schema({
    count:{
        type: Number, default: 0
    }
  });
const Click = mongoose.model('Click', clickSchema);
module.exports = Click
