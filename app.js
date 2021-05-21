const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override')
const Photosite = require('./models/photosite')

mongoose.connect('mongodb://localhost:27017/photodispo', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//----------------------------------------------------------------------

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/photosites', async (req, res) => {
    const photosites = await Photosite.find({});
    res.render('photosites/index', {photosites})
})



app.get('/photosites/new', (req, res) => {
    res.render('photosites/new');
})

app.post('/photosites', async (req, res) => {
    const photosite = new Photosite(req.body.photosite);
    await photosite.save();
    res.redirect(`/photosites/${photosite._id}`)
})

app.get('/photosites/:id', async (req, res) => {
    const photosite = await Photosite.findById(req.params.id)
    res.render('photosites/show', { photosite });
})

app.get('/photosites/:id/edit', async (req, res) => {
    const photosite = await Photosite.findById(req.params.id)
    res.render('photosites/edit', { photosite });
})

app.put('/photosites/:id', async (req, res) => {
    const { id } = req.params;
    const photosite = await Photosite.findByIdAndUpdate(id, {...req.body.photosite})
    res.redirect(`/photosites/${photosite._id}`)
})

app.delete('/photosites/:id', async (req, res) => {
    const { id } = req.params; 
    await Photosite.findByIdAndDelete(id);
    res.redirect('/photosites');
})


app.listen(3000, () => {
    console.log('Server running on port 3000')
})