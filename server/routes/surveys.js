"use strict";
var express = require('express');
var router = express.Router();
var surveyModel = require('../models/survey');
var Survey = surveyModel.Survey;
/* Utility Function to check if user is authenticated */
function requireAuth(req, res, next) {
    // check if the user is logged in
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}
// GET - show main surveys page - list all the surveys
router.get('/', requireAuth, function (req, res, next) {
    // use the Survey model to query the Users collection
    Survey.find(function (error, surveys) {
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
router.get('/add', requireAuth, function (req, res, next) {
    res.render('surveys/add', {
        title: 'Add a New Survey',
        displayName: req.user ? req.user.displayName : ''
    });
});
// POST add page - save the new user
router.post('/add', requireAuth, function (req, res, next) {
    Survey.create({
        name: req.body.name,
        category: req.body.category,
        shortQue1: req.body.shortQue1,
        shortQue2: req.body.shortQue2,
        shortQue3: req.body.shortQue3,
        shortQue4: req.body.shortQue4,
        shortQue5: req.body.shortQue5,
    }, function (error, User) {
        // did we get back an error or valid Users object?
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            res.redirect('/surveys');
        }
    });
});
// GET edit page - show the current user in the form
router.get('/:id', requireAuth, function (req, res, next) {
    var id = req.params.id;
    Survey.findById(id, function (error, Survey) {
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
router.post('/:id', requireAuth, function (req, res, next) {
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
    Survey.update({ _id: id }, survey, function (error) {
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
router.get('/delete/:id', requireAuth, function (req, res, next) {
    // get the id from the url
    var id = req.params.id;
    // use the model and delete this record
    Survey.remove({ _id: id }, function (error) {
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
router.get('/response', function (req, res, next) {
    res.render('surveys/response', {
        title: 'Add a New User',
        displayName: req.user ? req.user.displayName : ''
    });
});
// make this public
module.exports = router;

//# sourceMappingURL=surveys.js.map
