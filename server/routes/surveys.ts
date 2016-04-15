import express = require('express');
import passport = require('passport');
var router = express.Router();

// db references
import mongoose = require('mongoose');

import surveyModel = require('../models/survey');
import Survey = surveyModel.Survey;

import answerModel = require('../models/answer');
import Answer = answerModel.Answer;

/* Utility Function to check if user is authenticated */
function requireAuth(req:express.Request, res:express.Response, next: any) {
    // check if the user is logged in
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}

// GET - show main surveys page - list all the surveys
router.get('/', requireAuth, (req: express.Request, res: express.Response, next: any) => {
   
    // use the Survey model to query the Users collection
    Survey.find((error, surveys) => {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // no error, we found a list of users
            res.render('surveys/index', {
                title: 'Surveys',
                surveys: surveys,
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});

// GET add page - show the blank form
router.get('/add', requireAuth, (req: express.Request, res: express.Response, next: any) => {
    res.render('surveys/add', {
        title: 'Add a New Survey',
        displayName: req.user ? req.user.displayName : ''
    });
});

// POST add page - save the new user
router.post('/add', requireAuth, (req: express.Request, res: express.Response, next: any) => {
    Survey.create({
        name: req.body.name,
        category: req.body.category,     
        shortQue1: req.body.shortQue1,
        shortQue2: req.body.shortQue2,
        shortQue3: req.body.shortQue3,
        shortQue4: req.body.shortQue4,
        shortQue5: req.body.shortQue5,
        
    }, (error, User) => {
        // did we get back an error or valid Users object?
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            res.redirect('/surveys');
        }
    })
});

// GET edit page - show the current user in the form
router.get('/:id', requireAuth, (req: express.Request, res: express.Response, next: any) => {

    var id = req.params.id;

    Survey.findById(id, (error, Survey) => {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            //show the edit view
            res.render('surveys/edit', {
                title: 'Survey Details',
                survey: Survey,
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});

// POST edit page - update the selected user
router.post('/:id', requireAuth, (req: express.Request, res: express.Response, next: any) => {

    // grab the id from the url parameter
    var id = req.params.id;

    // create and populate a survey object
    var survey = new Survey({
        _id: id,
        name: req.body.name,
        category: req.body.category,
        shortQue1: req.body.shortQue1,
       shortQue2: req.body.shortQue2,
       shortQue3: req.body.shortQue3,
       shortQue4: req.body.shortQue4,
       shortQue5: req.body.shortQue5,
      
    });
    
    

    // run the update using mongoose and our model
    Survey.update({ _id: id }, survey, (error) => {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // if update is successful redirect to the users page
            res.redirect('/surveys');
        }
    });
});

// GET delete user
router.get('/delete/:id', requireAuth, (req: express.Request, res: express.Response, next: any) => {

    // get the id from the url
    var id = req.params.id;

    // use the model and delete this record
    Survey.remove({ _id: id }, (error) => {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // if removal worked redirect to users page
            res.redirect('/surveys');
        }
    });
});



router.get('/response', (req: express.Request, res: express.Response, next: any) => {
    res.render('surveys/response', {
        title: 'Add a New User',
        displayName: req.user ? req.user.displayName : ''
    });
});

// make this public
module.exports = router;