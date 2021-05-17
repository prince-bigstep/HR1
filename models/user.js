const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    designation: {
        type: String,
        enum: ['Admin', 'Employee'],
        required: true
     },
    manager: {
        type: Schema.Types.ObjectId,
        ref:'User'
     },
    mentees: [{
        type: Schema.Types.ObjectId,
        ref:'User'
     }],
    requests: [{
        type: Schema.Types.ObjectId,
        ref:'Request'
     }],
    menteeRequests: [{
        type: Schema.Types.ObjectId,
        ref:'Request'
     }]
  
})


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);



  //  attendance: [{ 

    //     date: {
    //         type: Date,
    //         default: Date.now,
    //     },
    //     entry: { type: Date },
    //     exit: { type: Date}

    // }]