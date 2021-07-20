/*Datalogger controller*/
const dataloggerCtrl = {}; /*controller object */

const { get } = require('mongoose');
/*Parser*/
const sensor = require('../models/sensor.parser');

/*Schemas */
const mongoDBschema = require('../models/sensordata.mongo');


/*Get function (from / or main route)*/
dataloggerCtrl.main = async(req, res) =>{
    const ITEMS_PER_SENSOR = 1500;
    const DATA_INTERVAL = Math.round(ITEMS_PER_SENSOR/req.params.resolution);
    //console.log(DATA_INTERVAL);

    /*DATABASE STRUCTURE (models/sensordata.mongo.js)
    data comes from 0 to ITEMS_PER_SENSOR - 1  
    
    example:
    {
        data: {[ 
            "0" : { "mma8451q_x" : 97, "mma8451q_y" : -44, "mma8451q_z" : 1040 ... }, 
            "1" : { "mma8451q_x" : 95, "mma8451q_y" : -50, "mma8451q_z" : 1040 ...},
            ...
            "1499" : { "mma8451q_x" : 95, "mma8451q_y" : -50, "mma8451q_z" : 1040 ...}
        ]}
        sample_rate: 400
        items_per_sensor: 4500
        time: 2020-11-01T04:27:05.617Z   <--- time of reception (asumed as last element time) 
    }
    */


    //AXIS TO LOOK FOR
    var hidden_fields = {'_id': 0,'__v':0, 'items_per_sensor':0, 'time':0};

    //looks for items, it depends of resolution query paramater
    for (var  item= 0; item < ITEMS_PER_SENSOR; item++){
        //allowed_content.data[item][item.toString]=1;
        if (item % DATA_INTERVAL != 0){  //if remainder of item/number is equal to
            hidden_fields['data.'+item.toString()]=0;
        }else{
            //hide X axis of mma8451q sensor
            if ((req.params.show_sensors & (1<<0))==0){
                hidden_fields['data.'+item.toString()+'.mma8451q_x']=0;
            }
            //hide Y axis of mma8451q sensor
            if ((req.params.show_sensors & (1<<1))==0){
                hidden_fields['data.'+item.toString()+'.mma8451q_y']=0;
            }
            //hide Z axis of mma8451q sensor
            if ((req.params.show_sensors & (1<<2))==0){
                hidden_fields['data.'+item.toString()+'.mma8451q_z']=0;
            }
            //hide X axis of adxl355 sensor
            if ((req.params.show_sensors & (1<<3))==0){
                hidden_fields['data.'+item.toString()+'.adxl355_x']=0;
            }
            //hide Y axis of adxl355 sensor
            if ((req.params.show_sensors & (1<<4))==0){
                hidden_fields['data.'+item.toString()+'.adxl355_y']=0;
            }
            //hide Z axis of adxl355 sensor
            if ((req.params.show_sensors & (1<<5))==0){
                hidden_fields['data.'+item.toString()+'.adxl355_z']=0;
            }
            //hide sm24 sensor
            if ((req.params.show_sensors & (1<<6))==0){
                hidden_fields['data.'+item.toString()+'.sm24']=0;
            }
        }
    }
    console.log("-=-=-=-=-=-=-=-=-[ DATA QUERY ]-=-=-=-=-=-=-=-=-=-=-");
    console.log(" ");
    console.log("TIME_START (local): ", req.params.time_start, " TIME_START (GTM):");
    var TIME_START = new Date(req.params.time_start);
    console.log(TIME_START);

    console.log("TIME_END (local): ", req.params.time_end, " TIME_END (GTM):");
    var TIME_END = new Date(req.params.time_end);
    console.log(TIME_END);


    //this will save data from DB as json data (DO QUERY)
    const JSON_data = await mongoDBschema.find(
        //Query ({} means look for all data)
        {
            time: {
                $gte: TIME_START, //grater than 
                $lt:  TIME_END //less than
            }
        },    
        //fields allowed (1) and not allowed (0)
        hidden_fields,    
        //return error in case
        function(err){
            if (err) {
                console.log(err);           
             }
            else
                console.log('MongoDB: Data found');
        }
    )
    //save database data as plain javascript objetc for saving time and RAM memmory
    .lean(); 
    //save only M elements of database
    //.limit(3);

    delete hidden_fields;
   
    /*Create TIME values for each value extracted from database

    La informacion se guarda en conjuntos de N numeros, por ejemplo en conjuntos de 1500
    datos por buffer guardado, este ciclo for crea el tiempo para cada uno de estos valores
    a partir de la frecuencia de muestreo y el tiempo inicial
    
    */
    //TIME_START.setSeconds( TIME_START.getSeconds() - ITEMS_PER_SENSOR/(JSON_data[0].sample_rate) );
    TIME_START.setSeconds( TIME_START.getSeconds());

    //AS JSON ARRAY
    var parsered_data = []; //array of points of the chart
    var chart_points={}; //points of chart
    for (var  item= 0; item < JSON_data.length; item++){
        var sample_period = (DATA_INTERVAL*1000)/(JSON_data[item].sample_rate); //in milliseconds
        for (var object_name=0; object_name<ITEMS_PER_SENSOR;object_name+=DATA_INTERVAL){
            //reset variable
            chart_points={}
            //X axis of mma8451q sensor is avaliable
            if ((req.params.show_sensors & (1<<0))!=0){
                chart_points.mma8451q_x= JSON_data[item].data[0][object_name.toString()].mma8451q_x;
            }
            //Y axis of mma8451q sensor is avaliable
            if ((req.params.show_sensors & (1<<1))!=0){
                chart_points.mma8451q_y= JSON_data[item].data[0][object_name.toString()].mma8451q_y;
            }
            //Z axis of mma8451q sensor is avaliable
            if ((req.params.show_sensors & (1<<2))!=0){
                chart_points.mma8451q_z= JSON_data[item].data[0][object_name.toString()].mma8451q_z;
            }
            
            //X axis of adxl355 sensor is avaliable
            if ((req.params.show_sensors & (1<<3))!=0){
                chart_points.adxl355_x= JSON_data[item].data[0][object_name.toString()].adxl355_x;
            }
            //Y axis of adxl355 sensor is avaliable
            if ((req.params.show_sensors & (1<<4))!=0){
                chart_points.adxl355_y= JSON_data[item].data[0][object_name.toString()].adxl355_y;
            }
            //Z axis of adxl355 sensor is avaliable
            if ((req.params.show_sensors & (1<<5))!=0){
                chart_points.adxl355_z= JSON_data[item].data[0][object_name.toString()].adxl355_z;
            }

            //SM-24 geophone is avaliable
            if ((req.params.show_sensors & (1<<6))!=0){
                chart_points.sm24= JSON_data[item].data[0][object_name.toString()].sm24;
            }

            //save time of each sample
            TIME_START.setMilliseconds(TIME_START.getMilliseconds() + sample_period)
            
            chart_points.time = TIME_START.getTime();
            //chart_points.time = TIME_START.toISOString();
            //chart_points.time = new Date (TIME_START);
            parsered_data.push(chart_points)
        }
        delete JSON_data[item];
    }

    delete JSON_data;
    res.send(parsered_data);
    console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
    
}



/*Store in DB POST function
for /datalogger route
*/
dataloggerCtrl.storeIntoDB = async(req,res) =>{
    res.send('Data Received'); //server response
    const recieved_post=req.rawBody; //get the raw data (binary information)
    
    /*print recieved_post (buffer) in hex format*/
    //console.log(recieved_post);

    const parsered_post = new mongoDBschema(sensor.Parser(recieved_post)); //parser and save the information in the defined shcema for mongodb 
    console.log('===================================================');
    console.log("First data recieved: "); //print parsered information
    console.log(parsered_post.data[0]['0']);
    console.log("Sample rate: " + parsered_post.sample_rate);
    console.log("Items per sensor: " +parsered_post.items_per_sensor);
    console.log("Date and time:");
    console.log(parsered_post.time);
    console.log('===================================================');
    
    //console.log(parsered_post);

    //store the information in mongodb
    
    await parsered_post.save(function(err){
        if (err) {
            console.log(err);           
         }
        else
            console.log('MongoDB: Data saved successfully');
    });
    
}



module.exports = dataloggerCtrl;