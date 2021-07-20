const mongoose = require('mongoose'); /*library to access to the MONGODB database */
const {Schema} = mongoose; /*we only requery schema module from mongoose package  */

const collection_name = 'test_1';

/*define the data structure */
const SensorDataDB = new Schema({
    data : {
        type: Array,  //to Store an array of JSON files
        required: true
    },
    sample_rate: {
        type: Number, 
        required: true
    },
    items_per_sensor: {
        type: Number, 
        required: true
    },
    //Time format example: 2021-03-06T08:59:37.769Z
    time : { 
        type : Date, 
        required: true
    }
});

/*we pass the template to mongoose and exports the schema */
module.exports = mongoose.model(collection_name,SensorDataDB);

