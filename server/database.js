const mongoose = require('mongoose'); /*library to access to the MONGODB database */

const db_name = 'ESP32_test';
const URI = `mongodb://localhost/${db_name}`;

/*estabish connection to the local database (or create database if not created) */
mongoose.connect(URI,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(db => console.log ('Database is connected: ',db_name)) /*if everything is ok print it by the terminal*/
    .catch(err => console.error(err)); /* if not show error message */

module.exports = mongoose; /*to export the connection to the database */