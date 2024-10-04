const express = require('express');
const mongodb = require("mongodb").MongoClient;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from 'public' directory

let db, collection;

async function connectToDatabase() {
  const client = await mongodb.connect("mongodb://127.0.0.1:27017/StudentMarks");
  db = client.db("StudentMarks");
  collection = await db.createCollection("Marks");
  console.log("Database and collection created!");
}

connectToDatabase().catch(console.error);

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Insert a document
app.post('/add', async (req, res) => {
  const document = {
    rollNo: parseInt(req.body.rollNo),
    name: req.body.name,
    marks: {
      subject1: parseFloat(req.body.sub1),
      subject2: parseFloat(req.body.sub2),
      subject3: parseFloat(req.body.sub3),
      subject4: parseFloat(req.body.sub4),
      subject5: parseFloat(req.body.sub5),
    }
  };
  await collection.insertOne(document);
  res.redirect('/');
});

// Display all documents
app.get('/display', async (req, res) => {
  const result = await collection.find().toArray();
  res.json(result);
});

// Update a document
app.post('/update', async (req, res) => {
  const subjectKey = `subject${req.body.subject}`;
  await collection.updateOne(
    { rollNo: parseInt(req.body.rollNo) },
    { $set: { [`marks.${subjectKey}`]: parseFloat(req.body.marks) } }
  );
  res.redirect('/');
});

// Delete a document
app.post('/delete', async (req, res) => {
  await collection.deleteOne({ rollNo: parseInt(req.body.rollNo) });
  res.redirect('/');
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
