// variables 

let express = require('express');
let app = express();
let mongoose = require('mongoose');
require('dotenv').config();
let Searches = require('./models/searches.model').Searches;

// connect to database 

mongoose.connect(process.env.DB, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

// middleware

app.use(express.static('public'));
app.use(express.json());

// fetch from api 

app.get('/pictures/:input', (req, res) => {
    let input = req.params.input;
    let page = req.query.page
    let headers = {
        "Authorization": `Client-ID ${process.env.KEY}`,
        "Accept-Version": 'v1',
    };

    fetch(`https://api.unsplash.com/search/photos?per_page=20&page=${page}&query=${input}`, {
        headers,
    })
        .then((response) => response.json())
        .then((data) => res.send(data));
});

// Searches routes 

app.get('/searches', async (req, res) => {
    let searchList = await Searches.find();
    res.send(searchList);
});

app.post('/searches', async (req, res) => {
    let input = req.body.search.toLowerCase();
    let findSearch = await Searches.find({ searchQuery: input });
    let count = await Searches.countDocuments({});

    if(count > 4 && findSearch.length == 0){
        let oldestSearch = await Searches.find().sort({ date: 1 }).limit(1);
        await Searches.deleteOne({ searchQuery: oldestSearch[0].searchQuery });
    }

    if(findSearch.length == 0){
        let newSearch = new Searches({
            searchQuery: input,
            date: new Date()
        });
        await newSearch.save();
        res.send('Saved');
    } else {
        res.send('Already added');
    }
})

// Load sever on port 3000

let port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}.....`));
