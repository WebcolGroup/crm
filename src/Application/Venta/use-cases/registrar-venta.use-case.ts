import { Inject, Injectable } from '@nestjs/common';
import { LeadRepositoryPort } from '../../../Ports/repositories/lead.repository.port';
import { VentaRepositoryPort } from '../../../Ports/repositories/venta.repository.port';
import { LeadEstado } from '../../../Domain/Lead/value-objects/lead.enums';
import { EstadoVenta, Venta } from '../../../Domain/Lead/entities/venta.entity';

export interface RegistrarVentaInput {
  lead_id: string;
  valor: number;
  estado?: EstadoVenta;
  notas?: string;
}

@Injectable()
export class RegistrarVentaUseCase {
  constructor(
    @Inject(VentaRepositoryPort)
    private readonly ventaRepo: VentaRepositoryPort,
    @Inject(LeadRepositoryPort)
    private readonly leadRepo: LeadRepositoryPort,
  ) {}

  async ejecutar(input: RegistrarVentaInput): Promise<Venta> {
    const venta = await this.ventaRepo.registrar(input);

    if (input.estado === EstadoVenta.CERRADA) {
      await this.leadRepo.actualizar(input.lead_id, { estado: LeadEstado.CERRADO });
    }

    return venta;
  }
}
