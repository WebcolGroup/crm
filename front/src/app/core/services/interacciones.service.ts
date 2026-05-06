import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Interaccion, RegistrarInteraccionDto } from '../models/crm.models';

@Injectable({ providedIn: 'root' })
export class InteraccionesService {
  private readonly base = `${environment.apiUrl}/interacciones`;

  constructor(private http: HttpClient) {}

  registrar(dto: RegistrarInteraccionDto): Observable<Interaccion> {
    return this.http.post<Interaccion>(this.base, dto);
  }
}
