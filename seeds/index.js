const mongoose = require('mongoose'); 
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers')
const Campground = require('../models/campground')
const mbxGeocoding = require("../node_modules/@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: 'pk.eyJ1IjoiaWNyaXN0aWFuIiwiYSI6ImNsbjhwOWF2MTAxNWcycXBpYmlqbWpkaHEifQ.oMNNeo6gIO0U8X9SZAw6jA' });

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const sample = array => array[Math.floor(Math.random() * array.length)];



const seedDB = async() => {
    await Campground.deleteMany({});

    for(let i = 0; i < 300; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6511a953f48e30e01f3733e5',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            price: price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dyae0xqpx/image/upload/v1696234703/YelpCamp/photo-1507668339897-8a035aa9527d_qn80sn.jpg',
                    filename: 'YelpCamp/photo-1507668339897-8a035aa9527d_qn80sn'
                }, 
                {
                    url: 'https://res.cloudinary.com/dyae0xqpx/image/upload/v1696234652/YelpCamp/photo-1518602164578-cd0074062767_vi4bbx.jpg',
                    filename: 'Yelp Camp/photo-1518602164578-cd0074062767_vi4bbx'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => db.close())