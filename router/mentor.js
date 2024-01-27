const express = require('express');
const { MongoClient } = require('mongodb');
const DB_URL = process.env.DB_URL;
const router = express.Router();

router.get('/', (req,res)=>{
    res.send('<h1>Hi from mentor</h1>')
})

router.post('/create-mentor',async (req,res)=>{
    try {
        const {mentorName, mentorEmail}=req.body;
        const connection = await MongoClient.connect(DB_URL);
        const db = connection.db('zenclass');
        const mentor = db.collection('mentors').insertOne({
            mentorName: mentorName,
            mentorEmail: mentorEmail,
            students: []
        })
        res.send({
            message: 'Mentor created successfully'
            
        });

    } catch (error) {
        res.status(500).json({
          message : 'Something went wrong'
        })
    }

})

router.get('/mentors', async (req,res)=>{
    try {

        const connection = await MongoClient.connect(DB_URL)
        const db = connection.db('zenclass');
        const mentorsDetails = await db.collection("mentors").find({}).toArray();
        connection.close();
        res.send(mentorsDetails);
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
})
module.exports = router;