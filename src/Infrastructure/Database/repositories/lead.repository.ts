import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Lead } from '../../../Domain/Lead/entities/lead.entity';
import { LeadNivel } from '../../../Domain/Lead/value-objects/lead.enums';
import {
  FiltrosLead,
  LeadRepositoryPort,
  ResultadoPaginado,
} from '../../../Ports/repositories/lead.repository.port';

// Adaptador TypeORM — implementa el contrato LeadRepositoryPort
@Injectable()
export class LeadRepository implements LeadRepositoryPort {
  constructor(
    @InjectRepository(Lead)
    private readonly repo: Repository<Lead>,
  ) {}

  async crear(datos: Partial<Lead>): Promise<Lead> {
    const lead = this.repo.create(datos);
    return this.repo.save(lead);
  }

  async buscarPorId(id: string): Promise<Lead | null> {
    return this.repo.findOne({ where: { id }, relations: ['interacciones', 'citas', 'ventas'] });
  }

  async buscarPorEmail(email: string): Promise<Lead | null> {
    return this.repo.findOne({ where: { email } });
  }

  async listar(filtros: FiltrosLead): Promise<ResultadoPaginado<Lead>> {
    const where: any = {};
    if (filtros.nivel) where.nivel = filtros.nivel;
    if (filtros.estado) where.estado = filtros.estado;
    if (filtros.fuente) where.fuente = filtros.fuente;
    if (filtros.busqueda) where.nombre = ILike(`%${filtros.busqueda}%`);

    const pagina = filtros.pagina ?? 1;
    const limite = filtros.limite ?? 20;

    const [datos, total] = await this.repo.findAndCount({
      where,
      order: { score: 'DESC', fecha_creacion: 'DESC' },
      skip: (pagina - 1) * limite,
      take: limite,
    });

    return { datos, total, pagina, limite };
  }

  async actualizar(id: string, datos: Partial<Lead>): Promise<Lead> {
    await this.repo.update(id, datos);
    return this.repo.findOne({ where: { id } });
  }

  async listarHot(): Promise<Lead[]> {
    return this.repo.find({
      where: { nivel: LeadNivel.HOT },
      order: { score: 'DESC' },
    });
  }

  async contarPorEstado(): Promise<{ estado: string; total: number }[]> {
    return this.repo
      .createQueryBuilder('lead')
      .select('lead.estado', 'estado')
      .addSelect('COUNT(lead.id)', 'total')
      .groupBy('lead.estado')
      .getRawMany();
  }

  async valorTotalPipeline(): Promise<number> {
    const result = await this.repo
      .createQueryBuilder('lead')
      .select('SUM(lead.valor_estimado)', 'total')
      .getRawOne();
    return parseFloat(result?.total ?? '0');
  }

  async tasaConversion(): Promise<number> {
    const total = await this.repo.count();
    if (total === 0) return 0;
    const cerrados = await this.repo.count({ where: { estado: 'cerrado' as any } });
    return Math.round((cerrados / total) * 100 * 100) / 100;
  }

  async leadsUltimosDias(dias: number): Promise<Lead[]> {
    const desde = new Date();
    desde.setDate(desde.getDate() - dias);
    return this.repo
      .createQueryBuilder('lead')
      .where('lead.fecha_creacion >= :desde', { desde })
      .orderBy('lead.fecha_creacion', 'DESC')
      .getMany();
  }
}
