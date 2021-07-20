import { Injectable } from '@angular/core';

//To communicate BACKEND with FRONTEND
import { HttpClient} from '@angular/common/http'; //http communication with backend
import { PlotQuery } from '../models/plot-query';


@Injectable({
  providedIn: 'root'
})
export class PlotQueryService {

  //readonly URL_API = 'http://localhost/datalogger';
  readonly URL_API = 'https://watchbird.org/datalogger/';

  //data query is PlotQury type variable (defined at models) 
  plotQuery : PlotQuery;

  //at the beginning we create a new PlotQuery
  constructor(private http: HttpClient) { 
      this.plotQuery = new PlotQuery; 
  }

  //function to get data from server using HTTP GET
  getDataForPlotting(data_query:any) {
    //ejemplo de consulta:
    //       Inicio/Fin/Resolucion/Sensores_a_mostrar
    //2020-09-26T09:00:00/2020-09-26T09:30:00/4/1
    console.log(this.URL_API+data_query.time_start+"/"+data_query.time_end+"/"+data_query.resolution+"/"+data_query.sensors_to_show);
    return this.http.get(this.URL_API+data_query.time_start+"/"+data_query.time_end+"/"+data_query.resolution+"/"+data_query.sensors_to_show);
  }

}
