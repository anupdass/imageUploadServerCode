const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

const port = process.env.POART || 8000

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rwb1x.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connect error',err)
  const eventsCollection = client.db("volunteer").collection("events");

  app.get('/events',(req,res)=>{
    eventsCollection.find()
    .toArray((err,item)=>{
     res.send(item);
    })
  })

  app.get('/',(req,res)=>{
    res.send('i am working')
  })

  app.post('/addevent',(req,res)=>{
    const newEvent = req.body;
    // console.log(newEvent);

    eventsCollection.insertOne(newEvent)
    .then(result => {
      console.log(result.insertedCount)
      res.send(result.insertedCount>0)
    })
  }) 


  console.log('DataBase Connected');
  // client.close();
});





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})