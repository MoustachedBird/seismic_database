import { Component, OnInit } from '@angular/core';

//We import the all required modules 
import * as d3 from 'd3';
import * as d3Scale from 'd3';
import * as d3Shape from 'd3';
import * as d3Array from 'd3';
import * as d3Axis from 'd3';


//to communicate frontend with backend
import {PlotQueryService} from '../../services/plot-query.service'
import { NgForm } from '@angular/forms';
import { PlotQuery } from 'src/app/models/plot-query';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
  providers: [PlotQueryService],
})
export class LineChartComponent implements OnInit {

  //https://blog.logrocket.com/data-visualization-angular-d3/
  //https://www.geekstrick.com/integrate-d3-with-angular-9/
  //http://bl.ocks.org/benjchristensen/2579599

  //list of available sensors (this text is used to generate buttons)
  public buttonsTexts:Array<string> = [];

  //to generate constants to get data units 
  private convertionFormula:Array<number> = [];
  
  //units of each sensor
  private unitsNames:Array<string> = [];


  //to add new buttons
  public addButton(button_name:any):void {
    this.buttonsTexts = [...this.buttonsTexts, `${button_name}`];
  }
  
  //Error status
  public statusError = false; 


  //progress spinner status (hide = false, show = true)
  public statusSpinner = false; 

  //progress spinner 
  public showSpinner():void {
    this.statusSpinner = true;
  }

  public title = 'Test chart';
  
  //to save data received from server  
  private data:any = [];

  private svg:any; //to save SVG image that D3 creates
  private margin = {top: 10, right: 30, bottom: 50, left: 60}; //margenes de la grafica
  private width = 750 - this.margin.right - this.margin.left; //ancho de la grafica
  private height = 400 - this.margin.top - this.margin.bottom; //alto de la grafica


/*==============================================================
  Function to create X axis scale 
================================================================*/
  private xAxis = d3.scaleTime()
    .rangeRound([0, this.width])
    .domain([new Date(1601128791812),new Date (1601129880056)]);
    //.nice();
    //.domain(<[Date, Date]>d3.extent(data, function (d:any) { return d.time; }));


/*==============================================================
  Function to create Y axis scale 
================================================================*/
  // Y scale will fit values from 0- maximum value within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
    //d3.max(data) for detecting the maximum element in the data array
  private yAxis = d3.scaleLinear()
    //y maximum size
    .domain([-10000, 10000])
    .range([this.height, 0])
    .nice();

  
  
/*==============================================================
  Function to create empty svg zone
================================================================*/
  private createSvg(): void {
    this.svg = d3.select("figure#line_chart")
    .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
    .append("g")
      .attr("transform","translate(" + this.margin.left + "," + this.margin.top + ")");
  }

/*==============================================================
  To generate sensor available list / button list
================================================================*/
  private checkAvailableSensors(form:any): void {
    //reset the arrays to prevent errors
    this.buttonsTexts = [];
    this.unitsNames = [];
    this.convertionFormula = [];

    // List of sensors to plot
    // MMA8451Q
    if (form.mma8451q_x==1){
      this.addButton("mma8451q_x");
      this.unitsNames.push('gal');
      this.convertionFormula.push(1000/4096);
    }
    if (form.mma8451q_y==1){
      this.addButton("mma8451q_y");
      this.unitsNames.push('gal');
      this.convertionFormula.push(1000/4096);
    }
    if (form.mma8451q_z==1){
      this.addButton("mma8451q_z");
      this.unitsNames.push('gal');
      this.convertionFormula.push(1000/4096);
    }
    // ADXL355
    if (form.adxl355_x==1){
      this.addButton("adxl355_x");
      this.unitsNames.push('gal');
      this.convertionFormula.push(1/256);
    }
    if (form.adxl355_y==1){
      this.addButton("adxl355_y");
      this.unitsNames.push('gal');
      this.convertionFormula.push(1/256);
    }
    if (form.adxl355_z==1){
      this.addButton("adxl355_z");
      this.unitsNames.push('gal'); 
      this.convertionFormula.push(1/256);  
    }
    // SM-24 GEOPHONE
    if (form.sm24==1){
      this.addButton("sm24");
      this.unitsNames.push('cm/s');
      var amp:number=2;
      this.convertionFormula.push(1.65/(8388607*0.288*amp));      
    }
  }

/*==============================================================
  D3js function: Updates the chart if click on button or 
  generates the chart the first time
================================================================*/
public updateChart(index:number): void {
  
  if (this.data.length == 0){ 
    this.statusError=true; //set true error status, no data have been sent
  }else{
    this.statusError=false; //reset error status
  }
  
  //Reset plot before plotting
  this.svg.selectAll("*").remove();
  
  // Parse dates 
  this.data.forEach((element:any) => {
    element.time = new Date (element.time);
  });

  //get first and last datetime
  const time_start = this.data[0].time;
  const time_end = this.data[this.data.length-1].time;
  
  // update X scale
  this.xAxis.domain([time_start,time_end]);
  
  // Draw the X-axis labels 
  this.svg.append("g")
    .attr("transform", "translate(0," + this.height + ")")
    .call(d3.axisBottom(this.xAxis))
    //.call(d3.axisBottom(xAxis).tickFormat(d3.timeFormat("%d-%m-%y %H:%M:%S.%L"))) 
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-10)")
      .style("text-anchor", "end");
  
  // update Y scale (if type any dont specified then it will cause an error)
  var max:any = d3.max(this.data, (each_element:any) => each_element[this.buttonsTexts[index]]);    
  var min:any = d3.min(this.data, (each_element:any) => each_element[this.buttonsTexts[index]]);    
  this.yAxis.domain([min,max]);
  
  
  // Draw the Y-axis labels 
  var format = d3.format(".2f"); //to show only 2 decimal values
  this.svg.append("g")
    .call(d3.axisLeft(this.yAxis).tickFormat((d : any) => format (d * this.convertionFormula[index]) + this.unitsNames[index]));
    /*tickformat is used to change the scale of the axis, in this way we dont show counts (bits)
    we show units
    */
  
  
  
  //Draw lines (generates the chart)
  this.svg.append("path")
    .datum(this.data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x( (d: any) => this.xAxis(d.time) )
      .y( (d: any) => this.yAxis(d[this.buttonsTexts[index]]) )
    );
  
}


/*==============================================================
  Constructor: this function is excuted when the page is loaded or reloaded
================================================================*/
  constructor (public plotQueryService: PlotQueryService) {  
  }
  
  //Values loaded at the begining, when web page is loaded
  ngOnInit(): void {
    this.createSvg();
    //this.drawLines([0]);
 
    // Draw the X-axis labels 
    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(this.xAxis))
      //.call(d3.axisBottom(xAxis).tickFormat(d3.timeFormat("%d-%m-%y %H:%M:%S.%L"))) 
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-10)")
        .style("text-anchor", "end");
      
    // Draw the Y-axis labels 
    this.svg.append("g")
      .call(d3.axisLeft(this.yAxis));
    
  }

/*==============================================================
  Gets the information to plot from server
================================================================*/
  dataQuery(form : NgForm){
    form.value.sensors_to_show = (form.value.sm24 <<6) | (form.value.adxl355_z <<5) | (form.value.adxl355_y <<4) | (form.value.adxl355_x <<3) | (form.value.mma8451q_z <<2) | (form.value.mma8451q_y <<1) | form.value.mma8451q_x 
    console.log('Valores a enviar');
    console.log(form.value);
    
    this.plotQueryService. getDataForPlotting(form.value) //send query to server
      .subscribe(res =>{//  //and wait for response
        this.statusSpinner = false; //hide spinner
        this.checkAvailableSensors(form.value); //generates list of available sensors
        this.data=res; //save server response
        this.updateChart(0); //generates the chart with the first selected sensor
      },error => {
        console.log('Oops...', error)
        this.statusError=true; //set true error status
        this.statusSpinner = false; //hide spinner
      }); 
  }
  

/*==============================================================
  Reset/Clean form
================================================================*/
  // ? means optional parameter, example form? means that parameter "form" is optional
  resetForm(form? : NgForm){
    //if form exist then do 
    if (form){
      form.reset();
      this.plotQueryService.plotQuery = new PlotQuery();
    }
  }

}
