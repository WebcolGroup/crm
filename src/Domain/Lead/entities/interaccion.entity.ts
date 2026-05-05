import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lead } from './lead.entity';

export enum TipoInteraccion {
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
  LLAMADA = 'llamada',
  NOTA = 'nota',
}

@Entity('interacciones')
export class Interaccion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Lead, (lead) => lead.interacciones, { onDelete: 'CASCADE' })
  lead: Lead;

  @Column({ name: 'lead_id' })
  lead_id: string;

  @Column({ type: 'enum', enum: TipoInteraccion })
  tipo: TipoInteraccion;

  @Column({ type: 'text', nullable: true })
  mensaje: string;

  @CreateDateColumn({ name: 'fecha' })
  fecha: Date;
}
