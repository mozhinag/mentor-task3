const express = require('express');
const { MongoClient,ObjectId } = require('mongodb');
const DB_URL = process.env.DB_URL;
const router = express.Router();

router.get('/', (req,res)=>{
<<<<<<< HEAD
    res.send('<h1>Hello</h1>')
=======
    res.send('<h1> mentor</h1>')
>>>>>>> dd601596c1d2a9d26a488188204b5e4cba1aa10d
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
//Write API to Assign or Change Mentor for particular Student
//Select One Student and Assign one Mentor
router.post("/change-mentor", async (req, res) => {
    try {
      const {mentorId,studentId,newMentor:newcurrentMentor}=req.body
      const mentorObjectId = new ObjectId(mentorId);
      const studentObjectId = new ObjectId(studentId);
      const connection = await MongoClient.connect(DB_URL);
      const db = connection.db("zenclass");
      const mentorsCollection = db.collection("mentors");
      const studentsCollection = db.collection("students");
      const mentor = await mentorsCollection.findOne({ _id: mentorObjectId });
      const student = await studentsCollection.findOne({ _id: studentObjectId });
      if (!mentor || !student) {
        res.status(404).send({ error: "Mentor or student not found" });
        return;
      }
      await studentsCollection.updateOne(
        { _id: studentObjectId },
        { $set: { oldMentor: student.newMentor, newMentor: newcurrentMentor } }
      );
      await mentorsCollection.updateOne(
        { _id: mentorObjectId },
        { $push: { students: { studentName: student.studentName, studentEmail: student.studentEmail, studentId: studentObjectId } } }
      );
      connection.close();
      res.send({ success: true, message : 'mentor will be changed for this student' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

//Write API to show all students for a particular mentor
router.get("/:mentorName/students", async (req, res) => {

    try {
      const mentorName = req.params.mentorName;
      const connection = await MongoClient.connect(DB_URL);
      const db = connection.db("zenclass");
      const mentorsCollection = db.collection("mentors");
      const mentor = await mentorsCollection.findOne({mentorName:mentorName});
  
      res.send(mentor.students)
    } catch (error) {
      console.log(error)
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
