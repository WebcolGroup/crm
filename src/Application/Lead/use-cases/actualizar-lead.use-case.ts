import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LeadRepositoryPort } from '../../../Ports/repositories/lead.repository.port';
import { N8nServicePort } from '../../../Ports/services/n8n.service.port';
import { CalcularScoreUseCase } from './calcular-score.use-case';
import { ActualizarLeadDto } from '../dtos/actualizar-lead.dto';
import { Lead } from '../../../Domain/Lead/entities/lead.entity';
import { InteraccionRepositoryPort } from '../../../Ports/repositories/interaccion.repository.port';

@Injectable()
export class ActualizarLeadUseCase {
  constructor(
    @Inject(LeadRepositoryPort)
    private readonly leadRepo: LeadRepositoryPort,
    @Inject(InteraccionRepositoryPort)
    private readonly interaccionRepo: InteraccionRepositoryPort,
    @Inject(N8nServicePort)
    private readonly n8nService: N8nServicePort,
    private readonly calcularScore: CalcularScoreUseCase,
  ) {}

  async ejecutar(id: string, dto: ActualizarLeadDto): Promise<Lead> {
    const lead = await this.leadRepo.buscarPorId(id);
    if (!lead) throw new NotFoundException(`Lead ${id} no encontrado`);

    const estadoAnterior = lead.estado;
    const datos: Partial<Lead> = { ...dto };

    // Recalcula score si cambia información relevante
    if (dto.empresa !== undefined || dto.problema !== undefined || dto.fuente !== undefined) {
      const interacciones = await this.interaccionRepo.listarPorLead(id);
      const datosParaScore = { ...lead, ...dto };
      const { score, nivel } = this.calcularScore.ejecutar(datosParaScore, interacciones.length);
      datos.score = score;
      datos.nivel = nivel;
    }

    const leadActualizado = await this.leadRepo.actualizar(id, datos);

    // Notifica a n8n cuando el estado cambia
    if (dto.estado && dto.estado !== estadoAnterior) {
      this.n8nService.notificarCambioEstado(leadActualizado, estadoAnterior).catch(() => null);
    }

    return leadActualizado;
  }
}
