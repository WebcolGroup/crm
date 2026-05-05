import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lead } from './lead.entity';

export enum EstadoCita {
  AGENDADA = 'agendada',
  REALIZADA = 'realizada',
  NO_SHOW = 'no_show',
  CANCELADA = 'cancelada',
}

@Entity('citas')
export class Cita {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Lead, (lead) => lead.citas, { onDelete: 'CASCADE' })
  lead: Lead;

  @Column({ name: 'lead_id' })
  lead_id: string;

  @Column({ type: 'timestamp' })
  fecha: Date;

  @Column({ type: 'enum', enum: EstadoCita, default: EstadoCita.AGENDADA })
  estado: EstadoCita;

  // URL de reunión de Calendly o meet
  @Column({ length: 500, nullable: true })
  url_reunion: string;

  // ID del evento en Calendly para reconciliar webhooks
  @Column({ length: 200, nullable: true })
  calendly_event_id: string;

  @CreateDateColumn({ name: 'creado_en' })
  creado_en: Date;
}
