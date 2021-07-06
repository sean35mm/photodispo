const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Photosite = require("../models/photosite");

mongoose.connect("mongodb://localhost:27017/photodispo", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Photosite.deleteMany({});
	for (let i = 0; i < 50; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20 + 10);
		const site = new Photosite({
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			image: "https://source.unsplash.com/collection/564618/1600x900",
			description:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit, et facilis! Tempore, sed error facilis quae veritatis, harum, natus et aut ducimus placeat consequatur praesentium rem corrupti maiores quaerat iusto.",
			price,
		});
		await site.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
