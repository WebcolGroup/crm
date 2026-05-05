import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cita, EstadoCita } from '../../../Domain/Lead/entities/cita.entity';
import { CitaRepositoryPort } from '../../../Ports/repositories/cita.repository.port';

@Injectable()
export class CitaRepository implements CitaRepositoryPort {
  constructor(
    @InjectRepository(Cita)
    private readonly repo: Repository<Cita>,
  ) {}

  async crear(datos: {
    lead_id: string;
    fecha: Date;
    url_reunion?: string;
    calendly_event_id?: string;
  }): Promise<Cita> {
    const cita = this.repo.create(datos);
    return this.repo.save(cita);
  }

  async actualizarEstado(calendly_event_id: string, estado: EstadoCita): Promise<void> {
    await this.repo.update({ calendly_event_id }, { estado });
  }

  async buscarPorCalendlyId(calendly_event_id: string): Promise<Cita | null> {
    return this.repo.findOne({ where: { calendly_event_id } });
  }

  async listarPorLead(lead_id: string): Promise<Cita[]> {
    return this.repo.find({ where: { lead_id }, order: { fecha: 'DESC' } });
  }
}
