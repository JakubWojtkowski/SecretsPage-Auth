// Setup
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const app = express();

const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/userDB");
mongoose.set('strictQuery', true);

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

// Operations with res and req

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        const user = new User({
            email: req.body.username,
            password: hash
        });
    
        user.save((err) => {
            if (!err) {
                res.render('secrets');
            } else {
                console.log(err);
            }
        });
    });
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, (err, foundUser) => {
        if (!err && foundUser) {
            bcrypt.compare(password, foundUser.password, (err, result) => {
                if (result === true) {
                    res.render('secrets');
                }
            });
        } else {
            console.log(err);
        }
    });
});

// Listening

app.listen(port, () => {
    console.log(`Server started at ${port}.`);
});