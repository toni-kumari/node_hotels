const express = require('express');
const router = express.Router();
const MenuItem =require('./../models/MenuItem'); 


//Post Method to add new Menu Item
router.post('/' , async(req, res) =>
{
    try
    {
        const data = req.body;
        
        const newMenu = new MenuItem(data);
        const response = await newMenu.save();
    
        console.log('data saved');
        res.status(200).json(response);
    
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }
})

//Get Method to get data from MenuItem
router.get('/', async(req, res) =>
{
    try
    {
        const data = await MenuItem.find();
        console.log('data fetched');
        res.status(200).json(data);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({error: 'Internal server error'})
    }
})

router.get('/:tasteType', async(req, res) =>{
    
    try
    {
        const tasteType = req.params.tasteType; // Extract the work type from the URL parameter
        if(tasteType == 'sweet' || tasteType == 'sour' || tasteType == 'spicy')
        {
            const response = await MenuItem.find({taste:tasteType})
            res.status(200).json(response);
        }else{
            res.status(404).json({error:'Invalid taste type'})
        }
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({error: 'Internal server error'})
    }

})


//UPDATE
router.put('/:id' , async (req , res)=>
{
    try
    {
        const menuItemId = req.params.id // Extract the id from the URL parameter
        const updatedmenuItemData = req.body; // Updated data for the menuItem
        const response = await MenuItem.findByIdAndUpdate(menuItemId, updatedmenuItemData,
            {
                new: true,
                runValidators :true
            })
        if(!response) 
        {
            return res.status(404).json({ error: 'menuItem not found' }); 
        }
        console.log('data updated'); 
        res.status(200).json(response);    
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({error: 'Internal server error'}) 
    }
})

//DELETE
router.delete('/:id' ,async (req ,res) =>
{
    try
    {
        const menuItemId = req.params.id;
        const response  = await MenuItem.findByIdAndDelete(menuItemId);
    
        if(!response) 
        {
            return res.status(404).json({ error: 'MenuItem not found' }); 
        }
        else
        {
            console.log('data deleted'); 
            res.status(200).json({message: 'menuItem deleted successfully'});
        }
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({error: 'Internal server error'});   
    }
})
//comment added for testing
module.exports = router;