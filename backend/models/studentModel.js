
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    studentName: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'student' },
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' } 
});

module.exports = mongoose.model('Student', studentSchema);
