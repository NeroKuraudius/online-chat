if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.once('open',()=>{
  console.log('MongoDB connected successfully!')
})
db.on('error',(e)=>{
  console.log(e)
})