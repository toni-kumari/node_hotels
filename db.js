const mongoose = require('mongoose');
require('dotenv').config();

//Define the MongoDB connection URL
//const mongoURL ='mongodb://127.0.0.1:27017/hotels'  
const mongoURL = process.env.MONGODB_URL;

//Set up MongoDB connection
mongoose.connect(mongoURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
//Get the default connection
//Mongoose maintains a default connection object representing the MongoDB connection
const db = mongoose.connection;

//Define event listenrs for database connection

db.on('connected', () =>{
    console.log('Conected to MongoDB server');
});

db.on('error', (err) =>{
    console.log('MongoDB connection error:', err);
});

db.on('disconnected', () =>{
    console.error('MongoDB disconnected');
});

//Export the databse connection-->you export the db object, which represents the MongoDB connection,
//so that you can import and use it in other parts of your Node.js application.

module.exports =db;