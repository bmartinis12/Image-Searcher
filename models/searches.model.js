let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Searches schema 

let searchesSchema = new Schema({
    searchQuery: { type: String, required: true },
    date: Date
});

let Searches = mongoose.model('Searches', searchesSchema, 'searches');

module.exports = { Searches };