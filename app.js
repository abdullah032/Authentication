//jshint esversion:6

const express  = require('express')
const app = express()
const {connect , Schema , model} = require('mongoose')
const bodyParser = require('body-parser')
const encript = require('mongoose-encryption')
require('dotenv').config()

connect('mongodb://0.0.0.0:27017/userDB')

const Shema =new Schema({
    email:String,
    password:String,
})


Shema.plugin(encript , { secret:process.env.ENCRIPT_SECRET , encryptedFields:['password'] })
const userDB = new model('users',Shema)

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.set('view engine','ejs')
app.set('views','views')


app.get('/',(req,res)=>{

    res.render('home')
})

app.get('/login',(req,res)=>{

    res.render('login')
})

app.get('/register',(req,res)=>{

    res.render('register')
})


app.post('/login',async (req,res)=>{

    const {username , password} = req.body

   try {
        
        let findUser = await userDB.findOne({email:username})
        
       if ( findUser == null ) {
            res.send('User not find!')
       }
       else {

            if (password == findUser.password) {

                res.render('secrets')
            }
            else {
                res.send('Password does not match!')
            }
       }
   }
   catch (error) {
        console.log(error)
    }
})


app.post('/register',async (req,res)=>{
    
    const {username,password}=req.body
    
    try {
        
        await userDB.create({
            email:username,
            password:password,
        })
        console.log('Account create!')
    }
    catch (error) {
        console.log(error)
    }
    res.render('secrets')
})


app.listen(3000, ()=>console.log('Server is listing on port 3000!'))