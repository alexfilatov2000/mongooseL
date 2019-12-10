const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 80;

mongoose.connect('mongodb://localhost:27017/nodekb', { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;

db.once('open', function () {
    console.log('connected to Mongodb');
});

db.on('error', function (err) {
    console.log(err);
});

const ap = express();

let Art = require('./models/art');

ap.set('views', path.join(__dirname, 'public'));
ap.set('view engine', 'pug');

// parse application/x-www-form-urlencoded
ap.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
ap.use(bodyParser.json());

ap.use(express.static(path.join(__dirname, 'pub')));


ap.get("/", function(request, response){
    Art.find({}, function (err, res) {
        if (err){
            console.log(err);
        }  else {
            response.render('index', {
                title: 'Articles',
                articles: res
            });
        }
    });
});

let articles = require('./routes/articles');
let users = require('./routes/users');
ap.use('/articles', articles);
ap.use('/users', users);


ap.listen(PORT, () => {
    console.log('server has been started...');
});
