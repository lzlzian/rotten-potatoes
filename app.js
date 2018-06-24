const express = require('express');
const methodOverride = require('method-override');
const app = express();
var exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');


app.engine('handlebars', exphbs({
	defaultLayout:'main',
	layoutsDir: path.join(__dirname, '/views/layouts'),
	partialsDir: path.join(__dirname, '/views/partials'),
	helpers: {
		'eq': function(val, val2, options) {
      		if(val === val2){
        		return options.fn(this);
      		}
      		return options.inverse(this);
		},
	}
}));

app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/rotten-potatoes');

const Review = mongoose.model('Review', {
	title: String,
	movieTitle: String,
	description: String,
	rating: Number,
});

// INDEX
app.get('/', (req, res)=>{
	Review.find().then((reviews) => {
		res.render('reviews-index', {reviews: reviews});
	}).catch((err) => {
		console.log(err);
	});
});

// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'));

// NEW
app.get('/reviews/new', (req, res) => {
	res.render('reviews-new', {});
});

// CREATE
app.post('/reviews', (req, res)=>{
	Review.create(req.body).then((review) => {
		console.log(review);
		res.redirect('/reviews/' + review._id);
	}).catch((err) => {
		console.log(err.message);
	});
});

// SHOW
app.get('/reviews/:id', (req, res) => {
	Review.findById(req.params.id).then((review) => {
		res.render('reviews-show', {review: review});
	}).catch((err) => {
		console.log(err.message);
	});
});

// EDIT
app.get('/reviews/:id/edit', (req, res) => {
	Review.findById(req.params.id, function(err, review) {
		res.render('reviews-edit', {review: review});
	});
});

// UPDATE
app.put('/reviews/:id', (req, res) => {
	Review.findByIdAndUpdate(req.params.id, req.body).then((review) => {
		res.redirect('/reviews/' + review._id);
	}).catch((err) => {
		console.log(err.message);
	});
});

// DELETE
app.delete('/reviews/:id', (req, res) => {
	console.log("DELETE review");
	Review.findByIdAndRemove(req.params.id).then((review) => {
		res.redirect('/');
	}).catch((err) => {
		console.log(err.message);
	});
});

app.listen(process.env.PORT || 3000, () => {
	console.log('App listening on port 3000!');
});
