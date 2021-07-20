import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Plotting 
import { LineChartComponent } from './components/line-chart/line-chart.component';

//To communicate BACKEND with FRONTEND
import { FormsModule } from '@angular/forms'; //to make forms  
import { HttpClientModule} from '@angular/common/http';

//material angular module animations
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; //http communication with backend

import {MatCheckboxModule} from '@angular/material/checkbox'; //check box
import {MatChipsModule} from '@angular/material/chips';//date time picker

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';



@NgModule({
  declarations: [
    AppComponent,
    LineChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
