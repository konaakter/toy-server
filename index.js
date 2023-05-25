const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000

app.use(cors())




app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!')
})





const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ah3a7qz.mongodb.net/?retryWrites=true&w=majority`;

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
    //await client.connect();


    const toycollectoin = client.db("toybd").collection("toy");

    app.get('/toy', async (req, res) => {
      console.log(req.query.subcategory)

      let query = {};
      if (req.query?.subcategory) {
        query = { subcategory: req.query.subcategory }
      }
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const getresult = await toycollectoin.find(query).toArray();
      res.send(getresult)
    });

    app.get('/email', async (req, res) => {
      console.log(req.query.subcategory)

      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await toycollectoin.find(query).toArray();
      res.send(result)
    });

    app.post('/toy', async (req, res) => {
      const addtoy = req.body;
      console.log(addtoy);
      const addtoyresult = await toycollectoin.insertOne(addtoy);
      res.send(addtoyresult);
    });

    app.get('/alltoy', async (req, res) => {

      const options = {
        
        projection: { name: 1, subcategory: 1, price: 1, quantity: 1 },
    };
      const alltoyresult = await toycollectoin.find( ).limit(20).toArray();
      res.send(alltoyresult);
    })

    app.get('/toy/:id', async (req, res) => {
      const id = req.params.id
      console.log(id)
      const query = {_id: new ObjectId(id) };
      const cursor = await toycollectoin.findOne(query );
      res.send(cursor );
  })

  app.put('/toy/:id', async (req, res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id) };
    const upadate = req.body
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        quantity:upadate.quantity,
        price: upadate.price,
        details: upadate.details
      },
    };
    const updateresult = await toycollectoin.updateOne(query, updateDoc, options);
    res.send(updateresult)
  } )



    app.delete('/toy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toycollectoin.deleteOne(query);
      res.send(result);
    })

    const indexKeys = {name: 1};
    const indexOptions ={name: "serchName"}
    const result = await toycollectoin.createIndex(indexKeys, indexOptions)
    app.get('/toy-serch/:text', async (req, res) => {
        const text= req.params.text;
        const result = await toycollectoin.find({name: { $regex: text, $options: "i"}}).toArray();
        res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})