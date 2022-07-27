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

var authData = {
  email: 'egoing777@gmail.com',
  password: '111111',
  nickname: 'egoing'
}

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'pwd'
  },
  function (username, password, done) {
    console.log('LocalStrategy', username, password);
    if (username === authData.email) { // email이 맞으면
      console.log('email 존재');
      if (password === authData.password) { // password도 다 맞으면
        console.log('로그인 성공');
        return done(null, authData); // 성공
      } else { // password만 틀리다면
        console.log('Incorrect password.');
        return done(null, false, { // 실패 - 잘못된 비밀번호
          message: 'Incorrect password.'
        });
      }
    } else { // email이 틀리면
      console.log('Incorrect username.');
      return done(null, false, { // 실패 - 잘못된 email
        message: 'Incorrect username.'
      });
    }
  }));

app.post('/auth/login_process',
  passport.authenticate('local', { // local -> username과 password를 이용
    successRedirect: '/', // 성공하면 홈으로
    failureRedirect: '/auth/login' // 실패하면 로그인 재진입
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