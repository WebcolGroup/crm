import { Inject, Injectable } from '@nestjs/common';
import { LeadRepositoryPort } from '../../../Ports/repositories/lead.repository.port';
import { VentaRepositoryPort } from '../../../Ports/repositories/venta.repository.port';

export interface MetricasDashboard {
  total_leads: number;
  leads_hot: number;
  valor_pipeline: number;
  valor_cerrado: number;
  tasa_conversion: number;
  leads_por_estado: { estado: string; total: number }[];
  leads_recientes: any[];
}

@Injectable()
export class ObtenerMetricasUseCase {
  constructor(
    @Inject(LeadRepositoryPort)
    private readonly leadRepo: LeadRepositoryPort,
    @Inject(VentaRepositoryPort)
    private readonly ventaRepo: VentaRepositoryPort,
  ) {}

  async ejecutar(): Promise<MetricasDashboard> {
    const [leadsPorEstado, leadsHot, valorPipeline, valorCerrado, tasaConversion, leadsRecientes] =
      await Promise.all([
        this.leadRepo.contarPorEstado(),
        this.leadRepo.listarHot(),
        this.leadRepo.valorTotalPipeline(),
        this.ventaRepo.valorTotalCerrado(),
        this.leadRepo.tasaConversion(),
        this.leadRepo.leadsUltimosDias(7),
      ]);

    const total_leads = leadsPorEstado.reduce((acc, r) => acc + Number(r.total), 0);

    return {
      total_leads,
      leads_hot: leadsHot.length,
      valor_pipeline: valorPipeline,
      valor_cerrado: valorCerrado,
      tasa_conversion: tasaConversion,
      leads_por_estado: leadsPorEstado,
      leads_recientes: leadsRecientes,
    };
  }
}
