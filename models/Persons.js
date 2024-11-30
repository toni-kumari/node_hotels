const mongoose= require('mongoose')
const bcrypt = require('bcrypt');

//Define the PErson schema
const personSchema =new mongoose.Schema({
    name:{
        type: String,
        required:true,
    },
    age:{
        type: Number
    },
    work:{
        type: String,
        enum:['chef', 'waiter','manager'],
        required: true
    },
    mobile:
    {
        type: Number,
        required:true
    },
    email:
    {
        type: String,
        required:true,
        unique: true
    },
    address:
    {
        type: String
    },
    salary:{
        type: Number,
        required: true
    },
    username:{
        type: String,
        required : true
    },
    password :{
        required: true,
        type: String
    }
});
personSchema.pre('save', async function(next)
{
    const person = this;

    //Hash the password only if it has been modified( or is new)
    if(!person.isModified('password'))
    {
        return next();
    }
    try
    {
        //hash password generate
        const salt = await bcrypt.genSalt(10); //hash password generation and 10 is ideal number for hashing
        const hashedPassword = await bcrypt.hash(person.password, salt);
        //Override the plain password with hashed one
        person.password = hashedPassword;
        next();
    }
    catch(err)
    {
        return next(err);

    }
})

personSchema.methods.comparePassword = async function(candidatePassword)
{
    try{
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }
    catch(err){
        throw err;
    }
}

//Create Person model
const Person =mongoose.model('Person', personSchema);
module.exports =Person;