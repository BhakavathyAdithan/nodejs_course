const express=require('express');
const { check, validationResult } = require('express-validator/check');
const router=express.Router();

//Bring in the Models
let Book=require('../models/book');
let User=require('../models/user');

//Add Route
router.get('/add',ensureAuthenticated,function(req,res){
    res.render('addbook',{
        title: 'Add Book'
    });
});


//Add Post Route
router.post('/add/newbook' ,[
    check('title','Title is required').isLength({min:1}),
    //check('author','Author is required').isLength({ min: 1 }),
    check('Genre','Genre is required').isLength({ min: 1 })
  ],function(req,res,next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) 
    {
        res.render('addbook',{
        title: 'Add Book',
        errors:errors.mapped()
        });
    }   
    else{
        let book=new Book();
        book.title=req.body.title;
        book.author=req.user._id;
        book.Genre=req.body.Genre;
        console.log(req.body.Genre);
        book.save(function(err){
        if(err)
        {
            console.log(err);
            return;
        }
        else{
            req.flash('success','Book Added Successfully');
            res.redirect('/');
        }
        });
    }   

});

//Get Single Item Route
router.get('/info/:id',function(req,res){
    Book.findById(req.params.id,function(err,book){
    if(err)
    {
        console.log(err);
        return;
    }
    else{

        User.findById(book.author,function(err,user){

            res.render('bookinfo',{
                book:book,
                author:user.name
            });
        });

        
    }
});
});

//Update Route
router.get('/edit/:id',ensureAuthenticated,function(req,res){

    Book.findById(req.params.id,function(err,book){
        if(err)
        {
            console.log(err);
            return;
        }
        else{
            
            if(book.author!=req.user._id)
            {
                req.flash('danger','Not Authorized');
                res.redirect('/');
            }
            else{
            res.render('editbookinfo',{
                book:book
            });
        }
        }
        
});

//Update Post Route
router.post('/edit/:id',function(req,res){
    let book={};
    book.title=req.body.title;
    book.author=req.body.author;
    book.Genre=req.body.genre;

    let query={_id:req.params.id};

    Book.update(query,book,function(err){
    if(err)
    {
        console.log(err);
        return;
    }
    else{
        res.redirect('/');
    }
    });
    });

});

//Delete Route
router.delete('/delete/:id',ensureAuthenticated,function(req,res){
    
    if(!req.user._id)
    {
        res.status(500).send();
    }
    else{
        
    Book.findById(req.params.id,function(err,book){

        if(req.user.id!=book.author)
        {
            res.status(500).send();
        }
        else{
            let query={_id:req.params.id};
            Book.remove(query,function(err){
                if(err)
                {
                    console.log(err);
                    return;
                }
                else
                {
                    res.send('Success');
                }
                });
        }
    });
    
    
}
});

//Access Control
function ensureAuthenticated(req,res,next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    else{
        req.flash('danger','Please login');
        res.redirect('/user/login');
    }
}

module.exports=router;
