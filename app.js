const express = require('express');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const pgp = require('pg-promise')({});
const db = pgp({database: 'restaurant_v2', user: 'postgres'});

const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  noCache: true
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get("/", function(request, response) {
    response.render('index.html', {});
});

app.get("/search", function(request, response) {
    let searchTerm = request.query.searchTerm;
    db.any('SELECT * FROM restaurant WHERE name ILIKE $1', ['%' + searchTerm + '%'])
    .then(function(results) {
        response.render('search_results.html', {restaurants: results});
    })
    .catch(function(error) {
        console.error("SEARCH ERROR: ", error);
        response.redirect('/');
    });
});

app.get("/restaurant/:id", function(request, response) {
    let restaurantID = request.params.id;
    db.one('SELECT * FROM restaurant WHERE id = $1', [restaurantID])
    .then(function(result) {
        response.render('restaurant.html', {restaurant: result});
    })
    .catch(function(error) {
        console.error("RESTAURANT ERROR: ", error);
        response.redirect('/');
    });
});

app.listen(8080, function() {
    console.log("app started on port 8080");
});