const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
	body: {
		type: String
	},
	rating: Number,
	avatar: String,
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	createdAT: { type: Date,  default: Date.now}
});

module.exports = mongoose.model('Review', ReviewSchema);
