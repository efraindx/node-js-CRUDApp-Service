// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; 		// set our port

var mongoose   = require('mongoose');

mongoose.connect('mongodb://localhost/test');  // connect to our database

var Person = require('../PeopleCRUDService/models/person');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();	// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('A request/post is taking up.');
	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

// more routes for our API will happen here
router.route('/people')

	.post(function(req, res) {
		var person = new Person({
		  name: { first: req.body.firstName, last: req.body.lastName },
		  email: req.body.email
		}); //crate a Car instance
		
		//save the car and checks for erros
		person.save(function(err) {
			if (err)
			  res.send(err);
			  
			  res.json({message: 'Person created succesfully!'});
		});
	})
	
	//get all people
	.get(function(req, res) {
		Person.find(function(err, people) {
			if (err) 
			 res.send(err);
			 
			 res.json(people);
		});
	});

router.route('/people/:person_id')

	.get(function(req, res) {
		Person.findById(req.params.person_id, function(err, person) {
			if (err)
			  res.send(err);
			  
			  res.json(person);
		});
	})
	
	.put(function(req, res) {
	
		Person.findById(req.params.person_id, function(err, person) {
			if (err)
			  res.send(err);
			  
			  person.name.first = req.body.firstName;
			  person.name.last = req.body.lastName;
			  person.email = req.body.email;
			  
			  person.save(function(err) {
				if (err) 
				  res.send(err);
				  
				  res.json({ message: 'Person updated!'});
			  });
		});
	})
	
	.delete(function(req, res) {
		Person.remove({
		  _id: req.params.person_id},
		  function(err, person) {
			if (err)
			  res.send(err);
			  
			  res.json({ message: 'Successfully deleted!'});
		  });
	});
	
	

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Listening by the port: ' + port);
