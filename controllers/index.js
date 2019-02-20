var request = require('request');

const rootURL = 'https://api.github.com/';

module.exports = {
  userDetails,
  search
}

function userDetails(req, res, next) {
  // first get username in a POST scenario (req.body.username)
  // then check in a GET scenario (req.query.username)
  var username = req.body.username || req.query.username;
  if (!username) return res.render('index', {
    userData: null,
    showSearch: false,
    showUser: false,
    showIndex: true
  });

  if(req.query.username) {

    var queryOptions = {
      url: `${rootURL}users/${req.query.username}`,
      headers: {
        'User-Agent': 'sntruong12',
        //when providing a token it must have a space
        'Authorization': 'token ' + process.env.GITHUB_TOKEN
      }
    }

    request(queryOptions, (err, response, body) => {
      var userData = JSON.parse(body);
      queryOptions.url = userData.repos_url;
      request(queryOptions, (err, response, body) => {
        // add a repos property
        userData.repos = JSON.parse(body);
        console.log(userData.repos[0]);
        res.render('index', {
          userData: userData,
          showSearch: false,
          showUser: true,
          showIndex: false
        });
      });
    });
  } else {

    var options = {
      url: `${rootURL}users/${req.body.username}`,
      headers: {
        'User-Agent': 'sntruong12',
        //when providing a token it must have a space
        'Authorization': 'token ' + process.env.GITHUB_TOKEN
      }
    }

    // get request to get user information
    request(options, (err, response, body) => {
      var userData = JSON.parse(body);
      options.url = userData.repos_url;
      request(options, (err, response, body) => {
        // add a repos property
        userData.repos = JSON.parse(body);
        console.log(userData.repos[0]);
        res.render('index', {
          userData: userData,
          showSearch: false,
          showUser: true,
          showIndex: false
        });
      });
    });
  }


}

function search(req, res, next) {
  // set up object to do use request in order to interact with Github api
  var options = {
    //req.body.search is from the input name attribute in index.ejs
    url: `${rootURL}search/users?q=${req.body.search}+in:fullname`,
    headers: {
      'User-Agent': 'sntruong12',
      //when providing a token it must have a space
      'Authorization': 'token ' + process.env.GITHUB_TOKEN
    }
  }
  // get request to search github for users
  request(options, (err, response, body) => {
    var searchResults = JSON.parse(body).items;
    
    res.render('search-results', {
    userData: searchResults,
    showSearch: true,
    showUser: false,
    showIndex: false
    });
  })
}