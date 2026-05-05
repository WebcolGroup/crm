import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InteraccionRepositoryPort } from '../../../Ports/repositories/interaccion.repository.port';
import { LeadRepositoryPort } from '../../../Ports/repositories/lead.repository.port';
import { CalcularScoreUseCase } from '../../../Application/Lead/use-cases/calcular-score.use-case';
import { N8nServicePort } from '../../../Ports/services/n8n.service.port';
import { RegistrarInteraccionDto } from '../dtos/registrar-interaccion.dto';
import { Interaccion } from '../../../Domain/Lead/entities/interaccion.entity';
import { LeadNivel } from '../../../Domain/Lead/value-objects/lead.enums';

@Injectable()
export class RegistrarInteraccionUseCase {
  constructor(
    @Inject(InteraccionRepositoryPort)
    private readonly interaccionRepo: InteraccionRepositoryPort,
    @Inject(LeadRepositoryPort)
    private readonly leadRepo: LeadRepositoryPort,
    @Inject(N8nServicePort)
    private readonly n8nService: N8nServicePort,
    private readonly calcularScore: CalcularScoreUseCase,
  ) {}

  async ejecutar(dto: RegistrarInteraccionDto): Promise<Interaccion> {
    const lead = await this.leadRepo.buscarPorId(dto.lead_id);
    if (!lead) throw new NotFoundException(`Lead ${dto.lead_id} no encontrado`);

    const interaccion = await this.interaccionRepo.registrar(dto);

    // Actualiza última interacción y recalcula score
    const todasInteracciones = await this.interaccionRepo.listarPorLead(dto.lead_id);
    const { score, nivel } = this.calcularScore.ejecutar(lead, todasInteracciones.length);

    const nivelAnterior = lead.nivel;
    await this.leadRepo.actualizar(dto.lead_id, {
      score,
      nivel,
      ultima_interaccion: new Date(),
    });

    // Si el lead acaba de volverse HOT, alertar
    if (nivel === LeadNivel.HOT && nivelAnterior !== LeadNivel.HOT) {
      this.n8nService.notificarLeadHot({ ...lead, score, nivel }).catch(() => null);
    }

    return interaccion;
  }
}
