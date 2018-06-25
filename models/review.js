const mongoose = require('mongoose');
const Schema = mongoose.Schema

const Review = mongoose.model('Review', {
	title: String,
	movieTitle: String,
	description: String,
	rating: Number,
});

module.exports = Review;