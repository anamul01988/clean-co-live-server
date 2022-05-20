const express = require('express')
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

app.use(cors({
    origin: "*",
}));
app.use(express.json());

// const uri = "mongodb+srv://shanto:M9WGKctrmy3gqygv@cluster0.yb1om.mongodb.net/?retryWrites=true&w=majority";
 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yb1om.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    await client.connect();
   const serviceCollection = client.db('cleanCo').collection('service');
   app.get('/get-service', async(req, res)=>{
    const data = await serviceCollection.find({}).toArray();
    // console.log(data)
    res.send(data)

   })

   app.post("/add-service", async (req, res) => {
    const data = req.body;
    const result = await serviceCollection.insertOne(data);
    res.send(result);
  });

  app.put("/update-service/:id", async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const filter = { _id: ObjectId(id) };
    const updateDoc = { $set: data };
    const option = { upsert: true };

    const result = await serviceCollection.updateOne(
      filter,
      updateDoc,
      option
    );

    res.send(result);
  });

  app.delete("/delete-service/:id", async (req, res) => {
    const { id } = req.params;
    const query = { _id: ObjectId(id) };
    const result = await serviceCollection.deleteOne(query);

    res.send(result);
  });

  //* With try catch block

  // app.post("/add-service", async (req, res) => {
  //   try {
  //     const data = req.body;
  //     const result = await servicesCollection.insertOne(data);
  //     res.send({ status: true, result: result });
  //   } catch (error) {
  //     res.send({ status: false, error });
  //   }
  // });
  

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
