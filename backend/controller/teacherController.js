const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Teacher = require('../models/teacherModel');
const Student = require('../models/studentModel');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const teacher = new Teacher({ username, password: hashedPassword });
        await teacher.save();
        res.status(201).json({ message: 'Teacher registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const teacher = await Teacher.findOne({ username });
        if (!teacher) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordMatch = await bcrypt.compare(password, teacher.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: teacher._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createStudent = async (req, res) => {
    try {
        const { username, password, studentName } = req.body;

        if (!req.user) {
            return res.status(401).json({ error: 'Teacher user not found' });
        }

        const teacher = await User.findById(req.user._id);
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher user not found in the database' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newStudent = new User({ username, password: hashedPassword, role: 'student', studentName });
        newStudent.teacher = teacher._id; 

        await newStudent.save();

        res.status(201).json(newStudent);
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ error: error.message });
    }
};


exports.updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password } = req.body;

        let student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (username) student.username = username;
        if (password) student.password = password;

        await student.save();

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        await student.remove();

        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
