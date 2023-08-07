const express = require('express')
const cron = require('node-cron')
require('dotenv').config()

const app = express()
const port = process.env.PORT


app.listen(port, ()=>{
    console.log('Account verification ');
})