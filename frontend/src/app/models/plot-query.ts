
//here we define the structure of the query that we're going to do
export class PlotQuery {
    
    //to create checkbox in the form (html file)
    mma8451q_x: Boolean = false;
    mma8451q_y: Boolean = false;
    mma8451q_z: Boolean = false;
    
    adxl355_x: Boolean = false;
    adxl355_y: Boolean = false;
    adxl355_z: Boolean = false;
    
    sm24: Boolean =false;

    //variables to send query to server
    time_start : String = "";
    time_end : String = "";
    resolution : Number = 1; //items per axis to show
    sensors_to_show : Number = 0;
    //mma8452q_x : [Number];
    //mma8452q_y : [Number];
    //mma8452q_z : [Number];
}
