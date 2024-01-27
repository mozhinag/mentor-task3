const express = require('express');
const { MongoClient } = require('mongodb');
const DB_URL = process.env.DB_URL;
const router = express.Router();
router.get ('/',(req, res)=>{
    res.send(`<h1> hello student<h1>`)
})
router.post('/create-student',async (req,res)=>{
    try {
        const {studentName, studentEmail}=req.body;
        const connection = await MongoClient.connect(DB_URL);
        const db = connection.db('zenclass');
        const student = db.collection('students').insertOne({
            studentName: studentName,
            studentEmail: studentEmail,
            oldMentor: null,
            newMentor: null
        })
        res.send({
            message: 'Student created successfully'
            
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
          message : 'Something went wrong'
        })
    }

})

router.get('/students', async (req,res)=>{
    try {

        const connection = await MongoClient.connect(DB_URL)
        const db = connection.db('zenclass');
        const mentorsDetails = await db.collection("students").find({}).toArray();
        connection.close();
        res.send(mentorsDetails);
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
})
module.exports = router;