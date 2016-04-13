import express = require('express');
var sendgrid = require('sendgrid')('ACCOUNT_NAME', 'PASSWORD');
import passport = require('passport');
var router = express.Router();

// db references
import mongoose = require('mongoose');
import userModel = require('../models/user');
import User = userModel.User;

import surveyModel = require('../models/survey');
import Survey = surveyModel.Survey;

import surveyAnswerModel = require('../models/surveyanswer');
import SurveyAnswer = surveyAnswerModel.SurveyAnswer;
var tempSurvey,tempSurveys;

/* GET home page. */
router.get('/', (req: express.Request, res: express.Response, next: any) => {
    res.render('index', { 
        title: 'Home', 
        displayName: req.user ? req.user.displayName : '' });
});

/* GET survey page. */
router.get('/survey', (req: express.Request, res: express.Response, next: any) => {
    res.render('survey', { 
        title: 'Survey',
        displayName: req.user ? req.user.displayName : '' });
});

/* GET about page. */
router.get('/about', (req: express.Request, res: express.Response, next: any) => {
    res.render('about', { 
        title: 'About',
        displayName: req.user ? req.user.displayName : '' });
});

/* GET contact page. */
router.get('/contact', (req: express.Request, res: express.Response, next: any) => {
    req.flash('successmessage', 'Thank You. Your message has been sent.');
    req.flash('errormessage','An Error has occurred.');
    res.render('contact', { 
        title: 'Contact', 
        messages: null,
        displayName: req.user ? req.user.displayName : '' });
});

/* Email processing 
router.post('/contact', (req: express.Request, res: express.Response, next: any) => {
    
    sendgrid.send({
        to: 'mpatel.y@gmail.com',
        from: req.body.email,
        subject: 'Contact Form Submission',
        text: "This message has been sent from the contact form at [MongoDB Demo]\r\n\r\n" +
        "Name: " + req.body.name + "\r\n\r\n" +
        "Phone: " + req.body.phone + "\r\n\r\n" +
        req.body.message,
        html: "This message has been sent from the contact form at [MongoDB Demo]<br><br>" +
        "<strong>Name:</strong> " + req.body.name + "<br><br>" +
        "<strong>Phone:</strong> " + req.body.phone + "<br><br>" +
        req.body.message
    },
    
        (err, json) => {
            if (err) { res.status(500).json('error'); 
            }
            res.render('contact', { 
                title: 'Contact',
                messages: req.flash('successmessage')
         });

        });
});
*/
/* Render Login Page */
router.get('/login', (req:express.Request, res: express.Response, next:any) => {
    if(!req.user) {
        res.render('login', {
            title: 'Login',
            messages: req.flash('loginMessage'),
            displayName: req.user ? req.user.displayName : ''
        });
        return;
    } else {
        return res.redirect('/users');
    }
});

/* Process Login Request */
router.post('/login', passport.authenticate('local', {
    successRedirect: '/users',
    failureRedirect: '/login',
    failureFlash: true
}));

/* Render Password Reset page */
router.get('/reset', (req:express.Request, res: express.Response, next:any) => {
    if(req.user) {
        res.render('reset', {
            title: 'Reset',
            displayName: req.user ? req.user.displayName : '' 
        });  
    }
    else {
        return res.redirect('/login');
    }
});

/* Process Password Reset Request */
router.post('/reset',(req:express.Request, res: express.Response, next:any) => {
    console.log(req.user.username);
    User.findOne({'username':req.user.username}, (err, user) => {
       user.setPassword(req.body.password, (err) =>{
          if(err) {
              console.log(err);
              next(err);
          } else {
              user.save((err) =>{
                  if(err) {
                      console.log(err);
                  }
                  
                  console.log('Password Changed');
                  res.redirect('/users');
              });
          }
       }); 
    });
});

/* Render Registration page */
router.get('/register', (req:express.Request, res: express.Response, next:any) => {
    if(!req.user) {
        res.render('register', {
            title: 'Register',
            messages: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName : ''
        });
        return;
    } else {
        return res.redirect('/');
    }
});

/* Process Registration Request */
router.post('/register', (req:express.Request, res: express.Response, next:any) => {
    // attempt to register user
    User.register(new User(
       { username: req.body.username,
         password: req.body.password,
         email: req.body.email,
         displayName: req.body.displayName
       }), req.body.password, (err) => {
           if(err) {
               console.log('Error Inserting New Data');
               if(err.name == 'UserExistsError') {
               req.flash('registerMessage', 'Registration Error: User Already Exists!');
               }
               return res.render('register', {
                    title: 'Register',
                    messages: req.flash('registerMessage'),
                    displayName: req.user ? req.user.displayName : ''
                });
           }
           // if registration is successful
           return passport.authenticate('local')(req, res, ()=>{
              res.redirect('/users'); 
           });
       });
});

/* Process Logout Request */
router.get('/logout', (req:express.Request, res: express.Response) => { 
    req.logOut();
    res.redirect('/login');
});


/* ---------------------------------------------------------------------------------  */

function requireAuth(req, res, next) {
    // check if the user is logged in
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}

// Get Home page and render survey list
router.get('/', function(req, res, next) {    
    Survey.find(function(err, surveys) {
        if (err) 
        {
            console.log(err);
            res.end(err);
        }
        else
        {                
             tempSurveys = surveys;
            res.render('surveys/index', {
                title: 'MS Survey',
                displayName: req.user ? req.user.displayName : '',
                surveys: surveys              
            });
            
        }
    });
});

//render respondSurvey page
 router.get('/takeSurvey/:id', function(req, res, next) {
     var id = req.params.id;
     Survey.findById(id, function(err, Survey) {
         if (err) {
             console.log(err);
             res.end(err);
         }
         else {            
             res.render('surveys/respondSurvey', {
                 title: "Take Survey",
                 displayName: req.user ? req.user.displayName : '',
                 survey: Survey,               
             });
             tempSurvey = Survey; //take the survey object
         }
     }); 
 });
// submit survey answers
 router.post('/takeSurvey/:id', function (req, res, next) {
     //if survey has been modified , delete all the answer 
     if (tempSurvey.modified == true)
     {
        SurveyAnswer.remove({ surveyId: req.params.id },function(err){
            if (err) {
                console.log(err);
                res.end(err);
            }
            else
            {
                console.log("successfully removed");
                tempSurvey.modified = false; // bring status back to false
                tempSurvey.save(function (err) {  // save to db
                    if (err) return Error(err); 
                    else console.log("modified status changed!");
                });
            }
        });
     }
     var shorAns1Arry = [];
      var shorAns2Arry = [];
       var shorAns3Arry = [];
        var shorAns4Arry = [];
         var shorAns5Arry = [];
  
    // loop through the questions, find post value by i and stored into object form then push to array
    for (var i = 0; i < tempSurvey.shortAnswer1.length; i++) {
        shorAns1Arry.push({ shrtAns1: req.body[i] })
    }
     for (var i = 0; i < tempSurvey.shortAnswer2.length; i++) {
        shorAns2Arry.push({ shrtAns2: req.body[i] })
    }
     for (var i = 0; i < tempSurvey.shortAnswer3.length; i++) {
        shorAns3Arry.push({ shrtAns3: req.body[i] })
    }
 for (var i = 0; i < tempSurvey.shortAnswer4.length; i++) {
        shorAns4Arry.push({ shrtAns4: req.body[i] })
    }
     for (var i = 0; i < tempSurvey.shortAnswer5.length; i++) {
        shorAns5Arry.push({ shrtAns5: req.body[i] })
    }
    
    // store object into db
    SurveyAnswer.create({
        surveyId: req.params.id,
        shortAnswer1: shorAns1Arry,
        shortAnswer2: shorAns2Arry,
        shortAnswer3: shorAns3Arry,
        shortAnswer4: shorAns4Arry,
        shortAnswer5: shorAns5Arry,
        submitted_at: Date.now()
    }, function(err, Survey) {
        if (err) {
            console.log(err);
            res.end(err);
        }
        else {
            res.redirect('/');//after submission
        }
    });
 });
  


 router.get('/takeSurvey/cancel/:id', function (req, res, next) {
     res.render('index', {
         title: 'MS Survey',
         displayName: req.user ? req.user.displayName : '',
         surveys: tempSurveys
     });    
 });


/* GET survey list page. */
router.get('/listSurvey', requireAuth, (req: express.Request, res: express.Response, next: any) => {
  res.render('surveys/index.ejs', { 
      title: 'My Survey List',
      displayName: req.user ? req.user.displayName : '',
      username: req.user ? req.user.username : '' 
  });
});
/*  */
router.get('/listSurvey/create', requireAuth, (req: express.Request, res: express.Response, next: any) => {
    res.render('surveys/index.ejs', {
        title: 'My Survey List',
        displayName: req.user ? req.user.displayName : '',
        username: req.user ? req.user.username : ''
    });
});
/* Render Login page. */
router.get('/login', function (req, res, next) {
    if (!req.user) {
        res.render('login', {
            title: 'Login',
            messages: req.flash('loginMessage'),
            displayName: req.user ? req.user.displayName : ''
        });
    }
    else {
        return res.redirect('/listSurvey')//redirect to listsurvey if logged in
    }
});


module.exports = router;
