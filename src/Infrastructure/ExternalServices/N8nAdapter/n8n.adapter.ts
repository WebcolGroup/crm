import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Lead } from '../../../Domain/Lead/entities/lead.entity';
import { N8nServicePort } from '../../../Ports/services/n8n.service.port';

// Adaptador que envía eventos al webhook de n8n.
// n8n enruta cada evento al flujo correspondiente (WhatsApp, email, Calendly, etc.)
@Injectable()
export class N8nAdapter implements N8nServicePort {
  private readonly logger = new Logger(N8nAdapter.name);
  private readonly webhookUrl: string;
  private readonly apiKey: string;

  constructor(private readonly config: ConfigService) {
    this.webhookUrl = this.config.get<string>('N8N_WEBHOOK_URL');
    this.apiKey = this.config.get<string>('N8N_API_KEY');
  }

  async notificarLeadNuevo(lead: Lead): Promise<void> {
    await this.enviar('lead.nuevo', lead);
  }

  async notificarLeadHot(lead: Lead): Promise<void> {
    await this.enviar('lead.hot', lead);
  }

  async notificarCambioEstado(lead: Lead, estadoAnterior: string): Promise<void> {
    await this.enviar('lead.estado_cambiado', { lead, estadoAnterior });
  }

  async notificarCitaAgendada(lead: Lead, fechaCita: Date): Promise<void> {
    await this.enviar('cita.agendada', { lead, fechaCita });
  }

  private async enviar(evento: string, payload: unknown): Promise<void> {
    try {
      await axios.post(
        this.webhookUrl,
        { evento, payload, timestamp: new Date().toISOString() },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': this.apiKey,
          },
          timeout: 5000,
        },
      );
    } catch (error) {
      this.logger.warn(`Error al notificar n8n [${evento}]: ${error.message}`);
    }
  }
}
