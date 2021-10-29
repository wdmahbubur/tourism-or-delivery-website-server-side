const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

const uri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.ni4ot.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send("Server running");
})


async function run() {
    try {
        await client.connect();

        const database = client.db("tourism");
        const serviceCollection = database.collection("services");

        //Add new service
        app.post('/service', async (req, res) => {
            const service = req.body.service;
            const result = await serviceCollection.insertOne(service)
            res.send(result.insertedId)
        })

        //Get Service
        app.get('/services', async (req, res) => {
            const services = await serviceCollection.find({}).toArray();
            res.send(services);
        })

    }
    finally {

    }
}
run().catch(console.dir)

app.listen(port, console.log("server running"));