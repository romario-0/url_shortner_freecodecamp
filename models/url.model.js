const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

UrlSchema = mongoose.Schema({
    originalUrl : String,
    shortUrl : Number
});

UrlSchema.plugin(AutoIncrement, {inc_field: 'shortUrl'});

const UrlModel = mongoose.model('Url', UrlSchema);

module.exports = UrlModel;