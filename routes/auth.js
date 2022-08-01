var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');

router.get('/login', function (request, response) {
  var title = 'WEB - login';
  var list = template.list(request.list);
  var html = template.HTML(title, list, `
    <form action="/auth/login_process" method="post">
      <p><input type="text" name="email" placeholder="email"></p>
      <p><input type="password" name="pwd" placeholder="password"></p>
      <p>
        <input type="submit" value="login">
      </p>
    </form>
  `, '');
  response.send(html);
});

router.get('/logout', function (request, response) {
  request.logout(function(err) {
    response.redirect('/');
  });
});

module.exports = router;