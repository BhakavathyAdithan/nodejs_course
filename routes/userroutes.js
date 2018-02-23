const express=require('express');
const bcrypt=require('bcryptjs');
const passport=require('passport');
const { check, validationResult } = require('express-validator/check');
const router=express.Router();



//Bring in the Models
let User=require('../models/user');

//Register User Route
router.get('/register',function(req,res){
    res.render('register');
});


//Add New User Post Route
router.post('/register' ,[
    check('name','Name is required').isLength({ min: 1 }),
    check('username','Username is required').isLength({ min: 1 }),
    check('email','Email is required').isLength({ min: 1 }),
    check('email','Email is not valid').isEmail(),
    check('password','Password is required').isLength({ min: 1 }),
    check('password','Password should be of 8 characters').isLength({ min: 2 }),
    check('confirmpassword','Passwords don\'t match').exists()
    .custom((value, { req }) => value === req.body.password)
  ],function(req,res,next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) 
    {
        console.log(errors);
        res.render('register',{
        errors:errors.mapped()
        });
    }   
    else{
        console.log('2');
        let user=new User();
        user.name=req.body.name;
        user.email=req.body.email;
        user.username=req.body.username;
        user.password=req.body.password;
       
        bcrypt.genSalt(10,function(err,salt){

            bcrypt.hash(user.password,salt,function(err,hash){

                if(err)
                {
                    console.log(err);
                    return;
                }
                else
                {
                    user.password=hash;
                    user.save(function(err){
                        if(err)
                        {
                            console.log(err);
                            return;
                        }
                        else{
                            req.flash('success','You are now registered. Kindly login');
                            res.redirect('/user/login');
                        }

                    });
                }

            });
        });

       
    }   

});


//Login Page Route
router.get('/login',function(req,res){
res.render('login');
});

//Login Check Process
router.post('/login',function(req,res,next){
    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/user/login',
        failureFlash:true
    })(req,res,next);

});

//Logout Route
router.get('/logout',function(req,res){
req.logout();
req.flash('success','Your logged out Successfully');
res.redirect('/user/login');
})


module.exports=router;