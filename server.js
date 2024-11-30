const express = require('express')
const app = express();
const db =require('./db');
require('dotenv').config();
const passport = require('./auth');


const bodyParser = require('body-parser');
app.use(bodyParser.json()); // req.body

const PORT = process.env.PORT || 3000 ;


/// Middleware function
const logRequest = (req, res, next) => {
    console.log(`${new Date().toLocaleString()} Request Made to: ${req.originalUrl}`);
    next(); // Move on to the next phase 
}; 
// Use the middleware 
app.use(logRequest);

app.use(passport.initialize());
const localAuthMiddleware = passport.authenticate('local' , {session: false});

//IMPORT the router files from personRoutes.js and menuRoutes.js
const personRoutes = require('./routes/personRoutes');
const menuItemRoutes = require('./routes/menuItemRoutes');
//USE  the routers
app.use('/person' ,personRoutes);
app.use('/menu', menuItemRoutes);






app.get('/' , function(req, res){
    res.send('Welcome to my hotel.. How i can help you ?')
})
app.listen(3000, ()=>{
    console.log('listenning on port 3000')
})


