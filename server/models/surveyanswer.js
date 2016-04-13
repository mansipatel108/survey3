"use strict";
var mongoose = require('mongoose');
// DEFINE THE OBJECT SCHEMA
var surveyAnswerSchema = new mongoose.Schema({
    surveyId: String,
    shrtAns1: String,
    shrtAns2: String,
    shrtAns3: String,
    shrtAns4: String,
    shrtAns5: String,
    submitted_at: {
        type: Date, default: Date.now
    }
}, {
    collection: 'surveyAnswers'
});
// MAKE THIS PUBLIC SO THE CONTROLLER CAN SEE IT
exports.SurveyAnswer = mongoose.model('SurveyAnswer', surveyAnswerSchema);

//# sourceMappingURL=surveyanswer.js.map
