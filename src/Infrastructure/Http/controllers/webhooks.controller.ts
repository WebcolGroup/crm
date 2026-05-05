import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProcesarCitaCalendlyUseCase } from '../../../Application/Cita/use-cases/procesar-cita-calendly.use-case';
import { MarcarCitaRealizadaUseCase } from '../../../Application/Cita/use-cases/marcar-cita-realizada.use-case';
import { ActualizarLeadUseCase } from '../../../Application/Lead/use-cases/actualizar-lead.use-case';
import { ActualizarLeadDto } from '../../../Application/Lead/dtos/actualizar-lead.dto';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly procesarCitaCalendly: ProcesarCitaCalendlyUseCase,
    private readonly marcarCitaRealizada: MarcarCitaRealizadaUseCase,
    private readonly actualizarLead: ActualizarLeadUseCase,
  ) {}

  /**
   * POST /webhooks/calendly
   * Calendly llama este endpoint cuando un lead agenda o cancela una cita.
   * Actualiza automáticamente el estado del lead en el pipeline.
   *
   * Body Calendly: { event: "invitee.created"|"invitee.canceled", payload: { ... } }
   */
  @Post('calendly')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook de Calendly para citas' })
  async calendly(@Body() body: any) {
    await this.procesarCitaCalendly.ejecutar(body);
    return { ok: true };
  }

  /**
   * POST /webhooks/n8n-update
   * n8n usa este endpoint para actualizar el estado de un lead
   * tras ejecutar una automatización (email enviado, WhatsApp respondido, etc.)
   *
   * Body: { lead_id: "uuid", estado?: "contactado", valor_estimado?: 5000, ... }
   */
  @Post('n8n-update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook para actualizaciones desde n8n' })
  async n8nUpdate(@Body() body: { lead_id: string } & ActualizarLeadDto) {
    const { lead_id, ...dto } = body;
    return this.actualizarLead.ejecutar(lead_id, dto);
  }

  /**
   * POST /webhooks/cita-realizada
   * n8n notifica que una llamada fue completada o el lead hizo no-show.
   *
   * Body: { calendly_event_id: "...", realizada: true }
   */
  @Post('cita-realizada')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook para marcar cita como realizada o no-show' })
  async citaRealizada(@Body() body: { calendly_event_id: string; realizada: boolean }) {
    await this.marcarCitaRealizada.ejecutar(body.calendly_event_id, body.realizada);
    return { ok: true };
  }
}
