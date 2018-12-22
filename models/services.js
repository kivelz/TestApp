const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require('../models/review');
const Tag = require('../models/tags')
const mongoosePaginate = require('mongoose-paginate');

const serviceSchema = new Schema({
    name: String,
    images: [ {url: String, public_id: String}],
    rating: Number,
    tags: [ String ],
    category: String,
    block_number: Number,
    street_name: String,
    country: String,
    postcode: Number,
    description: String,
    createdAT: { type: Date,  default: Date.now},
    location: String,
    geometry: {
        type: {
          type: String, 
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    properties: {
        description: String
    },
    author: {
        id: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }, 
        username: String
    },
    reviews: [
        {   type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    avgRating: { type: Number, default: 0 
    }
  

   
});

serviceSchema.pre('remove', async function() {
    await Review.remove({
        _id: {
            $in: this.reviews
        }
    });
});
serviceSchema.plugin(mongoosePaginate);

serviceSchema.methods.calculateAvgRating = function() {
	let ratingsTotal = 0;
	this.reviews.forEach(review => {
		ratingsTotal += review.rating;
	});
	this.avgRating = Math.round((ratingsTotal / this.reviews.length) * 10) / 10;
	const floorRating = Math.floor(this.avgRating);
	this.save();
	return floorRating;
}
const Services = mongoose.model("Services", serviceSchema);

module.exports = Services;
