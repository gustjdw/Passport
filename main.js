const express = require('express');
const app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var helmet = require('helmet');

app.use(helmet());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

app.use(session({
  secret: 'tlsdydeo',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));

var passport = require('passport')
  , LocalStrategy = require('passport-local')
  .Strategy;

app.get('*', function (request, response, next) {
  fs.readdir('./data', function (error, filelist) {
    request.list = filelist;
    next();
  });
});

var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');
var authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

app.use(function (request, response, next) {
  response.status(404).send('Sorry cant find that!');
});

app.use(function (error, request, response, next) {
  console.error(error.stack);
  response.status(500).send('Something broke!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000')
});