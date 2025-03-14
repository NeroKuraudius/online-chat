if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const User = require('../User')
const bcrypt = require('bcryptjs')
const defaultUsers = [
  {
    account:'testUser1@test.com',
    password: bcrypt.hashSync('12345678',12),
    name: '測試A'
  },
  {
    account:'testUser2@test.com',
    password: bcrypt.hashSync('abc987',12),
    name: '測試B'
  },
  {
    account: 'testUser4@test.com',
    password: bcrypt.hashSync('srz7htx'),
    name: '測試D'
  }
]

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.once('open',async()=>{
  try{
    await User.create(defaultUsers)
    console.log('userSeeders running finished!')
    db.close()
    process.exit()
  }catch(err){
    console.log('userSeeders running failed:',err)
  }
})
db.on('error',(e)=>{
  console.log(e)
})