import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Lead, LeadFiltros, CrearLeadDto, ActualizarLeadDto } from '../models/crm.models';

@Injectable({ providedIn: 'root' })
export class LeadsService {
  private readonly base = `${environment.apiUrl}/leads`;

  constructor(private http: HttpClient) {}

  list(filtros: LeadFiltros = {}): Observable<Lead[]> {
    let params = new HttpParams();
    if (filtros.nivel) params = params.set('nivel', filtros.nivel);
    if (filtros.estado) params = params.set('estado', filtros.estado);
    if (filtros.fuente) params = params.set('fuente', filtros.fuente);
    if (filtros.busqueda) params = params.set('busqueda', filtros.busqueda);
    if (filtros.pagina) params = params.set('pagina', filtros.pagina);
    if (filtros.limite) params = params.set('limite', filtros.limite);
    return this.http.get<Lead[]>(this.base, { params });
  }

  getById(id: string): Observable<Lead> {
    return this.http.get<Lead>(`${this.base}/${id}`);
  }

  create(dto: CrearLeadDto): Observable<Lead> {
    return this.http.post<Lead>(this.base, dto);
  }

  update(id: string, dto: ActualizarLeadDto): Observable<Lead> {
    return this.http.patch<Lead>(`${this.base}/${id}`, dto);
  }
}
