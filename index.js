if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
var bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const app = express() 
const users = []

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

var urlencodedParser = bodyParser.urlencoded({extended: false})

app.get('/',checkAuthenticated,(req,res) =>{
    res.render('index') 
})
app.get('/index.ejs',(req,res) =>{
    res.render('index')
})

app.get('/page2.ejs',(req,res) =>{
    res.render('page2')
})
app.get('/SignUpPage.ejs',checkNotAuthenticated,(req,res) =>{
    res.render('SignUpPage')
})
app.post('/SignUpPage.ejs',async (req,res) =>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.pass, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            surName: req.body.surName,
            email: req.body.email,
            pass: hashedPassword
        })
        res.redirect('/LogInPage.ejs')
    } catch {
        res.redirect('/SignUpPage.ejs')
    }
    console.log(users)
})
function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('LogInPage.ejs')
}
function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    next()
}
app.get('/LogInPage.ejs', checkNotAuthenticated,(req,res) =>{
    res.render('LoginPage')
})
app.post('/LogInPage.ejs', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/LogInPage.ejs',
    failureFlash: true
}))
app.get('/VideoCorse.ejs',(req,res) =>{
    res.render('VideoCorse.ejs')
})

app.post('/index.ejs',urlencodedParser,(req,res) =>{
    if(!req.body) return res.sendStatus(400)
    console.log(req.body)
    res.render('index')
})



app.listen(3000, ()=>{
    console.log('Server started: http://localhost:3000')
})

