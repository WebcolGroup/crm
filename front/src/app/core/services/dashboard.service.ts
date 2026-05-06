import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DashboardMetricas } from '../models/crm.models';

interface DashboardMetricasApi {
  total_leads: number;
  leads_hot: number;
  valor_pipeline: number;
  valor_cerrado: number;
  tasa_conversion: number;
  leads_por_estado: { estado: string; total: number }[];
  leads_recientes: any[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) {}

  getMetricas(): Observable<DashboardMetricas> {
    return this.http.get<DashboardMetricasApi>(`${environment.apiUrl}/dashboard/metricas`).pipe(
      map((r) => ({
        totalLeads: r.total_leads,
        leadsHOT: r.leads_hot,
        pipelineValue: r.valor_pipeline,
        closedSales: r.valor_cerrado,
        conversionRate: r.tasa_conversion,
        leadsByState: Object.fromEntries(r.leads_por_estado.map((e) => [e.estado, Number(e.total)])),
        last7DaysLeads: r.leads_recientes.map((l) => l.count ?? 1),
      })),
    );
  }
}
