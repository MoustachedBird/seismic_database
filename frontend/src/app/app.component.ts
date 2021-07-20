import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'watchbird.org';
  
  date_time= Date.now(); 
  
  constructor(){
    setInterval(() => {
      this.date_time= Date.now(); 
    }, 1000)
  }
}
