var express = require('express');

//import route modules
var index = require('./routes/index');
var brews = require('./routes/brews');

var app = express();
app.listen(8080, function() {
    console.log('Listening on http://localhost:8080');
});

app.use(express.static('public'));
app.use('/', index);
app.use('/brews', brews);
