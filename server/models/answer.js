"use strict";
var mongoose = require('mongoose');
// DEFINE THE OBJECT SCHEMA
var answerSchema = new mongoose.Schema({
    name: String,
    // surveyId: String,
    category: String,
    shortAnswer: [{
            shrtAns: String
        }],
    updated_at: {
        type: Date, default: Date.now
    }
}, {
    collection: 'answerInfo'
});
// MAKE THIS PUBLIC SO THE CONTROLLER CAN SEE IT
exports.Answer = mongoose.model('Answer', answerSchema);

//# sourceMappingURL=answer.js.map
