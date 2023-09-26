const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
  account:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  name:{
    type:String,
    required:true
  },
  createAt:{
    type:Date,
    default:Date.now
  }
})

module.exports = mongoose.model('User',userSchema)