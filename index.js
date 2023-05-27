const express = require("express");
const cors = require("cors");
const corsConfig = {
  origin: "*",
  credentials: "true",
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}
const app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
// app.use(cors());
app.options("", cors(corsConfig))
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_password}@cluster0.03ostmu.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://car-toys:THqqFxGj3tQ1W41N@cluster0.03ostmu.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const toysCollection = client.db("carToys").collection("toys");
    // const db = client.db("carToys");
    // const toysCollection = db.collection("toys");

    app.get('/toys', async(req, res)=>{
        const result = await toysCollection.find({}).toArray()
        res.send(result)
    })


    // post toys to server
    app.get('/mytoys', async(req, res) =>{
      let query = {}
      // console.log(req.query)
      if(req.query?.sellerEmail){
        query = {sellerEmail: req.query.sellerEmail}
      }
      const result = await toysCollection.find(query).toArray()
      // console.log(result)
      res.send(result)
    })

    app.post('/toys', async(req, res) =>{
      const toys = req.body;
      // console.log(toys)
      const result = await toysCollection.insertOne(toys)
      res.send(result)
    })

    // load single data
    app.get('/toys/:id', async(req, res)=>{
     const id = req.params.id;
     const query = {_id : new ObjectId(id)}
     const result = await toysCollection.findOne(query)
     res.send(result)
    })


    // car data updated
    app.put('/toys/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id) }
      const options ={upset: true}
      const updateCarInfo = req.body;
      const toys ={
        $set: {
          toyName: updateCarInfo.toyName, 
          subCategory: updateCarInfo.subCategory, 
          sellerName: updateCarInfo.sellerName, 
          sellerEmail: updateCarInfo.sellerEmail, 
          rating: updateCarInfo.rating, 
          quantity: updateCarInfo.quantity, 
          price: updateCarInfo.price, 
          details: updateCarInfo.details
        }
      }
      const result = await toysCollection.updateOne(filter, toys, options)
      res.send(result)
    })


    // delete a car toy
    app.delete('/toys/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await toysCollection.deleteOne(query);
      res.send(result);
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('hello world')
})


app.listen( process.env.PORT || 5000, () => {
  console.log("server is running on port 5000");
});



