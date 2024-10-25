const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
holidayTitle:{
    type:String,
    required:true
},
date:{
    type:String,
    required:true
},
type:{
    type:String,
    required:true
},
location:{
    type:String,
    required:true
}
})

module.exports= mongoose.model("holiday",holidaySchema);

