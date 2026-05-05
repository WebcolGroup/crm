import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LeadRepositoryPort } from '../../../Ports/repositories/lead.repository.port';
import { CitaRepositoryPort } from '../../../Ports/repositories/cita.repository.port';
import { LeadEstado } from '../../../Domain/Lead/value-objects/lead.enums';
import { EstadoCita } from '../../../Domain/Lead/entities/cita.entity';

// Caso de uso: n8n notifica al CRM que una cita fue realizada (o no show)
@Injectable()
export class MarcarCitaRealizadaUseCase {
  constructor(
    @Inject(LeadRepositoryPort)
    private readonly leadRepo: LeadRepositoryPort,
    @Inject(CitaRepositoryPort)
    private readonly citaRepo: CitaRepositoryPort,
  ) {}

  async ejecutar(calendlyEventId: string, realizada: boolean): Promise<void> {
    const cita = await this.citaRepo.buscarPorCalendlyId(calendlyEventId);
    if (!cita) throw new NotFoundException(`Cita con ID ${calendlyEventId} no encontrada`);

    const estadoCita = realizada ? EstadoCita.REALIZADA : EstadoCita.NO_SHOW;
    await this.citaRepo.actualizarEstado(calendlyEventId, estadoCita);

    const estadoLead = realizada ? LeadEstado.CITA_REALIZADA : LeadEstado.CONTACTADO;
    await this.leadRepo.actualizar(cita.lead_id, { estado: estadoLead });
  }
}
