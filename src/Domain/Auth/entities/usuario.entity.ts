import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum RolUsuario {
  ADMIN = 'admin',
  VENTAS = 'ventas',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  nombre: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column()
  password_hash: string;

  @Column({ type: 'enum', enum: RolUsuario, default: RolUsuario.VENTAS })
  rol: RolUsuario;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creado_en: Date;
}
