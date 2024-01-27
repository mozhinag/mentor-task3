const express = require('express');
const app = express();
const bodyparser = require('body-parser')
const port = 5001;
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv').config();
const DB_URL = process.env.DB_URL;

const mentorRouter = require('./router/mentor')
const studentRouter = require('./router/student')
app.use(bodyparser.json())
app.use('/mentor',mentorRouter)
app.use('/student',studentRouter)
app.get('/',(req,res)=>{
res.json(`Hello`);
})

app.listen(port, ()=>{
    console.log(`server is running in ${port}`)});