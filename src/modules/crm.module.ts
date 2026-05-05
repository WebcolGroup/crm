import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Lead } from '../Domain/Lead/entities/lead.entity';
import { Interaccion } from '../Domain/Lead/entities/interaccion.entity';
import { Cita } from '../Domain/Lead/entities/cita.entity';
import { Venta } from '../Domain/Lead/entities/venta.entity';
import { Usuario } from '../Domain/Auth/entities/usuario.entity';

// Repositorios (adaptadores)
import { LeadRepository } from '../Infrastructure/Database/repositories/lead.repository';
import { InteraccionRepository } from '../Infrastructure/Database/repositories/interaccion.repository';
import { CitaRepository } from '../Infrastructure/Database/repositories/cita.repository';
import { VentaRepository } from '../Infrastructure/Database/repositories/venta.repository';
import { UsuarioRepository } from '../Infrastructure/Database/repositories/usuario.repository';

// Puertos
import { LeadRepositoryPort } from '../Ports/repositories/lead.repository.port';
import { InteraccionRepositoryPort } from '../Ports/repositories/interaccion.repository.port';
import { CitaRepositoryPort } from '../Ports/repositories/cita.repository.port';
import { VentaRepositoryPort } from '../Ports/repositories/venta.repository.port';
import { UsuarioRepositoryPort } from '../Ports/repositories/usuario.repository.port';
import { N8nServicePort } from '../Ports/services/n8n.service.port';

// Servicio externo
import { N8nAdapter } from '../Infrastructure/ExternalServices/N8nAdapter/n8n.adapter';

// Auth
import { JwtStrategy } from '../Infrastructure/Auth/jwt.strategy';
import { JwtAuthGuard } from '../Infrastructure/Auth/jwt-auth.guard';
import { RolesGuard } from '../Infrastructure/Auth/roles.guard';

// Casos de uso
import { CrearLeadUseCase } from '../Application/Lead/use-cases/crear-lead.use-case';
import { ActualizarLeadUseCase } from '../Application/Lead/use-cases/actualizar-lead.use-case';
import { ListarLeadsUseCase } from '../Application/Lead/use-cases/listar-leads.use-case';
import { CalcularScoreUseCase } from '../Application/Lead/use-cases/calcular-score.use-case';
import { RegistrarInteraccionUseCase } from '../Application/Interaccion/use-cases/registrar-interaccion.use-case';
import { ProcesarCitaCalendlyUseCase } from '../Application/Cita/use-cases/procesar-cita-calendly.use-case';
import { MarcarCitaRealizadaUseCase } from '../Application/Cita/use-cases/marcar-cita-realizada.use-case';
import { RegistrarVentaUseCase } from '../Application/Venta/use-cases/registrar-venta.use-case';
import { LoginUseCase } from '../Application/Auth/use-cases/login.use-case';
import { ObtenerMetricasUseCase } from '../Application/Dashboard/use-cases/obtener-metricas.use-case';

// Controladores
import { LeadsController } from '../Infrastructure/Http/controllers/leads.controller';
import { InteraccionesController } from '../Infrastructure/Http/controllers/interacciones.controller';
import { WebhooksController } from '../Infrastructure/Http/controllers/webhooks.controller';
import { DashboardController } from '../Infrastructure/Http/controllers/dashboard.controller';
import { AuthController } from '../Infrastructure/Http/controllers/auth.controller';
import { VentasController } from '../Infrastructure/Http/controllers/ventas.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN', '7d') },
      }),
    }),
    TypeOrmModule.forFeature([Lead, Interaccion, Cita, Venta, Usuario]),
  ],
  controllers: [
    LeadsController,
    InteraccionesController,
    WebhooksController,
    DashboardController,
    AuthController,
    VentasController,
  ],
  providers: [
    // Vinculación puerto → adaptador (inversión de dependencia)
    { provide: LeadRepositoryPort, useClass: LeadRepository },
    { provide: InteraccionRepositoryPort, useClass: InteraccionRepository },
    { provide: CitaRepositoryPort, useClass: CitaRepository },
    { provide: VentaRepositoryPort, useClass: VentaRepository },
    { provide: UsuarioRepositoryPort, useClass: UsuarioRepository },
    { provide: N8nServicePort, useClass: N8nAdapter },

    // Auth
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,

    // Casos de uso
    CrearLeadUseCase,
    ActualizarLeadUseCase,
    ListarLeadsUseCase,
    CalcularScoreUseCase,
    RegistrarInteraccionUseCase,
    ProcesarCitaCalendlyUseCase,
    MarcarCitaRealizadaUseCase,
    RegistrarVentaUseCase,
    LoginUseCase,
    ObtenerMetricasUseCase,
  ],
  exports: [LeadRepositoryPort, N8nServicePort],
})
export class CrmModule {}
