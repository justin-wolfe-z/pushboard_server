express = require('express'),
app = express()
port = process.env.PORT || 4000;
mongoose = require('mongoose'),
User = require('./model'),
bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/ooodb');*/

app.get('/signup', function (req, res) {
    res.send('GET request to /signup')
})

app.post('/signup', function (req, res) {
    res.send('POST request to /signup')
})

app.listen(port);

console.log('ooo RESTful API server started on: ' + port);
