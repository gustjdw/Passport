const express = require('express');
const app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var helmet = require('helmet');
var flash = require('connect-flash');

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

app.use(flash());

var authData = {
  email: 'egoing777@gmail.com',
  password: '111111',
  nickname: 'egoing'
}

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  console.log('serializeUser', user);
  done(null, user.email);
});
passport.deserializeUser(function (id, done) {
  console.log('deserializerUser', id);
  done(null, authData);
});

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'pwd'
  },
  function (username, password, done) {
    console.log('LocalStrategy', username, password);
    if (username === authData.email) {
      console.log('email 존재');
      if (password === authData.password) {
        console.log('로그인 성공');
        return done(null, authData, {
          message: 'Welcome.'
        });
      } else {
        console.log('Incorrect password.');
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
    } else {
      console.log('Incorrect username.');
      return done(null, false, {
        message: 'Incorrect username.'
      });
    }
  }));

app.post('/auth/login_process',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
    successFlash: true
  }));

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