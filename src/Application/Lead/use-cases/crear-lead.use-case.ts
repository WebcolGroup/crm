import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { LeadRepositoryPort } from '../../../Ports/repositories/lead.repository.port';
import { N8nServicePort } from '../../../Ports/services/n8n.service.port';
import { CalcularScoreUseCase } from './calcular-score.use-case';
import { CrearLeadDto } from '../dtos/crear-lead.dto';
import { Lead } from '../../../Domain/Lead/entities/lead.entity';

@Injectable()
export class CrearLeadUseCase {
  constructor(
    @Inject(LeadRepositoryPort)
    private readonly leadRepo: LeadRepositoryPort,
    @Inject(N8nServicePort)
    private readonly n8nService: N8nServicePort,
    private readonly calcularScore: CalcularScoreUseCase,
  ) {}

  async ejecutar(dto: CrearLeadDto): Promise<Lead> {
    const existente = await this.leadRepo.buscarPorEmail(dto.email);
    if (existente) {
      throw new ConflictException(`Ya existe un lead con el email ${dto.email}`);
    }

    const { score, nivel } = this.calcularScore.ejecutar(dto, 0);

    const lead = await this.leadRepo.crear({ ...dto, score, nivel });

    // Notifica a n8n de forma no bloqueante para iniciar el flujo de bienvenida
    this.n8nService.notificarLeadNuevo(lead).catch(() => null);

    if (nivel === 'HOT') {
      this.n8nService.notificarLeadHot(lead).catch(() => null);
    }

    return lead;
  }
}
