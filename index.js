const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
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
        const bookingCollection = database.collection("booking");

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

        //Get Service by id
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        //Post booking
        app.post('/booking', async (req, res) => {
            const booking = req.body.booking;
            const result = await bookingCollection.insertOne(booking);
            res.send(result.insertedId);
        })

        //get booking by user id
        app.get('/booking/:uid', async (req, res) => {
            const uid = req.params.uid;
            const query = { userId: { $eq: uid } };
            const result = bookingCollection.find(query);
            const booking = await result.toArray();
            if ((await result.count()) > 0) {
                res.send(booking);
            }

        })

        //get all booking
        app.get('/booking', async (req, res) => {
            const result = await bookingCollection.find({}).toArray();
            res.send(result);
        })

        //Delete Service
        app.delete('/service/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.json(result.deletedCount)
        })

        //approved Service
        app.post('/service/approved/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateInfo = {
                $set: {
                    status: 'Approved'
                },
            };

            const result = await bookingCollection.updateOne(filter, updateInfo, options);
            res.json(result.modifiedCount);

        })

    }
    finally {

    }
}
run().catch(console.dir)

app.listen(port, console.log("server running"));