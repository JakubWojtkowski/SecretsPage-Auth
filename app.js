// Setup

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

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

const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

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
    const user = new User({
        email: req.body.username,
        password: req.body.password
    });

    user.save((err) => {
        if (!err) {
            res.render('secrets');
        } else {
            console.log(err);
        }
    });
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, (err, foundUser) => {
        if (!err && foundUser) {
            if(foundUser.password === password) {
                res.render('secrets');
            }
        } else {
            console.log(err);
        }
    });
});

// Listening

app.listen(port, () => {
    console.log(`Server started at ${port}.`);
});