/*======  This file start the server  =========*/
const express = require('express');  //express package
const morgan = require('morgan');//morgan package
const cors = require ('cors'); //to communicate backend with frontend

const app = express();  //main app

const { mongoose }= require('./database'); /*holds the moongose connection */

/*======  Settings  =======*/
app.set('port',process.env.PORT || 3000); /*globlal variable, accesible from any part/file of the project */
app.use(express.static(__dirname + '/../frontend/dist/frontend')); //to read graphical interphase (HMTL WEB PAGE)

/*======  Middlewares (data processing)  ========*/
app.use(morgan('dev')); //to see the time of each server response
app.use(cors()); //to communicate with frontend

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf
  }
})); //for understanding raw (binary) format

app.use(express.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true,
    verify: (req, res, buf) => {
      req.rawBody = buf
    }
})); //for urlencoded format


/*======  Routes (links avaliable)  ========*/
app.use('/datalogger',require('./routes/datalogger.routes'));
app.use('/firmware',require('./routes/firmware.routes'));

/*
app.get('/',(req, res) => {
    return res.render('index.html');
});*/

/*======  Starting server  =========*/
app.listen(app.get('port'), () => {
  console.log('Sever listening at http://localhost:',app.get('port'));
})