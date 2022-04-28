const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// middle ware
app.use(cors());
app.use(express.json());
// connect to database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hyb1n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    const database = client.db("redOnion");
    const foodCollection = database.collection("foods");
    const orderCollection = database.collection("orders");
    // Query for a movie that has the title 'Back to the Future'
    app.get("/food", async (req, res) => {
      const query = {};
      const cursor = foodCollection.find(query);
      if ((await foodCollection.estimatedDocumentCount()) === 0) {
        console.log("No documents found!");
      }
      const result = await cursor.toArray();
      res.send(result);
    });
    // get food by id
    app.get("/food/:id", async (req, res) => {
      let { id } = req.params;
      try {
        const query = { _id: ObjectId(id) };
        const result = await foodCollection.findOne(query);
        res.send(result);
      } catch (error) {
        res.send({ message: "Not found" });
      }
    });
    app.post("/foodByKeys", async (req, res) => {
      const keys = req.body;
      const ids = keys.map((id) => ObjectId(id));
      const query = { _id: { $in: ids } };
      const cursor = foodCollection.find(query);
      const foods = await cursor.toArray();

      res.send(foods);
    });
    app.post("/order", async (req, res) => {
      const doc = req.body;
      const result = await orderCollection.insertOne(doc);
      res.send(result);
    });
  } finally {
  }
};
run().catch(console.dir);

//
app.get("/", (req, res) => {
  res.send("Hello from red onion!");
});

// app listen
app.listen(port, () => {
  console.log("Server is running on ", port, "...");
});
