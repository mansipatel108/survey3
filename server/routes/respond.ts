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
            res.render('index', {
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
        shorAns4Arry.push({ shrtAns3: req.body[i] })
    }
    for (var i = 0; i < tempSurvey.shortAnswer5.length; i++) {
        shorAns4Arry.push({ shrtAns4: req.body[i] })
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
