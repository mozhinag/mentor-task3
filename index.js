const express = require('express');
const app = express();

const port = 5001;
const bodyparse = require('body-parser')
const mentorRouter = require('./router/mentor')
const studentRouter = require('./router/student')
app.use(bodyparse.json())
app.use('/mentor',mentorRouter)
app.use('/student',studentRouter)
app.get('/',(req,res)=>{
res.json(`Hello`);
})

app.listen(port, ()=>{
    console.log(`server is running in ${port}`)});