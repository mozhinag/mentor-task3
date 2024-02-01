const express = require('express');
const { MongoClient,ObjectId } = require('mongodb');
const DB_URL = process.env.DB_URL;
const router = express.Router();
router.get ('/',(req, res)=>{
    res.send(`<h1> student<h1>`)
})

//Write API to create Student
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
//Write API to Assign a student to Mentor
//Select one mentor and Add multiple Student 
router.post('/student-to-Mentor',async(req,res)=>{
    try {
        const {mentorId,studentId} = req.body;
        const mentorObjectId = new ObjectId(mentorId);
        console.log(mentorObjectId);
        const studentObjectId = new ObjectId(studentId);
        const connection = await MongoClient.connect(DB_URL);
        const db = connection.db("zenclass");
        const mentorsCollection = db.collection("mentors");
        const studentsCollection = db.collection("students");
        const mentor = await mentorsCollection.findOne({ _id: mentorObjectId });
        console.log(mentor);
        const student = await studentsCollection.findOne({ _id: studentObjectId });
        console.log( student);
        if (!mentor || !student) {
          res.status(404).send({ error: "Mentor or student not found" });
          return;
        }
        // UPDATE PARTICULAR STUDENT
        await studentsCollection.updateOne(
          { _id: studentObjectId },
          { $set: { oldMentor: student.newMentor, newMentor: mentor.mentorName } }
        );
        //ASSIGN MENTOR
        await mentorsCollection.updateOne(
          { _id: mentorObjectId },
          { $push: { students: { studentName: student.studentName, studentEmail: student.studentEmail, studentId: studentObjectId } } }
        );
        connection.close();
        res.send({
          success: true,
          message: 'Mentor will be assigned',
          mentorName: mentor.mentorName
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });
    
//A student who has a mentor should not be shown in List
router.get("/students-without-mentors", async (req, res) => {
        try {
          const connection = await MongoClient.connect(DB_URL);
          const db = connection.db("zenclass");
          const studentsData = await db.collection("students").find({
            oldMentor: { $eq: null },
            newMentor: { $eq: null }
          }).toArray();
          const students = studentsData.map((item) => ({
            studentId: item._id.toString(),
            studentName: item.studentName,
            studentEmail: item.studentEmail,
            oldMentor: item.oldMentor,
            newMentor: item.newMentor
          }));
          connection.close();
      
          if (students.length > 0) {
            res.send(students);
          } else {
            res.send({ message: "No students with both oldMentor and currentMentor found" });
          }
        } catch (error) {
          console.log(error);
          res.status(500).send({ error: "Internal Server Error" });
        }
      });


 //Write an API to show the previously assigned mentor for a particular student.
 router.get("/oldmentor-by-student/:studentName", async (req, res) => {
    try {
      const {studentName} = req.params;
      const connection = await MongoClient.connect(DB_URL);
      const db = connection.db("zenclass");
      const studentsCollection = db.collection("students");
      const student = await studentsCollection.findOne({ studentName: studentName });
      if(student.oldMentor === null) {
        res.send({
          message : 'No older mentor for this student'
        })
      }else{
        res.send({ oldMentor: student.oldMentor })
      }
    } catch (error) {
      console.log(error)
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
