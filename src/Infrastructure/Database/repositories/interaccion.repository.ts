import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interaccion, TipoInteraccion } from '../../../Domain/Lead/entities/interaccion.entity';
import { InteraccionRepositoryPort } from '../../../Ports/repositories/interaccion.repository.port';

@Injectable()
export class InteraccionRepository implements InteraccionRepositoryPort {
  constructor(
    @InjectRepository(Interaccion)
    private readonly repo: Repository<Interaccion>,
  ) {}

  async registrar(datos: {
    lead_id: string;
    tipo: TipoInteraccion;
    mensaje?: string;
  }): Promise<Interaccion> {
    const interaccion = this.repo.create(datos);
    return this.repo.save(interaccion);
  }

  async listarPorLead(lead_id: string): Promise<Interaccion[]> {
    return this.repo.find({ where: { lead_id }, order: { fecha: 'DESC' } });
  }
}
