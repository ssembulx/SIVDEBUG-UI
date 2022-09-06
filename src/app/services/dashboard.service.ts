import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CumulativeChartModel } from '../models/cumulative-chart.model';

import { Constent } from '../shared/constent';

@Injectable()
export class DashboardService {

  constructor(private http: HttpClient) { }

  public GetCumulativeChart():Observable<CumulativeChartModel>{
    return this.http.get<CumulativeChartModel>(Constent.GetCumulativeChart);
  }
}
