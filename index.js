const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tf63vau.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.db("admin").command({ ping: 1 });

    const todoCollection = client.db("TodoDB").collection("todo");

    // get todo
    app.get("/todo", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await todoCollection.find(query).toArray();
      res.send(result);
    });

    // get todo by id
    app.get("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await todoCollection.findOne(query);
      res.send(result);
    });

    // add todo
    app.post("/todo", async (req, res) => {
      const todo = req.body;
      const result = await todoCollection.insertOne(todo);
      res.send(result);
    });

    // update todo
    app.put("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateTodo = req.body;
      const updateDoc = {
        $set: {
          title: updateTodo.title,
          priority: updateTodo.priority,
          date: updateTodo.date,
          description: updateTodo.description,
        },
      };
      const result = await todoCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // delete todo
    app.delete("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await todoCollection.deleteOne(query);
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("todo list server is on");
});

app.listen(port);
