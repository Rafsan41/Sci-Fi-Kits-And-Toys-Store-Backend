const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DataBase_User}:${process.env.DataBase_Password}@cluster0.js8fvq9.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        //server connection 
        await client.connect();
        //  DataBase
        const database = client.db("Science-Fiction-Kits-And-Toys");
        // DataBase Collections
        const userCollection = database.collection("User-Collection")
        const sellerCollection = database.collection("Seller-Collection")
        const productCollection = database.collection("product-Collection")

        //  <-----------------get-------------->
        app.get('/allToys', async (req, res) => {
            console.log(req.query)
            const cursor = productCollection.find();
            const page = parseInt(req.query.page) || 0
            const size = parseInt(req.query.size) || 10;

            // let result;
            // if (page) {
            //     products = await cursor.skip(page * size).limit(size).toArray();
            // }
            // else {
            //     products = await cursor.toArray();
            // }
            // const product = productCollection.
            const result = await productCollection.find().skip(page * size).toArray();
            res.send(
                result
            )
        })


        // app get user registation data read and log in  
        app.get('/login', async (req, res) => {
            const coursor = sellerCollection.find()
            const results = await coursor.toArray();
            res.send(results);
        }
        )

        app.get('/addToys', async (req, res) => {
            const product = productCollection.find()
            const result = await product.toArray();
            res.send(result)

        })

        app.get('/updateProduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const product = await productCollection.findOne(query)
            res.send(product)
        })

        app.get('/totalProducts', async (req, res) => {
            const product = productCollection.find()
            const result1 = await productCollection.estimatedDocumentCount();
            const result = await product.toArray();
            res.send({ totalProducts: result1 })

        })
        //<-------------- post -------------->
        // app.post __ product create or add 
        app.post('/allToys', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product)
            res.send(result)
        })

        //  app post _ user registation create
        app.post('/register', async (req, res) => {
            const user = req.body;
            // console.log('new user', user)
            const result = await sellerCollection.insertOne(user)
            res.send(result);
        })
        // app .post product add or create 
        app.post('/addToys', async (req, res) => {
            const addProduct = req.body;
            const result = await productCollection.insertOne(addProduct)
            res.send(result)
        })

        app.delete('/addToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.deleteOne(query)
            res.send(result);



        })
        //<------------- put --------------->
        app.put('/updatedProduct/:id', async (req, res) => {
            const id = req.params.id;
            const product = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedProduct = {
                $set: {
                    name: product.name,
                    manufacturer: product.manufacturer,
                    rating: product.rating,
                    discription: product.discription,
                    category: product.category,
                    img: product.img,
                    price: product.price,
                    quantity: product.quantity,

                }
            }
            const result = await productCollection.updateOne(filter, updatedProduct, options)
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
    res.send('users managemanet server is running')
})

app.listen(port, () => {
    console.log(`server is sunning  on port ${port}`)
})