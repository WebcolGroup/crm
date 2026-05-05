import { Inject, Injectable } from '@nestjs/common';
import { LeadRepositoryPort, FiltrosLead, ResultadoPaginado } from '../../../Ports/repositories/lead.repository.port';
import { Lead } from '../../../Domain/Lead/entities/lead.entity';
import { FiltroLeadsDto } from '../dtos/filtro-leads.dto';

@Injectable()
export class ListarLeadsUseCase {
  constructor(
    @Inject(LeadRepositoryPort)
    private readonly leadRepo: LeadRepositoryPort,
  ) {}

  async ejecutar(dto: FiltroLeadsDto): Promise<ResultadoPaginado<Lead>> {
    const filtros: FiltrosLead = {
      nivel: dto.nivel,
      estado: dto.estado,
      fuente: dto.fuente,
      busqueda: dto.busqueda,
      pagina: dto.pagina ?? 1,
      limite: dto.limite ?? 20,
    };
    return this.leadRepo.listar(filtros);
  }
}
