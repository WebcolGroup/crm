import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lead } from './lead.entity';

export enum EstadoVenta {
  PENDIENTE = 'pendiente',
  CERRADA = 'cerrada',
  PERDIDA = 'perdida',
}

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Lead, (lead) => lead.ventas, { onDelete: 'CASCADE' })
  lead: Lead;

  @Column({ name: 'lead_id' })
  lead_id: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  valor: number;

  @Column({ type: 'enum', enum: EstadoVenta, default: EstadoVenta.PENDIENTE })
  estado: EstadoVenta;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @CreateDateColumn({ name: 'fecha_cierre' })
  fecha_cierre: Date;
}
