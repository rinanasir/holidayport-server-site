const express = require('express');
const { MongoClient } = require('mongodb');
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
        const placeCollection = database.collection('places');

        // POST API
        app.post('/places', async (req, res) => {
            const place = req.body;
            console.log('hit the post api', place);

            const result = await placeCollection.insertOne(place);
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