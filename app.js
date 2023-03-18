// Setup

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');

// Main Code

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

// Listening

app.listen(port, () => {
    console.log(`Server started at ${port}.`);
});