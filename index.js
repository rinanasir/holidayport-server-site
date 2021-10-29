const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()

const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zxert.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('connected to database');
        const database = client.db('holidayport');
        const placesCollection = database.collection('places');

        // GET API
        app.get('/places', async (req, res) => {
            const cursor = placesCollection.find({});
            const places = await cursor.toArray();
            res.send(places);
        });

        // GET Single Place
        app.get('/places/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific place', id);
            const query = { _id: ObjectId(id) };
            const place = await placesCollection.findOne(query);
            res.json(place);
        })

        // POST API
        app.post('/places', async (req, res) => {
            const place = req.body;
            console.log('hit the post api', place);

            const result = await placesCollection.insertOne(place);
            console.log(result);
            res.send(result);

        });
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Holiday Server');
});

app.listen(port, () => {
    console.log('Running Holiday Server on port', port);
})