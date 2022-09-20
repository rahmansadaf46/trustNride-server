const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const fileUpload = require('express-fileupload');
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c9qgdog.mongodb.net/?retryWrites=true&w=majority`;
const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('image'));
app.use(fileUpload());

const port = 4200;

app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const orderCollection = client.db("trustNRide").collection("allOrder");
    const itemCollection = client.db("trustNRide").collection("allItem");
    const userCollection = client.db("trustNRide").collection("allUser");
    const areaCollection = client.db("trustNRide").collection("allArea");
    const garageCollection = client.db("trustNRide").collection("allGarage");
    const serviceCollection = client.db("trustNRide").collection("allService");
    //garage
    app.post('/addGarage', (req, res) => {
        const file = req.files.file;
        const image = req.files.file.name;
        const title = req.body.title;
        const location = req.body.area;
        const status = req.body.status;
        const user = req.body.user;
        const address = req.body.address;
        const mobile = req.body.mobile;
        const description = req.body.description;
        const facebook = req.body.facebook;
        const coords = req.body.coords;

        const area = location.split(',')
        file.mv(`${__dirname}/image/garage/${file.name}`, err => {
            if (err) {
                return res.status(500).send({ msg: 'Failed to upload Image' });
            }
        })

        garageCollection.insertOne({
            title, status, user, area, image, address, mobile, description, facebook, coords
        })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    app.patch('/updateGarage/:id', (req, res) => {
        const title = req.body.data.title;
        const area = req.body.data.area;
        const user = req.body.data.user;
        const address = req.body.data.address;
        const mobile = req.body.data.mobile;
        const description = req.body.data.description;
        const facebook = req.body.data.facebook;
        const coords = req.body.data.coords;
        garageCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: {
                    title: title, area: area, user: user, address: address, mobile: mobile,
                    description: description, facebook: facebook, coords: coords
                }
            })
            .then(result => {
                res.send(result.matchedCount > 0);
            })
    })
    app.get('/garages', (req, res) => {
        garageCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.get('/garageProfile/:id', (req, res) => {
        // console.log(req.params.user)
        garageCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                // console.log(documents[0])
                res.send(documents[0]);
            })
    })
    app.post('/garageUser', (req, res) => {
        const user = req.body;
        // console.log(req.body)
        garageCollection.find({ user: user.user })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.delete('/deleteGarage/:id', (req, res) => {
        garageCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
                // console.log(res);
            })
    })

    //item
    app.post('/addItem', (req, res) => {
        const file = req.files.file;
        const image = req.files.file.name;
        const title = req.body.title;
        const price = req.body.price;
        const category = req.body.category;
        const description = req.body.description;
        const shortDescription = req.body.shortDescription;

        file.mv(`${__dirname}/image/item/${file.name}`, err => {
            if (err) {
                return res.status(500).send({ msg: 'Failed to upload Image' });
            }
        })

        itemCollection.insertOne({ title, price, category, description, shortDescription, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    app.patch('/updateItem/:id', (req, res) => {
        const title = req.body.data.title;
        const price = req.body.data.price;
        const category = req.body.data.category;
        const description = req.body.data.description;
        const shortDescription = req.body.data.shortDescription;
        itemCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: {
                    title: title, price: price, category: category, description: description, shortDescription: shortDescription
                }
            })
            .then(result => {
                res.send(result.matchedCount > 0);
            })
    })
    app.get('/items', (req, res) => {
        itemCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.delete('/deleteItem/:id', (req, res) => {
        itemCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
                // console.log(res);
            })
    })
    app.get('/item/:id', (req, res) => {
        // console.log(req.params.user)
        itemCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                // console.log(documents[0])
                res.send(documents[0]);
            })
    })
    //area
    app.post('/addArea', (req, res) => {
        const area = req.body;
        areaCollection.insertOne(area)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    app.get('/areas', (req, res) => {
        areaCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.delete('/deleteArea/:id', (req, res) => {
        areaCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
                // console.log(res);
            })
    })
    //service
    app.post('/addService', (req, res) => {
        const title = req.body.data.title;
        const description = req.body.data.description;
        const rate = req.body.data.rate;
        const garageId = req.body.data.garageId;
        // console.log(req.body)
        serviceCollection.insertOne({ title, description, rate, garageId })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    app.get('/service/:id', (req, res) => {
        serviceCollection.find({ garageId: req.params.id })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/serviceDetails/:id', (req, res) => {
        serviceCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })
    app.patch('/updateService/:id', (req, res) => {
        serviceCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: req.body.data,
            })
            .then(result => {
                res.send(result.matchedCount > 0);
            })
    })
    app.delete('/deleteService/:id', (req, res) => {
        serviceCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
                // console.log(res);
            })
    })
    // app.get('/areas', (req, res) => {
    //     areaCollection.find({})
    //         .toArray((err, documents) => {
    //             res.send(documents);
    //         })
    // })

    //order
    app.post('/addOrder', (req, res) => {
        const order = req.body;
        // console.log(order);
        orderCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    app.get('/allOrder', (req, res) => {
        orderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    // app.get('/allOrder', (req, res) => {
    //     orderCollection.find({})
    //         .toArray((err, documents) => {
    //             res.send(documents);
    //         })
    // })

    app.post('/garageOrder', (req, res) => {
        const email = req.body.email;
        orderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents.filter(data => data.finalData.garageEmail === email));
            })
    })
    app.patch('/updateOrder/:id', (req, res) => {
        orderCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: {
                    finalData: req.body
                },
            })
            .then(result => {
                res.send(result.matchedCount > 0);
            })
    })

    app.patch('/updateAmount/:id', (req, res) => {
        orderCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: {
                    finalData: req.body
                },
            })
            .then(result => {
                res.send(result.matchedCount > 0);
            })
    })



    //user
    app.post('/addUser', (req, res) => {
        const user = req.body;
        userCollection.insertOne(user)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    app.get('/users', (req, res) => {
        userCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })




    // app.get('/students/:department/:roll', (req, res) => {
    //     studentCollection.find({ roll: req.params.roll, department: req.params.department })
    //         .toArray((err, documents) => {
    //             res.send(documents[0]);
    //         })
    // })

    // app.post('/studentsByRoll', (req, res) => {
    //     const roll = req.body;
    //     studentCollection.find({ roll: roll.roll })
    //         .toArray((err, documents) => {
    //             res.send(documents);
    //         })
    // })




});


app.listen(process.env.PORT || port)