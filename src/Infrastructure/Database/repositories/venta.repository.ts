import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoVenta, Venta } from '../../../Domain/Lead/entities/venta.entity';
import { VentaRepositoryPort } from '../../../Ports/repositories/venta.repository.port';

@Injectable()
export class VentaRepository implements VentaRepositoryPort {
  constructor(
    @InjectRepository(Venta)
    private readonly repo: Repository<Venta>,
  ) {}

  async registrar(datos: {
    lead_id: string;
    valor: number;
    estado?: EstadoVenta;
    notas?: string;
  }): Promise<Venta> {
    const venta = this.repo.create(datos);
    return this.repo.save(venta);
  }

  async actualizarEstado(id: string, estado: EstadoVenta): Promise<void> {
    await this.repo.update(id, { estado });
  }

  async listarPorLead(lead_id: string): Promise<Venta[]> {
    return this.repo.find({ where: { lead_id }, order: { fecha_cierre: 'DESC' } });
  }

  async valorTotalCerrado(): Promise<number> {
    const result = await this.repo
      .createQueryBuilder('venta')
      .select('SUM(venta.valor)', 'total')
      .where('venta.estado = :estado', { estado: EstadoVenta.CERRADA })
      .getRawOne();
    return parseFloat(result?.total ?? '0');
  }
}
