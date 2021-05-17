const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({
    type: {
        type: String,
        enum: ['Check-in', 'Check-out'],
        default: 'Check-in'
     },
    date: {type: Date},
    status: {
        type: String,
        enum: ['Pending', 'Approved'],
        default: "Pending",
     },
    user: {
        type: Schema.Types.ObjectId,
        ref:'User'
     },
    pair: {
        type: Schema.Types.ObjectId,
        ref:'Request'
     }
})
module.exports = mongoose.model('Attendance', AttendanceSchema);

// var d = new Date();
// var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
// const month = months[d.getMonth()];