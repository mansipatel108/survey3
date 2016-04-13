import mongoose = require('mongoose');
import passportLocalMongoose = require('passport-local-mongoose');

// DEFINE THE OBJECT SCHEMA
var surveySchema = new mongoose.Schema({
        name: String,
        category: String,      
        shortQue1: String,
        shortQue2: String,
        shortQue3: String,
        shortQue4: String,
        shortQue5: String,
        
        mulQue: String,
        mulOpt1: String,
        mulOpt2: String,
        mulOpt3: String,
        
        mulQue1: String,
        mulOpta: String,
        mulOptb: String,
        mulOptc: String,
        
        mulQue2: String,
        mulOptd: String,
        mulOpte: String,
        mulOptf: String,
        
        updated_at:
            {
                type: Date, default: Date.now
            }
    }, {
        collection: 'surveyInfo'
    });
    
    // MAKE THIS PUBLIC SO THE CONTROLLER CAN SEE IT
export var Survey = mongoose.model('Survey', surveySchema);