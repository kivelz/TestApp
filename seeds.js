const faker = require('faker');
const Services = require('./models//services');
const cities = require('./cities');

async function seedPosts() {
	await Services.deleteMany({});
	for(const i of new Array(1)) {
		const random1000 = Math.floor(Math.random() * 1000);
		const name = faker.lorem.word();
		const description = faker.lorem.text();
		const serviceData = {
			name,
			description,
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			geometry: {
				type: 'Point',
				coordinates: [cities[random1000].longitude, cities[random1000].latitude],
			},
			author: {
				'id' : '5bb27cd1f986d278582aa58c',
		    'username' : 'ian'
		  }
		}
		let service = new Services(serviceData);
		service.properties.description = `<strong><a href="/services/${service._id}">${name}</a></strong><p>${service.location}</p><p>${description.substring(0, 20)}...</p>`;
		service.save();
	}
	console.log('600 new posts created');
}

module.exports = seedPosts;