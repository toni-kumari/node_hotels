const express = require('express')
const app = express();
const db =require('./db');

require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // req.body

const PORT = process.env.PORT || 3000 ;

//IMPORT the router files from personRoutes.js
const personRoutes = require('./routes/personRoutes');
//USE  the routers
app.use('/person', personRoutes);

//IMPORT the router files from menuRoutes.js
const menuItemRoutes = require('./routes/menuItemRoutes');
//USE  the routers
app.use('/menu', menuItemRoutes);




app.get('/', function(req, res){
    res.send('Welcome to my hotel.. How i can help you ?')
})
app.listen(3000, ()=>{
    console.log('listenning on port 3000')
})


