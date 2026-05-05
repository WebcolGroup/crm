import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Lead } from '../Domain/Lead/entities/lead.entity';
import { Interaccion } from '../Domain/Lead/entities/interaccion.entity';
import { Cita } from '../Domain/Lead/entities/cita.entity';
import { Venta } from '../Domain/Lead/entities/venta.entity';
import { Usuario } from '../Domain/Auth/entities/usuario.entity';
import { CrmModule } from './crm.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        database: config.get<string>('DB_NAME'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        entities: [Lead, Interaccion, Cita, Venta, Usuario],
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),
    CrmModule,
  ],
})
export class AppModule {}
