const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const { check, validationResult } = require('express-validator/check');
const config=require('./config/database');

//Connection to MongoDB
mongoose.connect(config.database);
let db=mongoose.connection;

//Check Connection
db.once('open',function(){

    console.log('Connected to MongoDB');
});

//Check for DB Error
db.on('error',function(err){
    console.log(err);
});


//App Init
const app=express();

//Set View Engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//Set Static Folder
app.use(express.static(path.join(__dirname,'public')));

//Express session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Bring in Passport Config
require('./config/passport')(passport);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Setting a global user variable
app.get('*',function(req,res,next){

    res.locals.user=req.user || null;
    next();

})

//Bring in the Models
let Book=require('./models/book');

//Home Route
app.get('/',function(req,res){

Book.find({},function(err,books){
    if(err)
    {
        console.log(err);
    }
    else{
        res.render('index',{
            title: 'Book Store',
            books:books
        });        
    }
});
});

//Route Files
let books=require('./routes/bookroutes');
let users=require('./routes/userroutes');
app.use('/book',books);
app.use('/user',users);


//Server Startup
app.listen(3000,function(){

    console.log('Server Started in Port Number 3000');
});