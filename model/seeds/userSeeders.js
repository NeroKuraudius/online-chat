if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const User = require('../User')
const bcrypt = require('bcryptjs')
const defaultUsers = [
  {
    account:'testUser1@test.com',
    password: bcrypt.hash('12345678',12),
    name: '測試A'
  },
  {
    account:'testUser2@test.com',
    password: bcrypt.hash('abc987',12),
    name: '測試B'
  }
]

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.once('open',async()=>{
  await User.create(defaultUsers)
  console.log('userSeeders running finished!')
  db.close()
  process.exit()
})
db.on('error',(e)=>{
  console.log(e)
})