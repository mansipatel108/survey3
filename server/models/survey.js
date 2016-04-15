"use strict";
var mongoose = require('mongoose');
// DEFINE THE OBJECT SCHEMA
var surveySchema = new mongoose.Schema({
    name: String,
    category: String,
    modified: Boolean,
    expired: Boolean,
    shortQue1: String,
    shortQue2: String,
    shortQue3: String,
    shortQue4: String,
    shortQue5: String,
    updated_at: {
        type: Date, default: Date.now
    }
}, {
    collection: 'surveyInfo'
});
// MAKE THIS PUBLIC SO THE CONTROLLER CAN SEE IT
exports.Survey = mongoose.model('Survey', surveySchema);

//# sourceMappingURL=survey.js.map
