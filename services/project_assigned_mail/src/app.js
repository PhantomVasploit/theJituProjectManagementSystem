const express = require('express')
const cron = require('node-cron')
require('dotenv').config()

const { welcomeEmail } = require('./email.service/user.email.service')

const app = express()
const port = process.env.PORT

cron.schedule('*/10 * * * * *', ()=>{
    welcomeEmail()
})

app.listen(port, ()=>{
    console.log('Account verification ');
})


customer_id | first_name | last_name | order_id | order_date
----------+--------------+-----------+----------+------------
1           | John       | Doe       | 1         | 2023-08-01
2           | Jane       | Smith      | 2         | 2023-08-02
3           | Mary       | Johnson    | NULL       | NULL
4           | Peter      | Brown      | NULL       | NULL