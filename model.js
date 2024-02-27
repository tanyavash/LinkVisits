const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema({
        ipAddress: String,
        count: { type: Number, default: 0}
      });
const Click = mongoose.model('Click', clickSchema);
module.exports = Click;
