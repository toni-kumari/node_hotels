const express = require('express');
const router = express.Router();
const Person =require('./../models/Persons');
const {jwtAuthMiddleware, gerateToken} = require('./../jwt');

 
//POST route to add a person
router.post('/signup',async(req, res)=>{
    try
    {
     const data= req.body // Assuming the request body contains the person data
 
     //Create a new Persondocument using the Mongoose model
     const newPerson =new Person(data);
 
     //Save the new person to the database
     const response = await newPerson.save();
     
     console.log('data saved');
     const payload = {
        id: response.id,
        username: response.username
     }
     console.log(JSON.stringify(payload));

     const token = gerateToken(payload);
     console.log("Token is : ", token);

     res.status(200).json({response: response, token: token});
    }
    catch(err)
    {
         console.log(err);
         res.status(500).json({error: 'Internal server error'})
    }
}) 
//Login route
router.post('/login', async(req, res) =>
{
    try
    {
        //extract username and password from request body
        const {username, password} = req.body;
        const user = await Person.findOne({username: username});
        //if user does not exist or password does not match, return error
        if(!user || !(await user.comparePassword(password)))
        {
            return res.status(401).json({error: 'Invalid username or password'});
        }


        //Generate token
        const payload ={
            id: user.id,
            username: user.username
        }

        const token = gerateToken(payload);

        //return token as response
        res.json({token})
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({error: 'Internal server error'})
    }
})
//Profile route
router.get('/profile', jwtAuthMiddleware, async(req, res) =>
{
    try{
        const userData = req.user;
        console.log('user Data:', userData);

        const userId = userData.id;
        const user = await Person.findById(userId);

        res.status(200).json({user})
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({error: 'Internal server error'})
    }
})


//GET method to get the person
router.get('/', jwtAuthMiddleware,async(req, res) =>
{
    try
    {
        const data = await Person.find();
        console.log('data fetched');
        res.status(200).json(data);
    }
    catch(err)
        {
            console.log(err);
            res.status(500).json({error: 'Internal server error'})
        }
})

router.get('/:workType', async(req, res) =>{
    
    try
    {
        const workType = req.params.workType; // Extract the work type from the URL parameter
        if(workType == 'chef' || workType == 'manager' || workType == 'waiter')
        {
            const response = await Person.find({work:workType})
            res.status(200).json(response);
        }else{
            res.status(404).json({error:'Invalid work type'})
        }
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({error: 'Internal server error'})
    }

})
//UPDATE
router.put('/:id', async (req, res) =>
{
    try
    {
        const personId = req.params.id; // Extract the id from the URL parameter 
        const updatedPersonData = req.body; // Updated data for the person 
        const response = await Person.findByIdAndUpdate (personId, updatedPersonData,  
        {
            new: true, // Return the updated document 
            runValidators: true, // Run Mongoose validation 
        })

        if(!response) 
        {
            return res.status(404).json({ error: 'Person not found' }); 
        }

        console.log('data updated'); 
        res.status(200).json(response);
    }
     
        
    catch(err) 
    {  
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    } 
})

//DELETE
router.delete('/:id' ,async (req ,res) =>
{
    try
    {
        const personId = req.params.id;
        const response  = await Person.findByIdAndDelete(personId);

        if(!response) 
        {
            return res.status(404).json({ error: 'Person not found' }); 
        }
        else
        {
            console.log('data deleted'); 
            res.status(200).json({message: 'person deleted successfully'});
        }
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({error: 'Internal server error'});   
    }
})


module.exports = router;
    
