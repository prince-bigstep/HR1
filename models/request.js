const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
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
module.exports = mongoose.model('Request', RequestSchema);