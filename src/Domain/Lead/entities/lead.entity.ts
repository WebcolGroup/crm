import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FuenteLead, LeadEstado, LeadNivel } from '../value-objects/lead.enums';
import { Interaccion } from './interaccion.entity';
import { Cita } from './cita.entity';
import { Venta } from './venta.entity';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  nombre: string;

  @Column({ length: 150 })
  email: string;

  @Column({ length: 30, nullable: true })
  telefono: string;

  @Column({ length: 150, nullable: true })
  empresa: string;

  @Column({ type: 'text', nullable: true })
  problema: string;

  @Column({ type: 'enum', enum: FuenteLead, default: FuenteLead.OTRO })
  fuente: FuenteLead;

  @Column({ type: 'int', default: 0 })
  score: number;

  @Column({ type: 'enum', enum: LeadNivel, default: LeadNivel.COLD })
  nivel: LeadNivel;

  @Column({ type: 'enum', enum: LeadEstado, default: LeadEstado.NUEVO })
  estado: LeadEstado;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  valor_estimado: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fecha_creacion: Date;

  @Column({ type: 'timestamp', nullable: true })
  ultima_interaccion: Date;

  @OneToMany(() => Interaccion, (interaccion) => interaccion.lead, { cascade: true })
  interacciones: Interaccion[];

  @OneToMany(() => Cita, (cita) => cita.lead, { cascade: true })
  citas: Cita[];

  @OneToMany(() => Venta, (venta) => venta.lead, { cascade: true })
  ventas: Venta[];

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizado_en: Date;
}
