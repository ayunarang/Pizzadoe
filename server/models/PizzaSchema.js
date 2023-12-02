

const mongoose = require('mongoose');

const PizzaStoreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    options: [
        {
            name: String,
            img: String,
            price: Number,
        }]

}, {
    collection: 'Custompizza'
});



const PizzaSchema = mongoose.model('Custompizza', PizzaStoreSchema);

module.exports = PizzaSchema;
