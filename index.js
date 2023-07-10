// route
const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


// middleWare

app.use(cors())
app.use(express.json())


console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ehog8eb.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();


    const serviceCollection = client.db('carService').collection('center')
    const confirmOrders = client.db('carService').collection('orders')

    app.get('/service', async(req,res) => {
        const cursor = serviceCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })



    app.get('/service/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}

      const options = {
       
        projection: { title: 1, price: 1, service_id: 1, img: 1 },
      };

      const result = await serviceCollection.findOne(query , options)
      res.send(result)
    })


// orders
app.get('/orders', async(req , res) => {
  console.log(req.query.email)
  let query = {};
  if (req.query?.email) {
    query = {email: req.query.email}
  }
  const result = await confirmOrders.find(query).toArray()
  res.send(result);
  
})


    app.post('/orders', async(req , res) => {
      const orders = req.body;
      console.log(orders)
      const result = await confirmOrders.insertOne(orders);
      res.send(result)

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



app.get('/', (req, res) => {
    res.send("hello world 11")
})

app.listen(port, () => {
    console.log('car doctor server running')
})