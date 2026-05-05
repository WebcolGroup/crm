import { Cita, EstadoCita } from '../../Domain/Lead/entities/cita.entity';

export abstract class CitaRepositoryPort {
  abstract crear(datos: {
    lead_id: string;
    fecha: Date;
    url_reunion?: string;
    calendly_event_id?: string;
  }): Promise<Cita>;

  abstract actualizarEstado(calendly_event_id: string, estado: EstadoCita): Promise<void>;
  abstract buscarPorCalendlyId(calendly_event_id: string): Promise<Cita | null>;
  abstract listarPorLead(lead_id: string): Promise<Cita[]>;
}
