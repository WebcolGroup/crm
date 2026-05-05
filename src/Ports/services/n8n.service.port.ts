import { Lead } from '../../Domain/Lead/entities/lead.entity';

// Puerto para notificar eventos al sistema n8n.
// El adaptador concreto llama al webhook de n8n vía HTTP.
export abstract class N8nServicePort {
  abstract notificarLeadNuevo(lead: Lead): Promise<void>;
  abstract notificarLeadHot(lead: Lead): Promise<void>;
  abstract notificarCambioEstado(lead: Lead, estadoAnterior: string): Promise<void>;
  abstract notificarCitaAgendada(lead: Lead, fechaCita: Date): Promise<void>;
}
