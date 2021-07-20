/*Parser function*/

//const utf8 = require('utf8');
const sensor= {}; /*parser object */

/*Parser sensor data*/
sensor.Parser= function(data){
    var json_parsered = {}; //to save parsered information

    /*to store items per axis (number)*/
    const ITEMS_PER_SENSOR = (data[0]<<8)|(data[1]); //16 bit number
    const NUMBER_OF_SENSORS = data[2]; //8 bit number 
    const SAMPLE_RATE = (data[3]<<8)|(data[4]); //16 bit number
    const ID_STATION = data[5]; //8 bit number
    
    //12 char string (datetime format: 2021-03-06T08:59:37.769Z)
    //year
    var LOCAL_DATETIME='20'+String.fromCharCode(data[6])+String.fromCharCode(data[7]);
    //month
    LOCAL_DATETIME+='-'+String.fromCharCode(data[8])+String.fromCharCode(data[9]);
    //day
    LOCAL_DATETIME+='-'+String.fromCharCode(data[10])+String.fromCharCode(data[11]);
    //hours
    LOCAL_DATETIME+='T'+String.fromCharCode(data[12])+String.fromCharCode(data[13]);
    //minutes
    LOCAL_DATETIME+=':'+String.fromCharCode(data[14])+String.fromCharCode(data[15]);
    //seconds
    LOCAL_DATETIME+=':'+String.fromCharCode(data[16])+String.fromCharCode(data[17]);
    
    //print just for debbuging
    console.log('ITEMS_PER_SENSOR:',ITEMS_PER_SENSOR); 
    console.log('NUMBER_OF_SENSORS:',NUMBER_OF_SENSORS); 
    console.log('SAMPLE_RATE:',SAMPLE_RATE); 
    console.log('ID_STATION:',ID_STATION); 
    console.log('LOCAL_DATETIME:',LOCAL_DATETIME); 
    
    
    
    var BITS_PER_ITEM = 0; /*number of bits of information of sensor (depends of the ID)*/
    var array_position = 18; /*array position of the first sensor*/
    
    //to store sensor value, JSON structure defined below
    var sensor_values = {};
    //reset json
    for (var each_item =0; each_item<ITEMS_PER_SENSOR; each_item++){
        sensor_values[each_item.toString()]={};
    }
    
    //to store sensor name in string format
    var sensor_name = "";
    
    //to save data converted (join bytes, in case sensor is more than 8 bits)
    var data_converted = 0;

    //N number of bits to shift one byte, algorithm assumes that sensor are left shifted
    var shifting = 0;
    
    //to identify when value is negative
    var negative_flag = 0;
    /*
    ID of each sensor
        0 = SM-24 (ADC 24 BITS mcp3561)
        1 = ADXL355 X axis 
        2 = ADXL355 Y axis
        3 = ADXL355 Z axis
        4 = mma8451q X axis
        5 = mma8451q Y axis
        6 = mma8451q Z axis
    

    
    -------------------------------------------------------------------------------------
    JSON structure...
    sensor_values['item'] = 
        {
            'sensor_0':data0,
            'sensor_1':data1,
            'sensor_2':data2,
        }

    Example:
    sensor_values['0'] = 
        {
            'mma8451q_x':data[0],
            'mma8451q_y':data[1],
            'mma8451q_z':data[2],
        }

    sensor_values['1'] = 
        {
            'mma8451q_x':data[0],
            'mma8451q_y':data[1],
            'mma8451q_z':data[2],
        }
    --------------------------------------------------------------------------------------
    */

    //each sensor in buffer
    for (var each_sensor =0 ; each_sensor<NUMBER_OF_SENSORS; each_sensor++){
        switch(data[array_position]) {
            //if sensor ID=0, then it means SM-24 GEOPHONE  (ADC 24 bits mcp5461)
            case 0:
                sensor_name="sm24";
                BITS_PER_ITEM=24;
                console.log('SENSOR[',each_sensor,'] =',sensor_name); 
                break;
            //if sensor ID=0, then it means adxl355 (20 bit adc)
            case 1:
                sensor_name="adxl355_x";
                BITS_PER_ITEM=20;
                console.log('SENSOR[',each_sensor,'] =',sensor_name); 
                break;
            case 2:
                sensor_name="adxl355_y";
                BITS_PER_ITEM=20;
                console.log('SENSOR[',each_sensor,'] =',sensor_name);
                break;
            case 3:
                sensor_name="adxl355_z";
                BITS_PER_ITEM=20;
                console.log('SENSOR[',each_sensor,'] =',sensor_name); 
                break;
            case 4:
                sensor_name="mma8451q_x";
                BITS_PER_ITEM=14;
                console.log('SENSOR[',each_sensor,'] =',sensor_name);
                break;
            case 5:
                sensor_name="mma8451q_y";
                BITS_PER_ITEM=14;
                console.log('SENSOR[',each_sensor,'] =',sensor_name); 
                break;
            case 6:
                sensor_name="mma8451q_z";
                BITS_PER_ITEM=14;
                console.log('SENSOR[',each_sensor,'] =',sensor_name); 
                break;
            default:
                BITS_PER_ITEM=0;
                console.log('ERROR: SENSOR[',each_sensor,'] NOT RECOGNIZED'); 
                break;
        }

        //each item in sensor
        for (var each_item =0; each_item<ITEMS_PER_SENSOR; each_item++){
            //reset variables
            data_converted=0;
            shifting= BITS_PER_ITEM;
            
            //each byte in item
            for(var each_byte=0; each_byte<Math.ceil(BITS_PER_ITEM/8); each_byte++){
                array_position++;
                shifting-=8;
                if (shifting<0){
                    shifting*=-1;
                    data_converted = data_converted | (data[array_position]>>shifting)
                }
                else{
                    data_converted = data_converted | (data[array_position]<<shifting)
                }                 
            }

            //add negative sing 
            negative_flag= (2 ** (BITS_PER_ITEM-1))-1;
            if (data_converted > negative_flag) data_converted -= negative_flag*2; //para 24 bits

            //Here we save parsered information
            sensor_values[each_item.toString()][sensor_name] = data_converted;
        }
        array_position++;
    }

    console.log('TOTAL SIZE OF BUFFER = ',array_position,' bytes'); 
                   
    //console.log(sensor_values); //print parsered information
    
    //store the parsered information in json object 
    json_parsered.data=sensor_values;
    json_parsered.sample_rate=SAMPLE_RATE;
    json_parsered.items_per_sensor=ITEMS_PER_SENSOR; 
    json_parsered.time=new Date(LOCAL_DATETIME);
    
    //const parsered_json = {};
    return json_parsered;    
}



module.exports = sensor;

