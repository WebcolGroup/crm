import { Inject, Injectable } from '@nestjs/common';
import { LeadRepositoryPort } from '../../../Ports/repositories/lead.repository.port';
import { CitaRepositoryPort } from '../../../Ports/repositories/cita.repository.port';
import { N8nServicePort } from '../../../Ports/services/n8n.service.port';
import { LeadEstado } from '../../../Domain/Lead/value-objects/lead.enums';
import { EstadoCita } from '../../../Domain/Lead/entities/cita.entity';

// Evento que envía Calendly vía webhook al agendarse o cancelarse una cita
export interface EventoCalendly {
  event: 'invitee.created' | 'invitee.canceled';
  payload: {
    event: string;          // ID del evento en Calendly
    scheduled_event: {
      start_time: string;
      location?: { join_url?: string };
    };
    invitee: {
      email: string;
      name: string;
    };
  };
}

@Injectable()
export class ProcesarCitaCalendlyUseCase {
  constructor(
    @Inject(LeadRepositoryPort)
    private readonly leadRepo: LeadRepositoryPort,
    @Inject(CitaRepositoryPort)
    private readonly citaRepo: CitaRepositoryPort,
    @Inject(N8nServicePort)
    private readonly n8nService: N8nServicePort,
  ) {}

  async ejecutar(evento: EventoCalendly): Promise<void> {
    const { payload } = evento;
    const email = payload.invitee.email;

    const lead = await this.leadRepo.buscarPorEmail(email);
    if (!lead) return; // Lead no registrado en el CRM

    if (evento.event === 'invitee.created') {
      const fechaCita = new Date(payload.scheduled_event.start_time);

      await this.citaRepo.crear({
        lead_id: lead.id,
        fecha: fechaCita,
        url_reunion: payload.scheduled_event.location?.join_url,
        calendly_event_id: payload.event,
      });

      await this.leadRepo.actualizar(lead.id, { estado: LeadEstado.CITA_AGENDADA });

      this.n8nService.notificarCitaAgendada(lead, fechaCita).catch(() => null);
    }

    if (evento.event === 'invitee.canceled') {
      await this.citaRepo.actualizarEstado(payload.event, EstadoCita.CANCELADA);
    }
  }
}
