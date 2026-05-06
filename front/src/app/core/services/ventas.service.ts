import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Venta, RegistrarVentaDto } from '../models/crm.models';

@Injectable({ providedIn: 'root' })
export class VentasService {
  private readonly base = `${environment.apiUrl}/ventas`;

  constructor(private http: HttpClient) {}

  registrar(dto: RegistrarVentaDto): Observable<Venta> {
    return this.http.post<Venta>(this.base, dto);
  }
}
