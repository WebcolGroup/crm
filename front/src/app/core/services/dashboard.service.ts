import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardMetricas } from '../models/crm.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) {}

  getMetricas(): Observable<DashboardMetricas> {
    return this.http.get<DashboardMetricas>(`${environment.apiUrl}/dashboard/metricas`);
  }
}
