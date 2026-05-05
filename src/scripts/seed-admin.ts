/**
 * Script de seed: crea el usuario admin inicial en la base de datos.
 * Uso: node dist/scripts/seed-admin.js
 * Variables requeridas en .env: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
 */
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { Usuario } from '../Domain/Auth/entities/usuario.entity';
import { Lead } from '../Domain/Lead/entities/lead.entity';
import { Interaccion } from '../Domain/Lead/entities/interaccion.entity';
import { Cita } from '../Domain/Lead/entities/cita.entity';
import { Venta } from '../Domain/Lead/entities/venta.entity';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  entities: [Usuario, Lead, Interaccion, Cita, Venta],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();
  const repo = dataSource.getRepository(Usuario);

  const existente = await repo.findOne({ where: { email: 'admin@webcol.co' } });
  if (existente) {
    console.log('Usuario admin ya existe. No se creó duplicado.');
    await dataSource.destroy();
    return;
  }

  const hash = await bcrypt.hash('Webcol2024!', 12);
  await repo.save(
    repo.create({
      nombre: 'Administrador Webcol',
      email: 'admin@webcol.co',
      password_hash: hash,
      rol: 'admin' as any,
      activo: true,
    }),
  );

  console.log('✓ Usuario admin creado: admin@webcol.co / Webcol2024!');
  console.log('  Cambia la contraseña inmediatamente en producción.');
  await dataSource.destroy();
}

seed().catch((e) => {
  console.error('Error en seed:', e);
  process.exit(1);
});
