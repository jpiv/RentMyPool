var session = require('express-session');

exports.isLoggedIn = function(request) {
    console.log(request.session.user)
    if(request.session) {
        return !!request.session.user;
    }
    return false
};

exports.getUser = function (request, response) {
    if(request.session)
        return request.session.user;
    else
        return null;
};

exports.checkUser =  function(request, response, next) {
    console.log('checking user');
    if(!exports.isLoggedIn(request) && request.url.toLowerCase() !== "/home") {
        console.log('not logged in! redirect');
        response.redirect("/Home")
    } 
    else {
        console.log('check user callback time! (user/sess valid!)')
        next();
    }
}

exports.createSession = function(request, response, user) {
    console.log('createSession');
    return request.session.regenerate(function(err) {
        if(err) {
            console.log('error in creating a session', err);
            throw err;
        }
        request.session.user = user;
        console.log('created that session, redirect to home');
        response.status(201).send(user);
    });
}

var dateString = function(date) {
    var parts = date.split('/');
    var parts2 = [];
    parts2[0] = parts[2];
    parts2[1] = parts[0];
    parts2[2] = parts[1];
    return parts2.join('');
}

exports.checkDateRange = function(from, to, date) {
  from = dateString(from);
  to = dateString(to);
  date = dateString(date);
  return (from <= date && to >= date);
}